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
import { CreateWasteListingSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
<<<<<<< HEAD
    const status = searchParams.get("status") as any;
    const wasteType = searchParams.get("wasteType") as any;

    const where: any = {};
    if (status) where.status = status;
    if (wasteType) where.wasteType = wasteType;

    const session = await getServerSession(authOptions);

    // If RUMAH_TANGGA, they might want to see their own listings
    const myListings = searchParams.get("myListings");
    if (myListings === "true" && session?.user) {
      where.userId = (session.user as any).id;
    }

    const listings = await prisma.wasteListing.findMany({
      where,
      include: {
        user: { select: { name: true, lat: true, lng: true, address: true } },
=======
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
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
      },
      orderBy: { createdAt: "desc" },
    });

<<<<<<< HEAD
    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
=======
    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "RUMAH_TANGGA") {
<<<<<<< HEAD
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
=======
      return NextResponse.json({ error: "Forbidden: Only Rumah Tangga can create listings" }, { status: 403 });
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    }

    const body = await req.json();
    const parsed = CreateWasteListingSchema.safeParse(body);
<<<<<<< HEAD

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
=======
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    }

    const listing = await prisma.wasteListing.create({
      data: {
        ...parsed.data,
        userId: (session.user as any).id,
<<<<<<< HEAD
=======
        status: "TERSEDIA",
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
<<<<<<< HEAD
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
=======
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
  }
}
