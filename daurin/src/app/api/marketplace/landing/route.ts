import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const wasteListings = await prisma.wasteListing.findMany({
      where: { status: "TERSEDIA" },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, lat: true, lng: true } } }
    });

    const materialListings = await prisma.materialListing.findMany({
      where: { status: "TERSEDIA" },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { collector: { select: { name: true, lat: true, lng: true } } }
    });

    return NextResponse.json({
      wasteListings,
      materialListings,
      processedOutputs: [] 
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
