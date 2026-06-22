"use client";

import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingCard from "./ListingCard";
import { FilterState } from "./FilterSidebar";
import { haversineDistance } from "@/lib/geo/haversine";

interface MarketplaceTabsProps {
  wasteListings: any[];
  materialListings: any[];
  industryDemands: any[]; // Simulated or real
  filters: FilterState;
  userLocation: { lat: number; lng: number } | null;
  onClaimWaste: (id: string) => void;
  onBuyMaterial: (id: string) => void;
  onFulfillDemand: (id: string) => void;
}

export default function MarketplaceTabs({
  wasteListings,
  materialListings,
  industryDemands,
  filters,
  userLocation,
  onClaimWaste,
  onBuyMaterial,
  onFulfillDemand,
}: MarketplaceTabsProps) {
  
  // Filter Logic
  const applyFilters = (data: any[], checkLocation: boolean = true) => {
    return data.filter((item) => {
      // 1. Waste Type
      if (filters.wasteType !== "ALL" && item.wasteType !== filters.wasteType) {
        return false;
      }
      
      // 2. Max Price
      if (filters.maxPrice !== "" && item.pricePerKg > (filters.maxPrice as number)) {
        return false;
      }

      // 3. Distance
      if (filters.maxDistanceKm !== "" && userLocation && checkLocation && item.lat && item.lng) {
        const dist = haversineDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
        if (dist > (filters.maxDistanceKm as number)) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredWaste = useMemo(() => applyFilters(wasteListings), [wasteListings, filters, userLocation]);
  const filteredMaterials = useMemo(() => applyFilters(materialListings), [materialListings, filters, userLocation]);
  const filteredDemands = useMemo(() => applyFilters(industryDemands, false), [industryDemands, filters]);

  return (
    <Tabs defaultValue="household" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8 bg-slate-100 p-1.5 rounded-xl h-auto">
        <TabsTrigger 
          value="household" 
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg py-2.5 font-medium transition-all"
        >
          <div className="flex flex-col items-center">
            <span>Sampah Terpilah</span>
            <span className="text-[10px] opacity-80 font-normal">Dari Rumah Tangga</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="collector" 
          className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-lg py-2.5 font-medium transition-all"
        >
          <div className="flex flex-col items-center">
            <span>Bahan Baku</span>
            <span className="text-[10px] opacity-80 font-normal">Stok Pengepul</span>
          </div>
        </TabsTrigger>
        <TabsTrigger 
          value="industry" 
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-lg py-2.5 font-medium transition-all"
        >
          <div className="flex flex-col items-center">
            <span>Permintaan Industri</span>
            <span className="text-[10px] opacity-80 font-normal">Kebutuhan Pabrik</span>
          </div>
        </TabsTrigger>
      </TabsList>
      
      {/* 1. HOUSEHOLD (Rumah Tangga) Tab */}
      <TabsContent value="household" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWaste.length === 0 ? (
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
                onActionClick={onClaimWaste}
              />
            ))
          )}
        </div>
      </TabsContent>
      
      {/* 2. COLLECTOR (Pengepul) Tab */}
      <TabsContent value="collector" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.length === 0 ? (
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
                onActionClick={onBuyMaterial}
              />
            ))
          )}
        </div>
      </TabsContent>

      {/* 3. INDUSTRY (Industri) Tab */}
      <TabsContent value="industry" className="mt-2 focus-visible:outline-none focus-visible:ring-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDemands.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-lg font-medium">Belum ada permintaan industri yang aktif.</p>
            </div>
          ) : (
            filteredDemands.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                cardType="INDUSTRY"
                wasteType={item.wasteType}
                purpose={`Dibutuhkan: ${item.wasteType.replace(/_/g, " ")}`}
                weightKg={item.volumeKg}
                pricePerKg={item.targetPricePerKg}
                status="DICARI"
                sellerName={item.buyer?.name}
                location={item.buyer?.address}
                onActionClick={onFulfillDemand}
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
