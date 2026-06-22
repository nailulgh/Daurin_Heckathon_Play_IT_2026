"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Factory, MessageSquareText, PackageOpen } from "lucide-react";

interface IndustryStats {
  totalVolumeProcuredKg: number;
  activeNegotiations: number;
  simulatedProductionOutput: number;
}

export default function IndustryDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
        <p className="text-slate-500 font-medium">Memuat metrik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl">
          <LayoutDashboard className="w-8 h-8 text-blue-900" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Dashboard Industri</h1>
          <p className="mt-1 text-slate-500">
            Lacak pengadaan bahan baku dan metrik produksi pabrik.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Volume Procured */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Bahan Baku Diterima</CardTitle>
            <PackageOpen className="h-4 w-4 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{(stats.totalMaterialBoughtKg || 0).toLocaleString("id-ID")} kg</div>
            <p className="text-xs text-slate-500 mt-1">Total akumulasi dari order DEAL</p>
          </CardContent>
        </Card>

        {/* Active Negotiations */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Menunggu Balasan B2B</CardTitle>
            <MessageSquareText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.activeOrders || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Thread negosiasi aktif</p>
          </CardContent>
        </Card>

        {/* Simulated Production */}
        <Card className="border-slate-200 shadow-sm bg-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Simulasi Output Produksi</CardTitle>
            <Factory className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{((stats.totalMaterialBoughtKg || 0) * 0.8).toLocaleString("id-ID")} kg</div>
            <p className="text-xs text-slate-500 mt-1">Estimasi yield produk akhir (80%)</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
