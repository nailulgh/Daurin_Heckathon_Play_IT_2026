"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Truck } from "lucide-react";

export interface PickupPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  weightKg: number;
  status: "MENUNGGU" | "TERJADWAL" | "SELESAI";
}

interface RouteOptimizerPanelProps {
  pickupPoints: PickupPoint[];
  onOptimizeRoute: () => void;
  isOptimizing: boolean;
}

export default function RouteOptimizerPanel({ 
  pickupPoints, 
  onOptimizeRoute, 
  isOptimizing 
}: RouteOptimizerPanelProps) {
  
  const totalWeight = pickupPoints.reduce((sum, p) => sum + p.weightKg, 0);

  return (
    <Card className="flex flex-col h-full border-slate-200 shadow-sm bg-white">
      <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50">
        <CardTitle className="text-xl font-bold flex items-center text-slate-900">
          <Truck className="w-6 h-6 mr-2 text-amber-500" />
          Rute Penjemputan
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          Optimalisasi Nearest-Neighbor untuk efisiensi logistik.
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center">
          <div className="text-sm font-medium text-slate-700">Total Muatan:</div>
          <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-100 font-bold text-sm">
            {totalWeight.toFixed(1)} kg
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          {pickupPoints.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Belum ada titik penjemputan.</p>
            </div>
          ) : (
            pickupPoints.map((point, index) => (
              <div 
                key={point.id} 
                className="flex items-start p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors group"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold mr-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{point.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-semibold text-slate-700">{point.weightKg} kg</span>
                  <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                    {point.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <Button 
          onClick={onOptimizeRoute} 
          disabled={isOptimizing || pickupPoints.length < 2}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
        >
          <Navigation className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          {isOptimizing ? "Menghitung Rute..." : "Optimalkan Rute (TSP)"}
        </Button>
      </div>
    </Card>
  );
}
