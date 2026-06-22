"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Truck, Map as MapIcon, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl">
          <MapIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Peta Jemput (Mock)</h1>
          <p className="mt-1 text-slate-500">
            Optimalisasi rute pengambilan sampah yang telah diklaim.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Optimizer Side Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                Route Optimizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-6 border-l-2 border-blue-200 space-y-6">
                
                {/* Point A */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-white border-2 border-blue-500 rounded-full p-0.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Titik A: Rumah Budi</p>
                    <p className="text-sm text-slate-500">Kardus, Kertas HVS • 7.2 kg</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">Estimasi: 2.3 km (7 mnt)</p>
                  </div>
                </div>

                {/* Point B */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-white border-2 border-slate-300 rounded-full p-0.5">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Titik B: Rumah Siti</p>
                    <p className="text-sm text-slate-500">Botol Kaca • 5.5 kg</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Estimasi: +1.8 km (5 mnt)</p>
                  </div>
                </div>

                {/* Base */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 bg-white border-2 border-emerald-500 rounded-full p-0.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Base Pengepul</p>
                    <p className="text-sm text-slate-500">Kembali ke gudang</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-500">Total Jarak</span>
                  <span className="font-bold text-slate-900">4.1 km</span>
                </div>
                <Button 
                  onClick={handleStartRoute}
                  disabled={isStarted}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {isStarted ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Sedang Menjemput</>
                  ) : (
                    "Mulai Pengambilan"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-100 flex-1 flex flex-col items-center justify-center relative border-4 border-white">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-20"></div>
              
              <MapPin className="w-16 h-16 text-slate-300 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-slate-400">Peta Interaktif (Simulasi)</h2>
              <p className="text-slate-500 mt-2 max-w-sm text-center">
                Dalam versi penuh, peta Leaflet.js akan dirender di sini, menampilkan rute jalan secara *real-time*.
              </p>

              {/* Decorative Pins */}
              <div className="absolute top-1/4 left-1/4">
                <MapPin className="w-8 h-8 text-blue-500 drop-shadow-md" />
                <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">Titik A</span>
              </div>
              <div className="absolute top-1/2 right-1/3">
                <MapPin className="w-8 h-8 text-slate-500 drop-shadow-md" />
                <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">Titik B</span>
              </div>
              <div className="absolute bottom-1/4 left-1/2">
                <Truck className="w-8 h-8 text-emerald-600 drop-shadow-md" />
                <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">Base</span>
              </div>
              
              {/* Decorative Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 25% 25% Q 50% 10% 66% 50% T 50% 75%" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8 8" className="opacity-50" />
              </svg>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
