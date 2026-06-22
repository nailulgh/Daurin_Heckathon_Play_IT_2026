import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "PENGEPUL") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const listingId = params.id;
    const collectorId = (session.user as any).id;

    // Use transaction to ensure no race conditions
    const result = await prisma.$transaction(async (tx) => {
      const listing = await tx.wasteListing.findUnique({
        where: { id: listingId },
      });

      if (!listing) throw new Error("Not found");
      if (listing.status !== "TERSEDIA") throw new Error("Already claimed");

      const updatedListing = await tx.wasteListing.update({
        where: { id: listingId },
        data: { status: "DIKLAIM" },
      });

      const claim = await tx.pickupClaim.create({
        data: {
          listingId,
          collectorId,
          status: "DIKLAIM",
        },
      });

      return { listing: updatedListing, claim };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/listings/[id]/claim error:", error);
    if (error.message === "Not found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (error.message === "Already claimed") {
      return NextResponse.json(
        { error: "Listing is no longer available" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
