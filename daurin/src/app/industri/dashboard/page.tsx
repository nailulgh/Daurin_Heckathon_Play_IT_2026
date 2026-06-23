import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Factory, MessageSquareText, PackageOpen } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function IndustryDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "INDUSTRI") {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch data in parallel directly on the server for zero-latency client loading
  const [activeOrders, completedOrders] = await Promise.all([
    prisma.order.count({
      where: { buyerId: userId, status: { in: ["MENUNGGU", "NEGOSIASI"] } },
    }),
    prisma.order.findMany({
      // Consider DEAL as completed for volume metrics as per previous UI text
      where: { buyerId: userId, status: { in: ["DEAL", "SELESAI"] } },
      select: { volumeKg: true }
    })
  ]);

  const totalMaterialBoughtKg = completedOrders.reduce((acc, curr) => acc + curr.volumeKg, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl shadow-sm">
          <LayoutDashboard className="w-8 h-8 text-blue-900" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Dashboard Industri</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Lacak pengadaan bahan baku dan metrik produksi pabrik Anda secara real-time.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Volume Procured */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-900 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Bahan Baku Diterima</CardTitle>
            <PackageOpen className="h-4 w-4 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{(totalMaterialBoughtKg || 0).toLocaleString("id-ID")} <span className="text-xl font-semibold text-slate-500">kg</span></div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Total akumulasi dari order yang telah Deal/Selesai</p>
          </CardContent>
        </Card>

        {/* Active Negotiations */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Menunggu Balasan B2B</CardTitle>
            <MessageSquareText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{activeOrders || 0}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Thread negosiasi aktif yang butuh tindak lanjut</p>
          </CardContent>
        </Card>

        {/* Simulated Production */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-slate-400 bg-slate-50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Simulasi Output Produksi</CardTitle>
            <Factory className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{((totalMaterialBoughtKg || 0) * 0.8).toLocaleString("id-ID")} <span className="text-xl font-semibold text-slate-500">kg</span></div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Estimasi yield produk akhir (asumsi rasio 80%)</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
