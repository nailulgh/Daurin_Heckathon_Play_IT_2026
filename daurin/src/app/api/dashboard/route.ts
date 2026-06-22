<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
=======
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
<<<<<<< HEAD
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let dashboardData: any = { role };

    if (role === "RUMAH_TANGGA") {
      const myWaste = await prisma.wasteListing.findMany({
        where: { userId },
      });
      const totalListings = myWaste.length;
      const soldListings = myWaste.filter(w => w.status === "TERJUAL");
      const totalWeightSold = soldListings.reduce((sum, w) => sum + w.weightKg, 0);
      const totalIncome = soldListings.reduce((sum, w) => sum + (w.weightKg * w.pricePerKg), 0);

      dashboardData = { ...dashboardData, totalListings, totalWeightSold, totalIncome };
    } 
    else if (role === "PENGEPUL") {
      const myClaims = await prisma.pickupClaim.findMany({
        where: { collectorId: userId, status: "LUNAS" },
        include: { listing: true },
      });
      const totalCollectedKg = myClaims.reduce((sum, claim) => sum + claim.listing.weightKg, 0);
      
      const myMaterials = await prisma.materialListing.findMany({
        where: { collectorId: userId },
      });
      const materialsSold = myMaterials.filter(m => m.status === "TERJUAL");
      const totalMaterialIncome = materialsSold.reduce((sum, m) => sum + (m.weightKg * m.pricePerKg), 0);

      dashboardData = { ...dashboardData, totalCollectedKg, totalMaterialIncome, activeMaterialListings: myMaterials.filter(m => m.status === "TERSEDIA").length };
    }
    else if (role === "INDUSTRI") {
      const myOrders = await prisma.order.findMany({
        where: { buyerId: userId, status: "DEAL" },
        include: { material: true },
      });
      const totalMaterialBoughtKg = myOrders.reduce((sum, o) => sum + o.volumeKg, 0);
      const totalSpend = myOrders.reduce((sum, o) => sum + (o.finalPrice || 0), 0);

      dashboardData = { ...dashboardData, totalMaterialBoughtKg, totalSpend, totalOrdersCompleted: myOrders.length };
    }

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
=======
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    if (role === "RUMAH_TANGGA") {
      const listings = await prisma.wasteListing.findMany({ where: { userId } });
      const totalListings = listings.length;
      const totalEarned = listings.reduce((sum, l) => sum + (l.earnedAmount || 0), 0);
      const activeListings = listings.filter(l => l.status === "TERSEDIA" || l.status === "DIKLAIM").length;

      return NextResponse.json({ totalListings, activeListings, totalEarned });
    } else if (role === "PENGEPUL") {
      const claims = await prisma.pickupClaim.findMany({ where: { collectorId: userId } });
      const materials = await prisma.materialListing.findMany({ where: { collectorId: userId } });
      
      const activeClaims = claims.filter(c => c.status === "DIKLAIM").length;
      const totalMaterials = materials.length;
      
      const orders = await prisma.order.findMany({ 
        where: { material: { collectorId: userId }, status: "DEAL" },
        include: { transaction: true }
      });
      const totalRevenue = orders.reduce((sum, o) => sum + (o.transaction?.amount || 0), 0);

      return NextResponse.json({ activeClaims, totalMaterials, totalRevenue });
    } else if (role === "INDUSTRI") {
      const orders = await prisma.order.findMany({ 
        where: { buyerId: userId },
        include: { transaction: true }
      });
      
      const activeOrders = orders.filter(o => o.status === "MENUNGGU" || o.status === "NEGOSIASI").length;
      const completedOrders = orders.filter(o => o.status === "DEAL" || o.status === "SELESAI").length;
      const totalSpent = orders.reduce((sum, o) => sum + (o.transaction?.amount || 0), 0);

      return NextResponse.json({ activeOrders, completedOrders, totalSpent });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
