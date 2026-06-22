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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(materials, { status: 200 });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateMaterialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const material = await prisma.materialListing.create({
      data: {
        ...parsed.data,
        collectorId: (session.user as any).id,
        // Optional: you can grab lat/lng from user's profile if needed
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
