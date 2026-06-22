import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let responseData: any = { role };

    if (role === "RUMAH_TANGGA") {
      const listings = await prisma.wasteListing.findMany({
        where: { userId }
      });

      const totalListings = listings.length;
      const activeListings = listings.filter(l => l.status === "TERSEDIA" || l.status === "DIKLAIM").length;
      
      let totalWeightSold = 0;
      let totalEarned = 0;

      listings.filter(l => l.status === "SELESAI").forEach(l => {
        totalWeightSold += l.weightKg;
        totalEarned += (l.earnedAmount || (l.weightKg * l.pricePerKg));
      });

      responseData = {
        ...responseData,
        totalListings,
        totalWeightSold,
        totalIncome: totalEarned,
        totalEarned,
        activeListings
      };
    } else if (role === "PENGEPUL") {
      const pickupClaims = await prisma.pickupClaim.findMany({
        where: { collectorId: userId },
        include: { listing: true }
      });

      const materialListings = await prisma.materialListing.findMany({
        where: { collectorId: userId },
        include: { orders: true }
      });

      const activeClaims = pickupClaims.filter(c => c.status === "DIKLAIM").length;
      let totalCollectedKg = 0;

      pickupClaims.filter(c => c.status === "SELESAI").forEach(c => {
        totalCollectedKg += c.listing.weightKg;
      });

      let totalMaterialIncome = 0;
      let activeMaterialListings = materialListings.filter(m => m.status === "TERSEDIA").length;

      materialListings.forEach(m => {
        m.orders.filter(o => o.status === "DEAL" || o.status === "SELESAI").forEach(o => {
          totalMaterialIncome += (o.finalPrice || m.pricePerKg) * o.volumeKg;
        });
      });

      responseData = {
        ...responseData,
        activeClaims,
        totalCollectedKg,
        totalMaterialIncome,
        totalRevenue: totalMaterialIncome,
        activeMaterialListings
      };
    } else if (role === "INDUSTRI") {
      const orders = await prisma.order.findMany({
        where: { buyerId: userId },
        include: { material: true }
      });

      const activeOrders = orders.filter(o => o.status === "MENUNGGU" || o.status === "NEGOSIASI").length;
      const completedOrders = orders.filter(o => o.status === "DEAL" || o.status === "SELESAI");
      
      let totalSpent = 0;
      let totalMaterialBoughtKg = 0;

      completedOrders.forEach(o => {
        totalMaterialBoughtKg += o.volumeKg;
        totalSpent += (o.finalPrice || o.material.pricePerKg) * o.volumeKg;
      });

      responseData = {
        ...responseData,
        activeOrders,
        completedOrders: completedOrders.length,
        totalOrdersCompleted: completedOrders.length,
        totalSpent,
        totalSpend: totalSpent,
        totalMaterialBoughtKg
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
