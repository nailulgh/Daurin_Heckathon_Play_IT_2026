import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        buyer: { select: { name: true, address: true, phone: true } },
        material: {
          include: {
            collector: { select: { id: true, name: true, phone: true } }
          }
        },
        negotiations: {
          include: { actor: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: "asc" }
        },
        transaction: true
      },
    });

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Validate access
    const userId = (session.user as any).id;
    if (order.buyerId !== userId && order.material.collectorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
