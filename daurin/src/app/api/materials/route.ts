<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const CreateMaterialSchema = z.object({
  wasteType: z.enum([
    "PLASTIK_PET",
    "PLASTIK_HDPE",
    "KERTAS_KARDUS",
    "LOGAM_KALENG",
    "KACA",
    "ELEKTRONIK",
  ]),
  purpose: z.string().min(2),
  weightKg: z.number().positive(),
  pricePerKg: z.number().positive(),
  photoUrl: z.string().url().optional(),
});
=======
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateMaterialListingSchema } from "@/lib/validators";
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
<<<<<<< HEAD
    const status = searchParams.get("status") as any;
    const wasteType = searchParams.get("wasteType") as any;
    const myListings = searchParams.get("myListings");

    const session = await getServerSession(authOptions);

    const where: any = {};
    if (status) where.status = status;
    if (wasteType) where.wasteType = wasteType;
    if (myListings === "true" && session?.user) {
      where.collectorId = (session.user as any).id;
    }

    const materials = await prisma.materialListing.findMany({
      where,
      include: {
        collector: { select: { name: true, lat: true, lng: true, address: true } },
=======
    const status = searchParams.get("status") || "TERSEDIA";
    const wasteType = searchParams.get("wasteType") || undefined;
    const minPrice = searchParams.get("minPrice") || undefined;
    const maxPrice = searchParams.get("maxPrice") || undefined;
    const collectorId = searchParams.get("collectorId") || undefined;

    const materials = await prisma.materialListing.findMany({
      where: {
        ...(status !== "all" ? { status: status as any } : {}),
        ...(wasteType ? { wasteType: wasteType as any } : {}),
        ...(collectorId ? { collectorId } : {}),
        ...(minPrice || maxPrice
          ? {
              pricePerKg: {
                ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
                ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
              },
            }
          : {}),
      },
      include: {
        collector: { select: { id: true, name: true, phone: true, lat: true, lng: true } },
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
      },
      orderBy: { createdAt: "desc" },
    });

<<<<<<< HEAD
    return NextResponse.json(materials, { status: 200 });
=======
    return NextResponse.json(materials);
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
  } catch (error) {
    console.error("GET /api/materials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user as any).role !== "PENGEPUL") {
<<<<<<< HEAD
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateMaterialSchema.safeParse(body);

=======
      return NextResponse.json({ error: "Forbidden: Only Pengepul can create material listings" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateMaterialListingSchema.safeParse(body);
    
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const material = await prisma.materialListing.create({
      data: {
        ...parsed.data,
        collectorId: (session.user as any).id,
<<<<<<< HEAD
        // Optional: you can grab lat/lng from user's profile if needed
=======
        status: "TERSEDIA",
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
