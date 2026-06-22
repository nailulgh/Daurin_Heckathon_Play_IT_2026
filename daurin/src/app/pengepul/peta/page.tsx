"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Safely disable Server-Side Rendering (SSR) for the Leaflet Container wrapper
const CollectorMap = dynamic(() => import("@/components/map/CollectorMap"), { ssr: false });

export default function PengepulMapPage() {
  const { toast } = useToast();
  const [isStarted, setIsStarted] = useState(false);

  const handleStartRoute = () => {
    setIsStarted(true);
    toast({
      title: "Rute Dimulai",
      description: "Anda sedang dalam perjalanan menuju Titik A.",
      variant: "default",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Peta Pengambilan Sampah</h1>
        <p className="text-slate-500 text-sm">Optimasi rute penjemputan sampah anorganik hari ini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CollectorMap />
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
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute -left-[25px] top-0.5 bg-white rounded-full" />
                  <p className="text-sm font-semibold text-slate-800">Titik A: Rumah Budi</p>
                  <p className="text-xs text-slate-500">Plastik PET &bull; 12.5 Kg</p>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-500 absolute -left-[25px] top-0.5 bg-white rounded-full" />
                  <p className="text-sm font-semibold text-slate-800">Titik B: Rumah Siti</p>
                  <p className="text-xs text-slate-500">Kertas Kardus &bull; 8.0 Kg</p>
                </div>
              </div>

              <Button 
                onClick={handleStartRoute} 
                disabled={isStarted}
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
