"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PackageSearch, UploadCloud } from "lucide-react";

export default function PengepulBahanBakuNewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [materialType, setMaterialType] = useState<string>("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [pricePerKg, setPricePerKg] = useState<number | "">("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialType || !weightKg || !pricePerKg) return;

    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Bahan Baku Berhasil Diposting",
        description: "Bahan baku telah dimasukkan ke marketplace industri.",
        variant: "default",
      });
      router.push("/pengepul/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl">
          <PackageSearch className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Input Bahan Baku</h1>
          <p className="mt-1 text-slate-500">
            Jual hasil pilahan sampah Anda ke industri pengolah.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Mock Upload Box */}
        <div className="space-y-2">
          <Label className="text-slate-900 font-semibold">Upload Foto Bahan Baku</Label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Tarik & lepas foto di sini</p>
            <p className="text-sm text-slate-500">Atau klik untuk menelusuri (Maks 5MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="materialType" className="text-slate-900 font-semibold">Jenis Bahan Baku</Label>
            <Select value={materialType} onValueChange={setMaterialType}>
              <SelectTrigger id="materialType" className="border-slate-200 focus:ring-blue-600">
                <SelectValue placeholder="Pilih Jenis Bahan Baku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLASTIK_PET">Cacahan Plastik PET</SelectItem>
                <SelectItem value="PLASTIK_HDPE">Cacahan Plastik HDPE</SelectItem>
                <SelectItem value="KERTAS_KARDUS">Pulp Kertas / Kardus Bekas</SelectItem>
                <SelectItem value="LOGAM_KALENG">Skrap Logam / Aluminium</SelectItem>
                <SelectItem value="KACA">Cullet Kaca</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-slate-900 font-semibold">Total Berat (Kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              min="1" 
              step="0.5"
              required 
              placeholder="Contoh: 50.5" 
              value={weightKg} 
              onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
              className="border-slate-200 focus-visible:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-slate-900 font-semibold">Harga Jual per Kg (Rp)</Label>
            <Input 
              id="price" 
              type="number" 
              min="0" 
              required 
              placeholder="Contoh: 4500" 
              value={pricePerKg} 
              onChange={(e) => setPricePerKg(e.target.value === "" ? "" : Number(e.target.value))}
              className="border-slate-200 focus-visible:ring-blue-600"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-slate-900 font-semibold">Deskripsi Kualitas (Opsional)</Label>
            <Textarea 
              id="description" 
              rows={3}
              placeholder="Misal: Cacahan plastik PET grade A, kondisi kering dan bersih..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-200 focus-visible:ring-blue-600 resize-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || !materialType || !weightKg || !pricePerKg} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 w-full md:w-auto"
          >
            {isSubmitting ? "Memposting..." : "Posting ke Marketplace"}
          </Button>
        </div>
      </form>
    </div>
  );
}
