import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "m1", wasteType: "PLASTIK_PET", weightKg: 100, pricePerKg: 3000, status: "TERSEDIA", collector: { name: "Pengepul Jaya" } }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "m2", status: "TERSEDIA" }, { status: 201 });
}
