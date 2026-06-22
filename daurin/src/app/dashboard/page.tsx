"use client";

import React, { useEffect, useState } from "react";
import GlobalMetricsSummary from "@/components/dashboard/GlobalMetricsSummary";
import CO2ImpactWidget from "@/components/dashboard/CO2ImpactWidget";
import VolumeTrendChart from "@/components/dashboard/VolumeTrendChart";
import { calculateCO2Offset } from "@/lib/co2";
import { Globe } from "lucide-react";



export default function GlobalDashboardPage() {
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalCirculation, setTotalCirculation] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        const res = await fetch("/api/dashboard/impact");
        if (res.ok) {
          const data = await res.json();
          setTotalVolume(data.totalWeightKg || 0);
          setTotalCO2(data.co2OffsetKg || 0);
          setTotalCirculation(data.totalValueRp || 0);
        }
      } catch (error) {
        console.error("Failed to fetch impact data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
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
        <VolumeTrendChart data={[]} />
      </div>

    </div>
  );
}
