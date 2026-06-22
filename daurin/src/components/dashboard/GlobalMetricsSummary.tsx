"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/co2";
import { Scale, Wallet } from "lucide-react";

interface GlobalMetricsSummaryProps {
  totalVolumeKg: number;
  totalCirculationIDR: number;
}

export default function GlobalMetricsSummary({ totalVolumeKg, totalCirculationIDR }: GlobalMetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-slate-600">Total Sampah Terselamatkan</CardTitle>
          <Scale className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900">{totalVolumeKg.toLocaleString("id-ID")} kg</div>
          <p className="text-xs text-slate-500 mt-1">
            <span className="text-emerald-600 font-medium">+12%</span> dari bulan lalu
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-slate-600">Sirkulasi Ekonomi Hijau</CardTitle>
          <Wallet className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900">{formatRupiah(totalCirculationIDR)}</div>
          <p className="text-xs text-slate-500 mt-1">
            Total nilai transaksi B2B terselesaikan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
