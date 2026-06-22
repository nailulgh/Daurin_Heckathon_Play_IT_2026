"use client";

import React, { useState } from "react";
import WasteForm from "@/components/household/WasteForm";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";

export default function HouseholdListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API Call based on PRD simulated interactions
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Berhasil Diposting!",
        description: `Sampah ${data.wasteType.replace(/_/g, " ")} seberat ${data.weightKg}kg telah masuk ke Marketplace.`,
        variant: "default",
      });
      // In a real flow, we'd router.push('/rumah-tangga/dashboard') or similar.
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center space-x-3">
        <div className="bg-emerald-100 p-3 rounded-full">
          <Leaf className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Jual Sampah Terpilah</h1>
          <p className="mt-1 text-slate-500">
            Unggah foto sampah Anda dan biarkan AI kami mengkategorikannya secara otomatis.
          </p>
        </div>
      </div>
      
      <WasteForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
