"use client";

import React, { useEffect, useState } from "react";
import GlobalMetricsSummary from "@/components/dashboard/GlobalMetricsSummary";
import CO2ImpactWidget from "@/components/dashboard/CO2ImpactWidget";
import VolumeTrendChart from "@/components/dashboard/VolumeTrendChart";
import { calculateCO2Offset } from "@/lib/co2";
import { Globe } from "lucide-react";

// Mock Time Series Data for Demo purposes
const MOCK_TREND_DATA = [
  { month: "Jan", Plastik: 400, Kertas: 240, Logam: 150 },
  { month: "Feb", Plastik: 300, Kertas: 139, Logam: 200 },
  { month: "Mar", Plastik: 500, Kertas: 400, Logam: 250 },
  { month: "Apr", Plastik: 700, Kertas: 500, Logam: 300 },
  { month: "May", Plastik: 650, Kertas: 550, Logam: 380 },
  { month: "Jun", Plastik: 800, Kertas: 600, Logam: 450 },
];

export default function GlobalDashboardPage() {
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalCirculation, setTotalCirculation] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an aggregate analytics endpoint.
    // Here we will simulate the calculation based on mock data and the strict CO2 math.

    setTimeout(() => {
      // 1. Calculate mock totals based on the trend data above
      let vol = 0;
      let co2 = 0;
      
      MOCK_TREND_DATA.forEach((data) => {
        // Plastik
        vol += data.Plastik;
        co2 += calculateCO2Offset("PLASTIK_PET", data.Plastik); // using PET midpoint 1.75
        
        // Kertas
        vol += data.Kertas;
        co2 += calculateCO2Offset("KERTAS_KARDUS", data.Kertas); // 0.9
        
        // Logam
        vol += data.Logam;
        co2 += calculateCO2Offset("LOGAM_KALENG", data.Logam); // 8.75
      });

      setTotalVolume(vol);
      setTotalCO2(co2);
      
      // Simulate IDR Circulation (e.g. roughly Rp 5,000 per kg average across the board)
      setTotalCirculation(vol * 5000);
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="text-slate-500 font-medium">Memuat data analitik global...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-emerald-100 p-3 rounded-xl">
          <Globe className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dampak Global Daurin</h1>
          <p className="mt-1 text-slate-500">
            Transparansi metrik sirkulasi ekonomi hijau dan pengurangan jejak karbon.
          </p>
        </div>
      </div>

      {/* Top Row: Metrics and Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlobalMetricsSummary 
            totalVolumeKg={totalVolume} 
            totalCirculationIDR={totalCirculation} 
          />
        </div>
        <div className="lg:col-span-1">
          <CO2ImpactWidget totalCO2SavedKg={totalCO2} />
        </div>
      </div>

      {/* Bottom Row: Charts */}
      <div className="grid grid-cols-1 gap-6">
        <VolumeTrendChart data={MOCK_TREND_DATA} />
      </div>

    </div>
  );
}
