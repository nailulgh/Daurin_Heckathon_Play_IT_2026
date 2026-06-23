import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Truck, CheckSquare, PackageSearch } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CollectorDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "PENGEPUL") {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Zero-latency parallel database fetching
  const [
    activeClaims,
    materialStats,
    finishedClaims,
  ] = await Promise.all([
    prisma.pickupClaim.count({
      where: { collectorId: userId, status: { in: ["DIKLAIM", "DIAMBIL"] } },
    }),
    prisma.materialListing.aggregate({
      where: { collectorId: userId },
      _count: { id: true },
    }),
    prisma.pickupClaim.findMany({
      where: { collectorId: userId, status: { in: ["DIKLAIM", "DIAMBIL", "SELESAI"] } },
      include: { listing: { select: { weightKg: true, status: true } } },
    }),
  ]);

  // Calculate payload from active (DIKLAIM, DIAMBIL) claims
  const activeRoutePayloadKg = finishedClaims
    .filter(c => c.status === "DIKLAIM" || c.status === "DIAMBIL")
    .reduce((acc, curr) => acc + curr.listing.weightKg, 0);

  const totalMaterials = materialStats._count.id;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-amber-100 p-3 rounded-xl shadow-sm">
          <LayoutDashboard className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Pengepul</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Pantau beban logistik penjemputan dan stok bahan baku Anda secara instan.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Active Route Payload */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Beban Rute Aktif</CardTitle>
            <Truck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{(activeRoutePayloadKg || 0).toFixed(1)} <span className="text-xl font-semibold text-slate-500">kg</span></div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Total muatan dalam perjalanan (Diklaim/Diambil)</p>
          </CardContent>
        </Card>

        {/* Active Claims */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-slate-400 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Klaim Jemputan Aktif</CardTitle>
            <CheckSquare className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{activeClaims || 0}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Status: Menunggu / Diambil</p>
          </CardContent>
        </Card>

        {/* B2B Processed Materials */}
        <Card className="border-slate-200 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-wider">Stok Bahan Baku (B2B)</CardTitle>
            <PackageSearch className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900">{(totalMaterials || 0).toLocaleString("id-ID")} <span className="text-xl font-semibold text-slate-500">Lot</span></div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Total listing bahan baku yang pernah diinput</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
