import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateWasteListingSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const wasteType = searchParams.get("wasteType") || undefined;
    const userId = searchParams.get("userId") || undefined;

    // TODO: Add spatial filtering (lat/lng/radius) if needed later

    const listings = await prisma.wasteListing.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(wasteType ? { wasteType: wasteType as any } : {}),
        ...(userId ? { userId } : {}),
      },
      include: {
        user: { select: { id: true, name: true, lat: true, lng: true, address: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "RUMAH_TANGGA") {
      return NextResponse.json({ error: "Forbidden: Only Rumah Tangga can create listings" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateWasteListingSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const listing = await prisma.wasteListing.create({
      data: {
        ...parsed.data,
        userId: (session.user as any).id,
        status: "TERSEDIA",
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
