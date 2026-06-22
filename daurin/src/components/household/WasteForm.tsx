"use client";

import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { WasteType } from "@/components/marketplace/FilterSidebar";

export interface AIClassificationResult {
  label: WasteType;
  confidence: number;
}

interface WasteFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export default function WasteForm({ onSubmit, isSubmitting }: WasteFormProps) {
  const [wasteType, setWasteType] = useState<WasteType | "">("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [pricePerKg, setPricePerKg] = useState<number | "">("");
  const [description, setDescription] = useState("");

  // Image & AI state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<AIClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      simulateAIClassification(url, file.name); // Tambahkan file.name di sini
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      simulateAIClassification(url, file.name); // Tambahkan file.name di sini
    }
  };

  const simulateAIClassification = (imageUrl: string, fileName: string) => {
    setIsClassifying(true);
    setAiResult(null);

    // Simulate TensorFlow.js MobileNetV2 latency and inference
    setTimeout(() => {
      setIsClassifying(false);
      
      let detectedLabel: WasteType | null = null;
      const name = fileName.toLowerCase();
      
      if (name.includes("kertas") || name.includes("kardus")) detectedLabel = "KERTAS_KARDUS";
      else if (name.includes("kaca") || name.includes("gelas")) detectedLabel = "KACA";
      else if (name.includes("kaleng") || name.includes("logam") || name.includes("besi") || name.includes("aluminium")) detectedLabel = "LOGAM_KALENG";
      else if (name.includes("hdpe")) detectedLabel = "PLASTIK_HDPE";
      else if (name.includes("elektronik") || name.includes("kabel") || name.includes("tv")) detectedLabel = "ELEKTRONIK";
      else if (name.includes("botol") || name.includes("plastik") || name.includes("pet")) detectedLabel = "PLASTIK_PET";

      if (detectedLabel) {
        const mockResult: AIClassificationResult = {
          label: detectedLabel,
          confidence: 0.85 + Math.random() * 0.1,
        };
        setAiResult(mockResult);
        setWasteType(mockResult.label);
      } else {
        // Fallback to manual input if AI doesn't know
        setAiResult({ label: "MANUAL" as any, confidence: 0 });
        setWasteType("");
      }
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightKg || !pricePerKg) return;

    onSubmit({
      wasteType,
      weightKg: Number(weightKg),
      pricePerKg: Number(pricePerKg),
      description,
      photoUrl: imagePreview,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
      <div className="space-y-6">

        {/* Drag & Drop Zone */}
        <div className="space-y-2">
          <Label className="text-slate-900 font-semibold">Upload Foto Sampah (Wajib untuk AI)</Label>
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${imagePreview ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
              }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {isClassifying ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-600 mb-4"></div>
                <p className="text-emerald-700 font-semibold animate-pulse">AI sedang menganalisis jenis sampah...</p>
              </div>
            ) : imagePreview ? (
              <div className="flex flex-col items-center">
                <img src={imagePreview} alt="Preview" className="h-40 object-contain rounded-md mb-4 shadow-sm" />
                <Button type="button" variant="outline" size="sm" className="text-slate-600">Ganti Foto</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-500 cursor-pointer">
                <UploadCloud className="w-12 h-12 mb-3 text-slate-400" />
                <p className="font-medium text-slate-700">Tarik & lepas foto ke sini</p>
                <p className="text-sm mt-1">atau klik untuk menelusuri file</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Result Banner */}
        {aiResult && !isClassifying && (
          <div className={`border rounded-lg p-4 flex items-start ${aiResult.confidence > 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
            {aiResult.confidence > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
            )}
            <div>
              {aiResult.confidence > 0 ? (
                <>
                  <p className="text-sm font-bold text-emerald-900">AI Classification Berhasil</p>
                  <p className="text-sm mt-1">
                    Sistem mendeteksi <span className="font-bold">{aiResult.label.replace(/_/g, " ")}</span> dengan tingkat kepercayaan <span className="font-bold">{(aiResult.confidence * 100).toFixed(1)}%</span>.
                  </p>
                  <p className="text-xs mt-2 text-emerald-700">*Kategori telah dipilih otomatis berdasarkan hasil ini.</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-amber-900">AI Belum Dapat Mengenali</p>
                  <p className="text-sm mt-1">
                    Model AI vision saat ini belum mendeteksi jenis spesifik pada foto ini. Silakan pilih <strong>Kategori Sampah</strong> secara manual.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <Label htmlFor="wasteType" className="text-slate-900 font-semibold">Kategori Sampah</Label>
            <Select disabled={!aiResult} value={wasteType || undefined} onValueChange={(val) => setWasteType(val as WasteType)}>
              <SelectTrigger id="wasteType" className="border-slate-200 focus:ring-emerald-600 disabled:opacity-70 disabled:bg-slate-50">
                <SelectValue placeholder="Menunggu upload foto..." />
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
            <Label htmlFor="weight" className="text-slate-900 font-semibold">Berat (Kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0.1"
              step="0.1"
              required
              placeholder="0.0"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
              className="border-slate-200 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="price" className="text-slate-900 font-semibold">Harga Jual per Kg (Rp)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              required
              placeholder="Contoh: 3000"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value === "" ? "" : Number(e.target.value))}
              className="border-slate-200 focus-visible:ring-emerald-600"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description" className="text-slate-900 font-semibold">Deskripsi Singkat</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Misal: Kondisi sudah dicuci bersih, siap jemput sore hari..."
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              className="border-slate-200 focus-visible:ring-emerald-600 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !weightKg || !pricePerKg}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 w-full md:w-auto"
        >
          {isSubmitting ? "Menyimpan..." : "Posting Sampah"}
        </Button>
      </div>
    </form>
  );
}
