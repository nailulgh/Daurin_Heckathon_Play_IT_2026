import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// In-memory cache for ultra-fast dashboard metrics loading
const metricsCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60 detik cache per user

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    // 1. Cek Cache (Jika ada dan masih valid, langsung kembalikan tanpa query DB!)
    const cacheKey = `dashboard_${userId}_${role}`;
    const cachedData = metricsCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cachedData.data);
    }

    if (role === "RUMAH_TANGGA") {
      const [stats, activeListings] = await Promise.all([
        prisma.wasteListing.aggregate({
          where: { userId },
          _count: { id: true },
          _sum: { weightKg: true, earnedAmount: true },
        }),
        prisma.wasteListing.count({
          where: { userId, status: "TERSEDIA" },
        })
      ]);

      const responseData = {
        role,
        totalListings: stats._count.id,
        totalWeightSold: stats._sum.weightKg || 0,
        totalEarned: stats._sum.earnedAmount || 0,
        totalIncome: stats._sum.earnedAmount || 0,
        activeListings,
      };
      
      metricsCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
      return NextResponse.json(responseData);
    }

    if (role === "PENGEPUL") {
      const [
        activeClaims,
        materialStats,
        activeMaterialListings,
        collectedStats,
        finishedClaims,
        materialOrders
      ] = await Promise.all([
        prisma.pickupClaim.count({
          where: { collectorId: userId, status: { in: ["DIKLAIM", "DIAMBIL"] } },
        }),
        prisma.materialListing.aggregate({
          where: { collectorId: userId },
          _count: { id: true },
        }),
        prisma.materialListing.count({
          where: { collectorId: userId, status: "TERSEDIA" },
        }),
        prisma.pickupClaim.aggregate({
          where: { collectorId: userId, status: "SELESAI" },
        }),
        prisma.pickupClaim.findMany({
          where: { collectorId: userId, status: "SELESAI" },
          include: { listing: { select: { weightKg: true } } },
        }),
        prisma.order.findMany({
          where: { material: { collectorId: userId }, status: "SELESAI" },
          include: { transaction: true },
        })
      ]);
      
      const totalCollectedKg = finishedClaims.reduce((acc, curr) => acc + curr.listing.weightKg, 0);
      const totalMaterialIncome = materialOrders.reduce((acc, curr) => acc + (curr.transaction?.amount || 0), 0);

      const responseData = {
        role,
        activeClaims,
        totalMaterials: materialStats._count.id,
        activeMaterialListings,
        totalCollectedKg,
        totalRevenue: totalMaterialIncome,
      };
      
      metricsCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
      return NextResponse.json(responseData);
    }

    if (role === "INDUSTRI") {
      const [orderStats, activeOrders, completedOrders] = await Promise.all([
        prisma.order.aggregate({
          where: { buyerId: userId },
          _count: { id: true },
        }),
        prisma.order.count({
          where: { buyerId: userId, status: { in: ["MENUNGGU", "NEGOSIASI"] } },
        }),
        prisma.order.findMany({
          where: { buyerId: userId, status: "SELESAI" },
          include: { transaction: true },
        })
      ]);
      
      const totalMaterialBoughtKg = completedOrders.reduce((acc, curr) => acc + curr.volumeKg, 0);
      const totalSpend = completedOrders.reduce((acc, curr) => acc + (curr.transaction?.amount || 0), 0);

      const responseData = {
        role,
        activeOrders,
        totalOrdersCompleted: completedOrders.length,
        totalMaterialBoughtKg,
        totalSpend,
      };
      
      metricsCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
      return NextResponse.json(responseData);
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
