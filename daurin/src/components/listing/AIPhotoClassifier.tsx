"use client";

import React, { useState, useEffect, useRef } from "react";
import { classifyWasteImage, isModelLoaded, loadModel } from "@/lib/ai/wasteClassifier";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PredictionResult {
  topClass: string;
  confidence: number;
  needsManualReview: boolean;
}

interface AIPhotoClassifierProps {
  onClassificationComplete: (file: File, result: PredictionResult | null) => void;
}

export default function AIPhotoClassifier({ onClassificationComplete }: AIPhotoClassifierProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Pre-load the model when the component mounts to save time
    if (!isModelLoaded()) {
      setLoadingMsg("Memuat model AI...");
      loadModel().then(() => {
        setLoadingMsg(null);
      }).catch(err => {
        console.error("Gagal memuat model:", err);
        setLoadingMsg(null);
      });
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setLoadingMsg("Menganalisis foto...");

    try {
      const classification = await classifyWasteImage(selectedFile);
      setResult(classification);
      onClassificationComplete(selectedFile, classification);
    } catch (err) {
      console.error("Error klasifikasi:", err);
    } finally {
      setLoadingMsg(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClassificationComplete(null as any, null); // Parent should handle clear
  };

  return (
    <Card className="p-4 border-dashed border-2 bg-green-50/50">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!file && !loadingMsg && (
        <div 
          className="flex flex-col items-center justify-center p-6 cursor-pointer text-green-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="w-12 h-12 mb-2" />
          <p className="font-semibold text-sm">Klik untuk upload foto sampah</p>
          <p className="text-xs opacity-70">AI akan mendeteksi jenisnya otomatis</p>
        </div>
      )}

      {loadingMsg && (
        <div className="flex flex-col items-center justify-center p-6 text-green-700">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="font-medium text-sm">{loadingMsg}</p>
        </div>
      )}

      {file && preview && !loadingMsg && (
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={preview} 
            alt="Preview Sampah" 
            className="w-full max-h-48 object-cover rounded-md shadow-sm"
          />
          
          {result && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Prediksi AI:</span>
                <span className="text-sm font-bold text-green-700">
                  {result.topClass.replace("_", " ")}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Progress value={result.confidence * 100} className="h-2 flex-1" />
                <span className="text-xs text-gray-500 w-8 text-right">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>

              {result.needsManualReview ? (
                <div className="flex items-start space-x-2 text-amber-600 bg-amber-50 p-2 rounded text-xs mt-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>Hasil tidak yakin — silakan pastikan dan pilih kategori manual di bawah jika salah.</p>
                </div>
              ) : (
                <div className="flex items-start space-x-2 text-green-600 bg-green-50 p-2 rounded text-xs mt-2 border border-green-100">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>AI sangat yakin dengan hasil ini.</p>
                </div>
              )}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleClear} className="w-full text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50">
            Ganti Foto
          </Button>
        </div>
      )}
    </Card>
  );
}
