"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AIPhotoClassifier from "./AIPhotoClassifier";

export default function WasteListingForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [wasteType, setWasteType] = useState<string>("");
  const [aiClassification, setAiClassification] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClassificationComplete = (selectedFile: File, result: any) => {
    setFile(selectedFile);
    if (result) {
      setWasteType(result.topClass);
      setAiClassification(JSON.stringify(result));
      if (!result.needsManualReview) {
        toast({
          title: "Berhasil dideteksi",
          description: `AI mengklasifikasikan sebagai ${result.topClass.replace("_", " ")}`,
        });
      }
    } else {
      setWasteType("");
      setAiClassification("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteType || !weightKg || !pricePerKg) {
      toast({ title: "Form tidak lengkap", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let finalPhotoUrl = photoUrl;

    try {
      // If there's a file, upload it to Supabase first
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Gagal upload foto");
        const uploadData = await uploadRes.json();
        finalPhotoUrl = uploadData.url;
      }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType,
          weightKg: parseFloat(weightKg),
          pricePerKg: parseFloat(pricePerKg),
          description,
          photoUrl: finalPhotoUrl,
          aiClassification,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat listing");
      }

      toast({
        title: "Berhasil",
        description: "Listing sampah berhasil dipublikasikan!",
      });

      router.push("/rumah-tangga/listing");
      router.refresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-green-200">
      <CardHeader className="bg-green-700 text-white rounded-t-lg">
        <CardTitle>Jual Sampah Terpilah</CardTitle>
        <CardDescription className="text-green-100">
          Upload foto sampah Anda, AI kami akan membantu mendeteksi jenisnya.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label>Foto Sampah</Label>
          <AIPhotoClassifier onClassificationComplete={handleClassificationComplete} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wasteType">Jenis Sampah</Label>
            <Select value={wasteType} onValueChange={setWasteType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis Sampah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLASTIK_PET">Plastik PET (Botol Bening)</SelectItem>
                <SelectItem value="PLASTIK_HDPE">Plastik HDPE (Botol Warna/Tebal)</SelectItem>
                <SelectItem value="KERTAS_KARDUS">Kertas & Kardus</SelectItem>
                <SelectItem value="LOGAM_KALENG">Logam & Kaleng</SelectItem>
                <SelectItem value="KACA">Kaca</SelectItem>
                <SelectItem value="ELEKTRONIK">Elektronik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightKg">Berat (Kg)</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                placeholder="Contoh: 2.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerKg">Harga / Kg (Rp)</Label>
              <Input
                id="pricePerKg"
                type="number"
                placeholder="Contoh: 3000"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Catatan (Opsional)</Label>
            <Input
              id="description"
              placeholder="Contoh: Sudah dicuci bersih"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            disabled={isSubmitting || !wasteType}
          >
            {isSubmitting ? "Memproses..." : "Publikasikan Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
