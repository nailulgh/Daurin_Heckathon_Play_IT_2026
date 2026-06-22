"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from "lucide-react";

export default function PengepulMarketplace() {
  const { toast } = useToast();
  const [claimedIds, setClaimedIds] = useState<number[]>([]);

  const mockListings = [
    { id: 1, title: "Setoran Sampah Botol Bersih", user: "Budi (Warga)", category: "Plastik PET", weight: "12.5 Kg", estPrice: "Rp 37.500" },
    { id: 2, title: "Kardus Bekas Packing Tebal", user: "Siti (Warga)", category: "Kertas Kardus", weight: "8.0 Kg", estPrice: "Rp 16.000" },
    { id: 3, title: "Kaleng Minuman Alumunium", user: "Agus (Warga)", category: "Logam Kaleng", weight: "5.0 Kg", estPrice: "Rp 25.000" }
  ];

  const handleClaim = (id: number, title: string) => {
    setClaimedIds((prev) => [...prev, id]);
    toast({
      title: "Sampah Berhasil Diklaim!",
      description: `Menerima order ${title}. Masuk ke menu Peta Jemput untuk mengambil.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Marketplace Sampah Warga</h1>
        <p className="text-slate-500 text-sm">Pilih dan klaim tumpukan sampah siap jemput dari sektor rumah tangga.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockListings.map((item) => {
          const isClaimed = claimedIds.includes(item.id);
          return (
            <Card className="border-slate-200 shadow-sm" key={item.id}>
              <CardHeader className="pb-2">
                <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-2">
                  {item.category}
                </div>
                <CardTitle className="text-base text-slate-800 line-clamp-1">{item.title}</CardTitle>
                <p className="text-xs text-slate-400">Oleh: {item.user}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm border-t border-b border-slate-100 py-2">
                  <div>
                    <p className="text-xs text-slate-400">Total Berat</p>
                    <p className="font-bold text-slate-700">{item.weight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Estimasi Payout</p>
                    <p className="font-bold text-emerald-600">{item.estPrice}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleClaim(item.id, item.title)}
                  disabled={isClaimed}
                  className={`w-full font-semibold ${isClaimed ? "bg-slate-100 text-slate-400 hover:bg-slate-100" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2"/>
                      Sudah Diklaim
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2"/>
                      Klaim Sampah
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
