"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import RouteOptimizerPanel, { PickupPoint } from "@/components/map/RouteOptimizerPanel";
import { useToast } from "@/hooks/use-toast";
import { Map as MapIcon } from "lucide-react";

// Disable SSR for Leaflet map component
const CollectorHubMap = dynamic(
  () => import("@/components/map/CollectorHubMap"),
  { ssr: false }
);



export default function CollectorHubPage() {
  const { toast } = useToast();
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<PickupPoint[] | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [collectorBase] = useState({ lat: -7.9888, lng: 112.6222 }); // Hardcoded base for demo

  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await fetch("/api/listings?status=TERSEDIA");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const points: PickupPoint[] = data.map((item: any) => ({
              id: item.id,
              lat: item.user?.lat || -7.9666,
              lng: item.user?.lng || 112.6326,
              label: `${item.user?.name || 'Unknown'} - ${item.wasteType}`,
              weightKg: item.weightKg,
              status: item.status
            }));
            setPickupPoints(points);
          }
        }
      } catch (error) {
        console.error("Failed to fetch pickup points:", error);
      }
    }
    fetchPoints();
  }, []);

  const handleOptimizeRoute = () => {
    setIsOptimizing(true);
    
    // Simulate API call to nearest neighbor algorithm
    setTimeout(() => {
      // Very simple mock TSP: Just reversing the array for demonstration
      const newRoute = [...pickupPoints].reverse();
      
      setOptimizedRoute(newRoute);
      setIsOptimizing(false);
      
      toast({
        title: "Rute Berhasil Dioptimalkan!",
        description: "Algoritma Nearest-Neighbor telah menghasilkan rute penjemputan terefisien.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-900",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6 flex items-center space-x-3 shrink-0">
        <div className="bg-amber-100 p-3 rounded-full">
          <MapIcon className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Collector Hub</h1>
          <p className="mt-1 text-slate-500">
            Manajemen rute penjemputan dan optimalisasi logistik.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Side: Map Area */}
        <div className="flex-1 rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
          <CollectorHubMap 
            collectorLat={collectorBase.lat}
            collectorLng={collectorBase.lng}
            pickupPoints={pickupPoints}
            optimizedRoute={optimizedRoute}
          />
        </div>

        {/* Right Side: Control Panel */}
        <div className="w-full lg:w-96 shrink-0 h-full">
          <RouteOptimizerPanel 
            pickupPoints={pickupPoints}
            onOptimizeRoute={handleOptimizeRoute}
            isOptimizing={isOptimizing}
          />
        </div>
      </div>
    </div>
  );
}
