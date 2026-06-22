"use client";

import React, { useState } from "react";
import WasteForm from "@/components/household/WasteForm";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HouseholdListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal memposting sampah");
      }

      toast({
        title: "Berhasil Diposting!",
        description: `Sampah ${data.wasteType.replace(/_/g, " ")} seberat ${data.weightKg}kg telah masuk ke Marketplace.`,
        variant: "default",
      });
      
      router.push("/rumah-tangga/dashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
