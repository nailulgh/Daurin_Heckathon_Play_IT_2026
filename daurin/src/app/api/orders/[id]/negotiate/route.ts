import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NegotiateSchema } from "@/lib/validators";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const userId = (session.user as any).id;

    const body = await req.json();
    const parsed = NegotiateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { type, amount, message } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        material: true,
      }
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isBuyer = order.buyerId === userId;
    const isCollector = order.material.collectorId === userId;

    if (!isBuyer && !isCollector) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (order.status === "SELESAI" || order.status === "DIBATALKAN" || order.status === "DEAL") {
      return NextResponse.json({ error: "Order is already closed" }, { status: 400 });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Create negotiation record
      const negotiation = await tx.negotiation.create({
        data: {
          orderId: params.id,
          actorId: userId,
          type,
          amount,
          message,
        }
      });

      // 2. Handle state transitions
      if (type === "OFFER" || type === "COUNTER_OFFER") {
        if (order.status === "MENUNGGU") {
          await tx.order.update({
            where: { id: params.id },
            data: { status: "NEGOSIASI" }
          });
        }
      } else if (type === "DEAL") {
        // Find the last offer to determine final price if amount isn't provided directly
        let finalPrice = amount;
        if (!finalPrice) {
           const lastOffer = await tx.negotiation.findFirst({
             where: { orderId: params.id, type: { in: ["OFFER", "COUNTER_OFFER"] } },
             orderBy: { createdAt: "desc" }
           });
           finalPrice = lastOffer?.amount || order.material.pricePerKg;
        }

        const finalTotalPrice = finalPrice * order.volumeKg;

        await tx.order.update({
          where: { id: params.id },
          data: { 
            status: "DEAL",
            finalPrice: finalPrice,
          }
        });

        await tx.materialListing.update({
          where: { id: order.materialId },
          data: { status: "TERJUAL" }
        });

        await tx.transaction.create({
          data: {
            orderId: params.id,
            amount: finalTotalPrice,
            status: "SIMULATED",
          }
        });
      } else if (type === "CANCEL") {
        await tx.order.update({
          where: { id: params.id },
          data: { status: "DIBATALKAN" }
        });
        
        await tx.materialListing.update({
          where: { id: order.materialId },
          data: { status: "TERSEDIA" }
        });
      }

      return negotiation;
    });

    const targetUserId = isBuyer ? order.material.collectorId : order.buyerId;
    let notifTitle = "Pesan Negosiasi Baru";
    let notifBody = "Ada aktivitas negosiasi baru di pesanan Anda.";
    
    if (type === "OFFER" || type === "COUNTER_OFFER") {
      notifTitle = "Penawaran Harga";
      notifBody = `Menerima penawaran harga sebesar Rp${amount}/kg.`;
    } else if (type === "DEAL") {
      notifTitle = "Negosiasi DEAL!";
      notifBody = "Harga telah disepakati dan transaksi berhasil dibuat.";
    } else if (type === "CANCEL") {
      notifTitle = "Negosiasi Dibatalkan";
      notifBody = "Pihak lain membatalkan negosiasi ini.";
    }

    await createNotification(
      targetUserId,
      "NEGOTIATION",
      notifTitle,
      notifBody,
      params.id
    );

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders/[id]/negotiate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
