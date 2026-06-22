import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, title: "Mock Listing", status: "TERSEDIA", weightKg: 10, pricePerKg: 2000 });
}

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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

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
        await createNotification(
          listing.userId,
          "UPDATE",
          "Sampah Anda Sedang Diambil",
          `Pengepul sedang dalam perjalanan atau sudah mengambil sampah ${listing.wasteType} Anda.`,
          params.id
        );
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
        await createNotification(
          listing.userId,
          "UPDATE",
          "Transaksi Selesai!",
          `Sampah ${listing.wasteType} Anda telah selesai diproses. Anda mendapatkan nominal yang disepakati.`,
          params.id
        );
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
