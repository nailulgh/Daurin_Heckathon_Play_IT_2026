"use client";

import React, { useState, useEffect } from "react";
import FilterSidebar, { FilterState } from "@/components/marketplace/FilterSidebar";
import ListingCard from "@/components/marketplace/ListingCard";
import { useToast } from "@/hooks/use-toast";
import { haversineDistance } from "@/lib/geo/haversine";

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
    toast({
      title: "Simulasi Negosiasi B2B",
      description: `Membuka thread negosiasi untuk ID bahan baku: ${id}`,
      variant: "default",
    });
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
    </div>
  );
}
