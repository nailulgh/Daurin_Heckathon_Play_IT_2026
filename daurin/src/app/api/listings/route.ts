import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "1", title: "Mock Listing 1", status: "TERSEDIA", weightKg: 5, pricePerKg: 1000, user: { name: "Budi" } },
    { id: "2", title: "Mock Listing 2", status: "DIKLAIM", weightKg: 12, pricePerKg: 1500, user: { name: "Siti" } }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "3", title: "New Mock Listing", status: "TERSEDIA" }, { status: 201 });
}
