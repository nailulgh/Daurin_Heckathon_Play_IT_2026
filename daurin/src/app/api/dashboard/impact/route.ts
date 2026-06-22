import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCO2Offset } from "@/lib/co2";

export async function GET(req: Request) {
  try {
    const completedListings = await prisma.wasteListing.findMany({
      where: { status: "SELESAI" }
    });

    let totalWeightKg = 0;
    let co2OffsetKg = 0;
    let totalValueRp = 0;
    const byWasteType: Record<string, { weight: number, co2: number }> = {};

    completedListings.forEach(listing => {
      totalWeightKg += listing.weightKg;
      totalValueRp += (listing.earnedAmount || 0);
      
      const co2 = calculateCO2Offset(listing.wasteType, listing.weightKg);
      co2OffsetKg += co2;

      if (!byWasteType[listing.wasteType]) {
        byWasteType[listing.wasteType] = { weight: 0, co2: 0 };
      }
      byWasteType[listing.wasteType].weight += listing.weightKg;
      byWasteType[listing.wasteType].co2 += co2;
    });

    const totalTransactions = completedListings.length;

    return NextResponse.json({
      totalListings: totalTransactions,
      totalTransactions,
      totalWeightKg,
      totalValueRp,
      co2OffsetKg,
      byWasteType
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
