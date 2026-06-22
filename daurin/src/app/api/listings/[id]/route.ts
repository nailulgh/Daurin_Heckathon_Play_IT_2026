import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.wasteListing.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, lat: true, lng: true, address: true, phone: true } },
        pickupClaim: {
          include: {
            collector: { select: { name: true, phone: true } }
          }
        }
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error("GET /api/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.wasteListing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (listing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const updatedListing = await prisma.wasteListing.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.wasteListing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (listing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.wasteListing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
