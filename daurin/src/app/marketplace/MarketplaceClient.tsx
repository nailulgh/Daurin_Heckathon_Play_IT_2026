"use client";

import React, { useState, useEffect } from "react";
import FilterSidebar, { FilterState } from "@/components/marketplace/FilterSidebar";
import ListingCard from "@/components/marketplace/ListingCard";
import { useToast } from "@/hooks/use-toast";
import { haversineDistance } from "@/lib/geo/haversine";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarketplaceClientProps {
  role: string;
  wasteListings: any[];
  materialListings: any[];
}

export default function MarketplaceClient({ role, wasteListings, materialListings }: MarketplaceClientProps) {
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    wasteType: "ALL",
    maxPrice: "",
    maxDistanceKm: "",
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [volumeKg, setVolumeKg] = useState<string>("");
  const [buyerNote, setBuyerNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation disabled or failed")
      );
    }
  }, []);

  const applyFilters = (data: any[], checkLocation: boolean = true) => {
    return data.filter((item) => {
      if (filters.wasteType !== "ALL" && item.wasteType !== filters.wasteType) {
        return false;
      }
      if (filters.maxPrice !== "" && item.pricePerKg > Number(filters.maxPrice)) {
        return false;
      }
      if (filters.maxDistanceKm !== "" && userLocation && checkLocation && item.lat && item.lng) {
        const dist = haversineDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
        if (dist > Number(filters.maxDistanceKm)) {
          return false;
        }
      }
      return true;
    });
  };

  const filteredWaste = applyFilters(wasteListings);
  const filteredMaterials = applyFilters(materialListings);

  const handleClaimWaste = (id: string) => {
    toast({
      title: "Simulasi Klaim Jemputan",
      description: `Membuka konfirmasi jemputan untuk ID: ${id}`,
      variant: "default",
    });
  };

  const handleBuyMaterial = (id: string) => {
    const material = materialListings.find(m => m.id === id);
    if (material) {
      setSelectedMaterial(material);
      setVolumeKg(material.weightKg.toString());
      setBuyerNote("");
      setIsOrderDialogOpen(true);
    }
  };

  const submitOrder = async () => {
    if (!selectedMaterial) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: selectedMaterial.id,
          volumeKg: Number(volumeKg),
          buyerNote,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal membuat pesanan");
      }

      const order = await res.json();
      toast({
        title: "Pesanan Berhasil Dibuat",
        description: "Mengarahkan ke ruang negosiasi...",
        variant: "default",
        className: "bg-emerald-600 text-white border-none",
      });

      setIsOrderDialogOpen(false);
      router.push(`/industri/pesanan/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Gagal Membuka Negosiasi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-72 shrink-0">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </aside>

      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight">Marketplace Daurin</h1>
          <p className="mt-2 text-slate-500">
            {role === "PENGEPUL" ? "Jelajahi pasokan sampah terpilah dari rumah tangga." : "Jelajahi ketersediaan bahan baku dari pengepul."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {role === "PENGEPUL" && (
            filteredWaste.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-lg font-medium">Tidak ada sampah terpilah yang sesuai dengan filter.</p>
              </div>
            ) : (
              filteredWaste.map((item) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  cardType="HOUSEHOLD"
                  wasteType={item.wasteType}
                  weightKg={item.weightKg}
                  pricePerKg={item.pricePerKg}
                  status={item.status}
                  imageUrl={item.photoUrl}
                  sellerName={item.user?.name}
                  location={item.user?.address}
                  onActionClick={handleClaimWaste}
                />
              ))
            )
          )}

          {role === "INDUSTRI" && (
            filteredMaterials.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-lg font-medium">Tidak ada bahan baku pengepul yang sesuai dengan filter.</p>
              </div>
            ) : (
              filteredMaterials.map((item) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  cardType="COLLECTOR"
                  wasteType={item.wasteType}
                  purpose={item.purpose}
                  weightKg={item.weightKg}
                  pricePerKg={item.pricePerKg}
                  status={item.status}
                  imageUrl={item.photoUrl}
                  sellerName={item.collector?.name}
                  location={item.collector?.address}
                  onActionClick={handleBuyMaterial}
                />
              ))
            )
          )}
        </div>
      </div>

      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buka Negosiasi B2B</DialogTitle>
            <DialogDescription>
              Tentukan volume kebutuhan industri Anda dan berikan pesan awal untuk pengepul.
            </DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="grid gap-4 py-4">
              <div className="bg-slate-50 p-3 rounded-md border border-slate-100 text-sm mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Bahan Baku:</span>
                  <span className="font-semibold">{selectedMaterial.purpose}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Harga Penawaran:</span>
                  <span className="font-semibold text-emerald-700">Rp {selectedMaterial.pricePerKg.toLocaleString("id-ID")} / kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maks. Tersedia:</span>
                  <span className="font-semibold">{selectedMaterial.weightKg} kg</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="volumeKg">Volume Dibutuhkan (kg)</Label>
                <Input
                  id="volumeKg"
                  type="number"
                  value={volumeKg}
                  onChange={(e) => setVolumeKg(e.target.value)}
                  max={selectedMaterial.weightKg}
                  min={1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="buyerNote">Pesan / Penawaran Awal (Opsional)</Label>
                <Input
                  id="buyerNote"
                  placeholder="Misal: Saya butuh rutin 500kg per bulan..."
                  value={buyerNote}
                  onChange={(e) => setBuyerNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={submitOrder} disabled={isSubmitting || !volumeKg || Number(volumeKg) <= 0 || (selectedMaterial && Number(volumeKg) > selectedMaterial.weightKg)} className="bg-blue-900 hover:bg-blue-800 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Kirim Pesanan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
