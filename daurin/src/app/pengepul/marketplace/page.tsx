"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, CheckCircle } from "lucide-react";

export default function PengepulMarketplace() {
  const { toast } = useToast();
  const [claimedIds, setClaimedIds] = useState<string[]>([]);

  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch("/api/listings?status=TERSEDIA");
        const data = await res.json();
        if (Array.isArray(data)) {
          setListings(data);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, []);

  const handleClaim = (id: string, title: string) => {
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
        {isLoading ? (
          <p className="text-slate-500">Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="text-slate-500">Tidak ada sampah tersedia saat ini.</p>
        ) : (
          listings.map((item) => {
            const isClaimed = claimedIds.includes(item.id);
            const estPriceFormatted = item.pricePerKg ? `Rp ${(item.weightKg * item.pricePerKg).toLocaleString()}` : "N/A";
            return (
              <Card className="border-slate-200 shadow-sm" key={item.id}>
                <CardHeader className="pb-2">
                  <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit mb-2">
                    {item.wasteType}
                  </div>
                  <CardTitle className="text-base text-slate-800 line-clamp-1">{item.title}</CardTitle>
                  <p className="text-xs text-slate-400">Oleh: {item.user?.name || "Unknown"}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm border-t border-b border-slate-100 py-2">
                    <div>
                      <p className="text-xs text-slate-400">Total Berat</p>
                      <p className="font-bold text-slate-700">{item.weightKg} Kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Estimasi Payout</p>
                      <p className="font-bold text-emerald-600">{estPriceFormatted}</p>
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
          })
        )}
      </div>
    </div>
  );
}
