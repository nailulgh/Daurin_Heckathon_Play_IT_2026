"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Truck, CheckSquare, PackageSearch } from "lucide-react";

interface CollectorStats {
  activeRoutePayloadKg: number;
  activePickupClaims: number;
  processedMaterialsB2BKg: number;
}

// Mock based on PRD / Dummy Data structure
const MOCK_COLLECTOR_STATS: CollectorStats = {
  activeRoutePayloadKg: 7.5,
  activePickupClaims: 2,
  processedMaterialsB2BKg: 500,
};

export default function CollectorDashboardPage() {
  const [stats, setStats] = useState<CollectorStats | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setStats(MOCK_COLLECTOR_STATS);
    }, 500);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        <p className="text-slate-500 font-medium">Memuat metrik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-amber-100 p-3 rounded-xl">
          <LayoutDashboard className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Pengepul</h1>
          <p className="mt-1 text-slate-500">
            Pantau beban logistik penjemputan dan stok bahan baku Anda.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Active Route Payload */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Beban Rute Aktif</CardTitle>
            <Truck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.activeRoutePayloadKg.toFixed(1)} kg</div>
            <p className="text-xs text-slate-500 mt-1">Total muatan dalam perjalanan</p>
          </CardContent>
        </Card>

        {/* Active Claims */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Klaim Jemputan Aktif</CardTitle>
            <CheckSquare className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.activePickupClaims}</div>
            <p className="text-xs text-slate-500 mt-1">Status: MENUNGGU</p>
          </CardContent>
        </Card>

        {/* B2B Processed Materials */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Stok Bahan Baku (B2B)</CardTitle>
            <PackageSearch className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.processedMaterialsB2BKg.toLocaleString("id-ID")} kg</div>
            <p className="text-xs text-slate-500 mt-1">Ditawarkan di Marketplace</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
