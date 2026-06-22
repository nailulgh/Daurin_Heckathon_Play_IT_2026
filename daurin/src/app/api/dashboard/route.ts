import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
