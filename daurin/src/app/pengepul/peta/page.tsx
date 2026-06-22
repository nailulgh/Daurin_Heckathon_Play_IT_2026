"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { optimizeRoute, RoutePoint } from "@/lib/geo/routeOptimizer";

// Safely disable Server-Side Rendering (SSR) for the Leaflet Container wrapper
const CollectorMap = dynamic(() => import("@/components/map/CollectorMap"), { ssr: false });

export default function PengepulMapPage() {
  const { toast } = useToast();
  const [isStarted, setIsStarted] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [mapPoints, setMapPoints] = useState<any[]>([]);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch("/api/listings?myClaims=true");
        if (res.ok) {
          const claims = await res.json();
          if (Array.isArray(claims) && claims.length > 0) {
            // Map the API response to RoutePoint interface
            const points: RoutePoint[] = claims.map((claim) => ({
              id: claim.id,
              lat: claim.user?.lat || -7.983908,
              lng: claim.user?.lng || 112.621391,
              label: `Rumah ${claim.user?.name || "Warga"}`,
              wasteType: claim.wasteType,
            }));

            // Use the Pengepul's current location (mocked here for demo purposes as center of Malang)
            const currentLat = -7.9825;
            const currentLng = 112.6308;

            const optimized = optimizeRoute(currentLat, currentLng, points);
            setRoutePoints(optimized.orderedPoints);

            // Set map points for the map component
            setMapPoints(
              optimized.orderedPoints.map((pt) => ({
                id: pt.id,
                lat: pt.lat,
                lng: pt.lng,
                title: pt.label,
                subtitle: `${pt.wasteType}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      }
    }
    fetchClaims();
  }, []);

  const handleStartRoute = async () => {
    setIsStarted(true);

    try {
      // Mark all these claims as DIAMBIL in the backend
      const promises = routePoints.map((pt) =>
        fetch(`/api/listings/${pt.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "DIAMBIL" }),
        })
      );
      await Promise.all(promises);

      toast({
        title: "Rute Dimulai",
        description: "Status sampah diperbarui menjadi DIAMBIL. Anda sedang dalam perjalanan menuju Titik A.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Gagal Memulai Rute",
        description: "Terjadi kesalahan saat mengupdate status.",
        variant: "destructive",
      });
      setIsStarted(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Peta Pengambilan Sampah</h1>
        <p className="text-slate-500 text-sm">Optimasi rute penjemputan sampah anorganik hari ini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CollectorMap points={mapPoints} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-600" />
                Optimasi Rute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-2 border-slate-200 pl-4 space-y-4 relative ml-2">
                {routePoints.length === 0 ? (
                  <p className="text-sm text-slate-500">Tidak ada klaim aktif.</p>
                ) : (
                  routePoints.map((pt, index) => (
                    <div key={pt.id} className="relative">
                      <MapPin className="w-4 h-4 text-emerald-600 absolute -left-[25px] top-0.5 bg-white rounded-full" />
                      <p className="text-sm font-semibold text-slate-800">
                        Titik {String.fromCharCode(65 + index)}: {pt.label}
                      </p>
                      <p className="text-xs text-slate-500">{pt.wasteType}</p>
                    </div>
                  ))
                )}
              </div>

              <Button
                onClick={handleStartRoute}
                disabled={isStarted || routePoints.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold mt-4"
              >
                <Truck className="w-4 h-4 mr-2" />
                {isStarted ? "Rute Sedang Berjalan" : "Mulai Pengambilan"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
