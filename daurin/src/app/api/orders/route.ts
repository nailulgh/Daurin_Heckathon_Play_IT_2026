import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "o1", materialId: "m1", status: "NEGOSIASI", volumeKg: 50, finalPrice: 150000 }
  ]);
}
<<<<<<< HEAD
export async function POST() {
  return NextResponse.json({ id: "o2", status: "MENUNGGU" }, { status: 201 });
=======

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
>>>>>>> 0f8a44cafa872f659585a23a7995d88193afe4bd
}
