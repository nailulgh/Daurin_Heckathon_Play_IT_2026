import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateMaterialListingSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(materials);
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
      return NextResponse.json({ error: "Forbidden: Only Pengepul can create material listings" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateMaterialListingSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const material = await prisma.materialListing.create({
      data: {
        ...parsed.data,
        collectorId: (session.user as any).id,
        status: "TERSEDIA",
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error("POST /api/materials error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
