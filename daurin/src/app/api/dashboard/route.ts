import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    if (role === "RUMAH_TANGGA") {
      const stats = await prisma.wasteListing.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { weightKg: true, earnedAmount: true },
      });
      
      const activeListings = await prisma.wasteListing.count({
        where: { userId, status: "TERSEDIA" },
      });

      return NextResponse.json({
        role,
        totalListings: stats._count.id,
        totalWeightSold: stats._sum.weightKg || 0,
        totalEarned: stats._sum.earnedAmount || 0,
        totalIncome: stats._sum.earnedAmount || 0,
        activeListings,
      });
    }

    if (role === "PENGEPUL") {
      const activeClaims = await prisma.pickupClaim.count({
        where: { collectorId: userId, status: { in: ["DIKLAIM", "DIAMBIL"] } },
      });

      const materialStats = await prisma.materialListing.aggregate({
        where: { collectorId: userId },
        _count: { id: true },
      });
      
      const activeMaterialListings = await prisma.materialListing.count({
        where: { collectorId: userId, status: "TERSEDIA" },
      });

      // Total collected from finished claims
      const collectedStats = await prisma.pickupClaim.aggregate({
        where: { collectorId: userId, status: "SELESAI" },
      });
      
      // Calculate collected weight by joining
      const finishedClaims = await prisma.pickupClaim.findMany({
        where: { collectorId: userId, status: "SELESAI" },
        include: { listing: { select: { weightKg: true } } },
      });
      
      const totalCollectedKg = finishedClaims.reduce((acc, curr) => acc + curr.listing.weightKg, 0);

      // Revenue from transactions (material sales)
      const materialOrders = await prisma.order.findMany({
        where: { material: { collectorId: userId }, status: "SELESAI" },
        include: { transaction: true },
      });
      
      const totalMaterialIncome = materialOrders.reduce((acc, curr) => acc + (curr.transaction?.amount || 0), 0);

      return NextResponse.json({
        role,
        activeClaims,
        totalMaterials: materialStats._count.id,
        activeMaterialListings,
        totalCollectedKg,
        totalRevenue: totalMaterialIncome,
      });
    }

    if (role === "INDUSTRI") {
      const orderStats = await prisma.order.aggregate({
        where: { buyerId: userId },
        _count: { id: true },
      });
      
      const activeOrders = await prisma.order.count({
        where: { buyerId: userId, status: { in: ["MENUNGGU", "NEGOSIASI"] } },
      });
      
      const completedOrders = await prisma.order.findMany({
        where: { buyerId: userId, status: "SELESAI" },
        include: { transaction: true },
      });
      
      const totalMaterialBoughtKg = completedOrders.reduce((acc, curr) => acc + curr.volumeKg, 0);
      const totalSpend = completedOrders.reduce((acc, curr) => acc + (curr.transaction?.amount || 0), 0);

      return NextResponse.json({
        role,
        activeOrders,
        totalOrdersCompleted: completedOrders.length,
        totalMaterialBoughtKg,
        totalSpend,
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
