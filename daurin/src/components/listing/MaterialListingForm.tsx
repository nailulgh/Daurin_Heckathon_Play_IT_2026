"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { UploadCloud } from "lucide-react";

export default function MaterialListingForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [wasteType, setWasteType] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [pricePerKg, setPricePerKg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteType || !weightKg || !pricePerKg || !purpose) {
      toast({ title: "Form tidak lengkap", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let finalPhotoUrl = "";

    try {
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

      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType,
          purpose,
          weightKg: parseFloat(weightKg),
          pricePerKg: parseFloat(pricePerKg),
          photoUrl: finalPhotoUrl || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat listing");
      }

      toast({
        title: "Berhasil",
        description: "Bahan baku berhasil dipublikasikan!",
      });

      router.push("/pengepul/bahan-baku");
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
        <CardTitle>Jual Bahan Baku Daur Ulang</CardTitle>
        <CardDescription className="text-green-100">
          Publikasikan bahan baku yang sudah Anda pilah/proses untuk industri.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label>Foto Bahan Baku (Opsional)</Label>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center">
            {preview ? (
              <img src={preview} alt="Preview" className="h-40 object-cover rounded-md mb-4" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wasteType">Kategori Dasar</Label>
            <Select value={wasteType} onValueChange={setWasteType}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori Dasar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLASTIK_PET">Plastik PET</SelectItem>
                <SelectItem value="PLASTIK_HDPE">Plastik HDPE</SelectItem>
                <SelectItem value="KERTAS_KARDUS">Kertas & Kardus</SelectItem>
                <SelectItem value="LOGAM_KALENG">Logam & Kaleng</SelectItem>
                <SelectItem value="KACA">Kaca</SelectItem>
                <SelectItem value="ELEKTRONIK">Elektronik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Spesifikasi / Peruntukan</Label>
            <Input
              id="purpose"
              placeholder="Contoh: Flake PET Grade A Bersih"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightKg">Berat Total (Kg)</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                placeholder="Contoh: 150"
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
                placeholder="Contoh: 8500"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Publikasikan Bahan Baku"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
