import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    role: "RUMAH_TANGGA",
    totalListings: 10,
    totalWeightSold: 50.5,
    totalIncome: 150000,
    totalEarned: 150000,
    activeListings: 2,
    activeClaims: 0,
    totalMaterials: 0,
    totalCollectedKg: 0,
    totalMaterialIncome: 0,
    totalRevenue: 0,
    activeMaterialListings: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    totalMaterialBoughtKg: 0,
    totalSpend: 0,
    totalOrdersCompleted: 0
  });
}
