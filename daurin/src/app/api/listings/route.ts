import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateWasteListingSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;
    const wasteType = searchParams.get("wasteType") as any;

    const where: any = {};
    if (status) where.status = status;
    if (wasteType) where.wasteType = wasteType;

    const session = await getServerSession(authOptions);

    const myListings = searchParams.get("myListings");
    const myClaims = searchParams.get("myClaims");
    
    if (myListings === "true" && session?.user) {
      where.userId = (session.user as any).id;
    } else if (myClaims === "true" && session?.user) {
      where.pickupClaim = { collectorId: (session.user as any).id };
      where.status = "DIKLAIM";
    }

    const listings = await prisma.wasteListing.findMany({
      where,
      include: {
        user: { select: { name: true, lat: true, lng: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "RUMAH_TANGGA") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateWasteListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const listing = await prisma.wasteListing.create({
      data: {
        ...parsed.data,
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
