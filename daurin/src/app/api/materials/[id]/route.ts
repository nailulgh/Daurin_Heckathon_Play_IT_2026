import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const material = await prisma.materialListing.findUnique({
      where: { id: params.id },
      include: {
        collector: { select: { name: true, lat: true, lng: true, address: true, phone: true } },
      },
    });

    if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const material = await prisma.materialListing.findUnique({ where: { id: params.id } });
    if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (material.collectorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (material.status !== "TERSEDIA") {
      return NextResponse.json({ error: "Cannot modify a material listing that is not available" }, { status: 400 });
    }

    const body = await req.json();
    
    // Ensure status isn't incorrectly changed by basic PATCH
    if (body.status && body.status !== "TERSEDIA") {
       return NextResponse.json({ error: "Cannot manually change status beyond TERSEDIA using PATCH" }, { status: 400 });
    }

    const updated = await prisma.materialListing.update({
      where: { id: params.id },
      data: body,
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const material = await prisma.materialListing.findUnique({ where: { id: params.id } });
    if (!material) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (material.collectorId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (material.status !== "TERSEDIA") {
      return NextResponse.json({ error: "Cannot delete a material listing that is not available" }, { status: 400 });
    }

    await prisma.materialListing.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
