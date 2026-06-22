<<<<<<< HEAD
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
=======
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
  try {
    const listing = await prisma.wasteListing.findUnique({
      where: { id: params.id },
      include: {
<<<<<<< HEAD
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
=======
        user: { select: { name: true, lat: true, lng: true, address: true } },
        pickupClaim: {
          include: { collector: { select: { name: true, phone: true } } },
        },
      },
    });

    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(listing);
  } catch (error) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

<<<<<<< HEAD
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
=======
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listing = await prisma.wasteListing.findUnique({ where: { id: params.id } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only owner or a claiming collector can patch
    const isOwner = listing.userId === (session.user as any).id;
    const isCollector = (session.user as any).role === "PENGEPUL";

    if (!isOwner && !isCollector) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

<<<<<<< HEAD
    const updatedListing = await prisma.wasteListing.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/listings/[id] error:", error);
=======
    // If collector marks as DIAMBIL or SELESAI
    if (isCollector && (body.status === "DIAMBIL" || body.status === "SELESAI")) {
      const claim = await prisma.pickupClaim.findUnique({ where: { listingId: params.id } });
      if (!claim || claim.collectorId !== (session.user as any).id) {
        return NextResponse.json({ error: "Forbidden: Not your claim" }, { status: 403 });
      }

      if (body.status === "DIAMBIL") {
        const updated = await prisma.$transaction([
          prisma.pickupClaim.update({
            where: { listingId: params.id },
            data: { status: "DIAMBIL", pickedAt: new Date() },
          }),
          prisma.wasteListing.update({
            where: { id: params.id },
            data: { status: "DIAMBIL" },
          })
        ]);
        return NextResponse.json(updated[1]);
      } else if (body.status === "SELESAI") {
        const finalPrice = body.finalPrice || (listing.weightKg * listing.pricePerKg);
        const updated = await prisma.$transaction([
          prisma.pickupClaim.update({
            where: { listingId: params.id },
            data: { status: "SELESAI" },
          }),
          prisma.wasteListing.update({
            where: { id: params.id },
            data: { status: "SELESAI", earnedAmount: finalPrice },
          })
        ]);
        return NextResponse.json(updated[1]);
      }
    }

    // Owner patching their listing
    if (isOwner) {
      const updated = await prisma.wasteListing.update({
        where: { id: params.id },
        data: body,
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid patch request" }, { status: 400 });
  } catch (error) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

<<<<<<< HEAD
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
=======
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const listing = await prisma.wasteListing.findUnique({ where: { id: params.id } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613

    if (listing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

<<<<<<< HEAD
    await prisma.wasteListing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/listings/[id] error:", error);
=======
    if (listing.status !== "TERSEDIA") {
      return NextResponse.json({ error: "Cannot delete a claimed listing" }, { status: 400 });
    }

    await prisma.wasteListing.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
>>>>>>> 9a952f169485bb6e257b60205f226ceaa840f613
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
