import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, title: "Mock Listing", status: "TERSEDIA", weightKg: 10, pricePerKg: 2000 });
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
