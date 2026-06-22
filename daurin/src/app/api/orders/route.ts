import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateOrderSchema } from "@/lib/validators";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(role === "INDUSTRI" ? { buyerId: userId } : {}),
        ...(role === "PENGEPUL" ? { material: { collectorId: userId } } : {}),
      },
      include: {
        buyer: { select: { id: true, name: true } },
        material: {
          include: {
            collector: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if ((session.user as any).role !== "INDUSTRI") {
      return NextResponse.json({ error: "Forbidden: Only Industri can create orders" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const material = await prisma.materialListing.findUnique({
      where: { id: parsed.data.materialId }
    });

    if (!material || material.status !== "TERSEDIA") {
      return NextResponse.json({ error: "Material is not available" }, { status: 400 });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId: (session.user as any).id,
          materialId: parsed.data.materialId,
          volumeKg: parsed.data.volumeKg,
          status: "MENUNGGU",
        }
      });

      await tx.materialListing.update({
        where: { id: parsed.data.materialId },
        data: { status: "DIPESAN" }
      });

      return order;
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
