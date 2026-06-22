import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const VALID_TRANSITIONS: Record<string, string[]> = {
  'MENUNGGU':    ['NEGOSIASI'],
  'NEGOSIASI':   ['NEGOSIASI', 'DEAL', 'DIBATALKAN'],
  'DEAL':        [],
  'DIBATALKAN':  [],
};

const TYPE_TO_STATUS: Record<string, string> = {
  'OFFER':         'NEGOSIASI',
  'COUNTER_OFFER': 'NEGOSIASI',
  'DEAL':          'DEAL',
  'CANCEL':        'DIBATALKAN',
};

const NegotiateSchema = z.object({
  type: z.enum(["OFFER", "COUNTER_OFFER", "DEAL", "CANCEL"]),
  amount: z.number().optional(),
  message: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const actorId = (session.user as any).id;
    const body = await req.json();
    const parsed = NegotiateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { type, amount, message } = parsed.data;

    // Execute in transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: params.id },
        include: { material: true },
      });

      if (!order) throw new Error("Order not found");

      // Verify actor is either the buyer or the seller
      if (order.buyerId !== actorId && order.material.collectorId !== actorId) {
        throw new Error("Forbidden");
      }

      const currentStatus = order.status;
      const nextStatus = TYPE_TO_STATUS[type];

      // Validate transition
      if (!VALID_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
        throw new Error(`Invalid transition from ${currentStatus} to ${nextStatus}`);
      }

      // Create the negotiation log
      const negotiation = await tx.negotiation.create({
        data: {
          orderId: order.id,
          actorId,
          type: type as any,
          amount: amount || order.finalPrice || undefined, // fallback to previous price
          message,
        },
      });

      // Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: nextStatus as any,
          finalPrice: type === 'DEAL' ? amount || order.finalPrice : undefined,
        },
      });

      // If DEAL, auto-create Transaction and mark MaterialListing as TERJUAL
      if (nextStatus === "DEAL") {
        await tx.transaction.create({
          data: {
            orderId: order.id,
            amount: amount || order.finalPrice || 0,
            status: "SIMULATED_LUNAS",
          },
        });

        await tx.materialListing.update({
          where: { id: order.materialId },
          data: { status: "TERJUAL" },
        });
      }

      // If CANCEL, revert MaterialListing back to TERSEDIA
      if (nextStatus === "DIBATALKAN") {
        await tx.materialListing.update({
          where: { id: order.materialId },
          data: { status: "TERSEDIA" },
        });
      }

      return { order: updatedOrder, negotiation };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders/[id]/negotiate error:", error);
    if (error.message === "Forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (error.message === "Order not found") return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 400 });
  }
}
