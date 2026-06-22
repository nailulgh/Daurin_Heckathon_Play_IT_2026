"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/co2";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const pathname = typeof window !== 'undefined' ? window.location.pathname : "";

  useEffect(() => {
    // BYPASSED FOR PURE FRONT-END MOCK MODE
    let mockData: any = { role: "RUMAH_TANGGA", totalListings: 5, totalWeightSold: 12.5, totalIncome: 45000 };
    
    if (pathname.includes("/pengepul")) {
      mockData = { role: "PENGEPUL", totalCollectedKg: 120, activeMaterialListings: 3, totalMaterialIncome: 350000 };
    } else if (pathname.includes("/industri")) {
      mockData = { role: "INDUSTRI", totalMaterialBoughtKg: 500, totalSpend: 1500000, totalOrdersCompleted: 12 };
    }

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 400);
  }, [pathname]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Memuat dashboard...</div>;
  }

  if (!data) return <div className="p-8 text-center text-red-500">Gagal memuat data</div>;

  const { role } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 border-b pb-2">Ringkasan Aktivitas ({role.replace("_", " ")})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === "RUMAH_TANGGA" && (
          <>
            <StatCard title="Total Listing" value={data.totalListings} suffix="sampah" />
            <StatCard title="Sampah Terjual" value={`${data.totalWeightSold} kg`} />
            <StatCard title="Total Pendapatan" value={formatRupiah(data.totalIncome || 0)} highlight />
          </>
        )}

        {role === "PENGEPUL" && (
          <>
            <StatCard title="Sampah Terkumpul" value={`${data.totalCollectedKg} kg`} />
            <StatCard title="Bahan Baku Aktif" value={data.activeMaterialListings} suffix="listing" />
            <StatCard title="Pendapatan Industri" value={formatRupiah(data.totalMaterialIncome || 0)} highlight />
          </>
        )}

        {role === "INDUSTRI" && (
          <>
            <StatCard title="Bahan Baku Dibeli" value={`${data.totalMaterialBoughtKg} kg`} />
            <StatCard title="Total Pengeluaran" value={formatRupiah(data.totalSpend || 0)} highlight />
            <StatCard title="Transaksi Selesai" value={data.totalOrdersCompleted} suffix="pesanan" />
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, suffix, highlight }: { title: string; value: string | number; suffix?: string; highlight?: boolean }) {
  return (
    <Card className={`border-l-4 ${highlight ? 'border-l-amber-500 bg-amber-50' : 'border-l-green-600'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-500 font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? 'text-amber-700' : 'text-gray-800'}`}>
          {value} {suffix && <span className="text-base font-normal text-gray-500">{suffix}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
