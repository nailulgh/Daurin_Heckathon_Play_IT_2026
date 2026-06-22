import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "o1", materialId: "m1", status: "NEGOSIASI", volumeKg: 50, finalPrice: 150000 }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "o2", status: "MENUNGGU" }, { status: 201 });
}
