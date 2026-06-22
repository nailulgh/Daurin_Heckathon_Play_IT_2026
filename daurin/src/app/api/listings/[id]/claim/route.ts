import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    if (role !== "PENGEPUL") {
      return NextResponse.json({ error: "Forbidden: Only Pengepul can claim listings" }, { status: 403 });
    }

    const listing = await prisma.wasteListing.findUnique({
      where: { id: params.id }
    });

    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (listing.status !== "TERSEDIA") {
      return NextResponse.json({ error: "Listing is no longer available" }, { status: 400 });
    }

    // Atomic transaction: Create claim and update listing status
    const transaction = await prisma.$transaction([
      prisma.pickupClaim.create({
        data: {
          listingId: params.id,
          collectorId: (session.user as any).id,
          status: "DIKLAIM"
        }
      }),
      prisma.wasteListing.update({
        where: { id: params.id },
        data: { status: "DIKLAIM" }
      })
    ]);

    // Send notification to the household (RT)
    await createNotification(
      listing.userId,
      "CLAIM",
      "Sampah Anda Diklaim!",
      `Seorang pengepul telah mengklaim sampah ${listing.wasteType} Anda dan akan segera mengambilnya.`,
      params.id
    );

    return NextResponse.json(transaction[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/listings/[id]/claim error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
