"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/co2";
import { LayoutDashboard, Scale, ListChecks, Wallet, PackageCheck } from "lucide-react";

interface HouseholdStats {
  totalWeightKg: number;
  totalEarningsIDR: number;
  activeListings: number;
  completedListings: number;
}

// Mock based on PRD / Dummy Data structure
const MOCK_HOUSEHOLD_STATS: HouseholdStats = {
  totalWeightKg: 12.5,
  totalEarningsIDR: 45000,
  activeListings: 2,
  completedListings: 5,
};

export default function HouseholdDashboardPage() {
  const [stats, setStats] = useState<HouseholdStats | null>(null);

  useEffect(() => {
    // Simulate data fetch based on session role
    setTimeout(() => {
      setStats(MOCK_HOUSEHOLD_STATS);
    }, 500);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="text-slate-500 font-medium">Memuat metrik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-emerald-100 p-3 rounded-xl">
          <LayoutDashboard className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Rumah Tangga</h1>
          <p className="mt-1 text-slate-500">
            Pantau kontribusi pemilahan sampah dan pendapatan Anda.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Weight */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Total Berat Disetorkan</CardTitle>
            <Scale className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalWeightKg.toFixed(1)} kg</div>
            <p className="text-xs text-slate-500 mt-1">Akumulasi keseluruhan</p>
          </CardContent>
        </Card>

        {/* Total Earnings */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Total Pendapatan</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-600">{formatRupiah(stats.totalEarningsIDR)}</div>
            <p className="text-xs text-emerald-700/70 mt-1 font-medium">Saldo dicairkan</p>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Listing Aktif</CardTitle>
            <ListChecks className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.activeListings}</div>
            <p className="text-xs text-slate-500 mt-1">Status: Tersedia / Diklaim</p>
          </CardContent>
        </Card>

        {/* Completed Listings */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600">Transaksi Selesai</CardTitle>
            <PackageCheck className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{stats.completedListings}</div>
            <p className="text-xs text-slate-500 mt-1">Sukses dijemput pengepul</p>
          </CardContent>
        </Card>

      </div>

      {/* Tracking Table */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Status Penjualan Sampah Anda</h2>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                  <th className="py-4 px-6">Tanggal</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Berat</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: "LST-001", date: "20 Jun 2025", category: "Plastik PET", weight: 3.5, status: "Tersedia", badge: "bg-emerald-100 text-emerald-800" },
                  { id: "LST-003", date: "19 Jun 2025", category: "Besi/Baja", weight: 8.0, status: "Diklaim oleh Rudi Scrap", badge: "bg-blue-100 text-blue-800" },
                  { id: "LST-002", date: "18 Jun 2025", category: "Kardus", weight: 7.2, status: "Selesai Diambil", badge: "bg-slate-100 text-slate-800" },
                ].map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-600">{item.date}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{item.category}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{item.weight} kg</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.badge}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
