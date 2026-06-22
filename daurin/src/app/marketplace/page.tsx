"use client";

import React, { useEffect, useState } from "react";
import FilterSidebar, { FilterState } from "@/components/marketplace/FilterSidebar";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { useToast } from "@/hooks/use-toast";

export default function MarketplacePage() {
  const { toast } = useToast();
  
  const [waste, setWaste] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [industryDemands, setIndustryDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    wasteType: "ALL",
    maxPrice: "",
    maxDistanceKm: "",
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Attempt to get user location for distance calculations
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocation disabled or failed")
      );
    }

    // Fetch data - BYPASSED FOR PURE FRONT-END PROTOTYPE
    const mockWasteData = [
      { id: "LST-001", wasteType: "PLASTIK_PET", weightKg: 3.5, pricePerKg: 12000, status: "TERSEDIA", locationLat: -7.9539, locationLng: 112.6131 },
      { id: "LST-004", wasteType: "PLASTIK_MIX", weightKg: 4.0, pricePerKg: 4000, status: "TERSEDIA", locationLat: -7.9664, locationLng: 112.6326 },
      { id: "LST-005", wasteType: "KACA", weightKg: 5.5, pricePerKg: 4000, status: "TERSEDIA", locationLat: -7.9797, locationLng: 112.6208 },
    ];

    const mockMaterialData = [
      { id: "BB-001", wasteType: "KERTAS_KARDUS", weightKg: 6.8, pricePerKg: 1800, status: "TERSEDIA" },
      { id: "BB-003", wasteType: "LOGAM_KALENG", weightKg: 1.7, pricePerKg: 15000, status: "TERSEDIA" },
      { id: "BB-004", wasteType: "PLASTIK_PET", weightKg: 3.3, pricePerKg: 4200, status: "TERSEDIA" },
    ];

    Promise.all([
      Promise.resolve(mockWasteData),
      Promise.resolve(mockMaterialData),
      Promise.resolve([]) 
    ]).then(([wData, mData, iData]) => {
      setWaste(Array.isArray(wData) ? wData : []);
      setMaterials(Array.isArray(mData) ? mData : []);
      setIndustryDemands(Array.isArray(iData) ? iData : []);
      setLoading(false);
    });
  }, []);

  const handleClaimWaste = (id: string) => {
    toast({
      title: "Simulasi Klaim Jemputan",
      description: `Membuka konfirmasi jemputan untuk ID: ${id}`,
      variant: "default",
    });
  };

  const handleBuyMaterial = (id: string) => {
    toast({
      title: "Simulasi Negosiasi B2B",
      description: `Membuka thread negosiasi untuk ID bahan baku: ${id}`,
      variant: "default",
    });
  };

  const handleFulfillDemand = (id: string) => {
    toast({
      title: "Simulasi Pemenuhan Permintaan",
      description: `Menyanggupi permintaan industri ID: ${id}`,
      variant: "default",
    });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-72 shrink-0">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-800 tracking-tight">Marketplace Daurin</h1>
          <p className="mt-2 text-slate-500">
            Jelajahi pasokan sampah terpilah, ketersediaan bahan baku, dan permintaan industri secara real-time.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            <p className="text-slate-500 font-medium">Memuat data marketplace...</p>
          </div>
        ) : (
          <MarketplaceTabs
            wasteListings={waste}
            materialListings={materials}
            industryDemands={industryDemands}
            filters={filters}
            userLocation={userLocation}
            onClaimWaste={handleClaimWaste}
            onBuyMaterial={handleBuyMaterial}
            onFulfillDemand={handleFulfillDemand}
          />
        )}
      </div>
    </div>
  );
}
