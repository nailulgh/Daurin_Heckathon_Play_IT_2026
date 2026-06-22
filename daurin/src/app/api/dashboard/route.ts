import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
