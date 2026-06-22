const fs = require('fs');
const path = require('path');

const files_to_stub = {
    'src/app/api/dashboard/route.ts': `import { NextResponse } from "next/server";
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
`,
    'src/app/api/listings/[id]/claim/route.ts': `import { NextResponse } from "next/server";
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, message: "Claimed successfully" });
}
`,
    'src/app/api/listings/[id]/route.ts': `import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, title: "Mock Listing", status: "TERSEDIA", weightKg: 10, pricePerKg: 2000 });
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true });
}
`,
    'src/app/api/listings/route.ts': `import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "1", title: "Mock Listing 1", status: "TERSEDIA", weightKg: 5, pricePerKg: 1000, user: { name: "Budi" } },
    { id: "2", title: "Mock Listing 2", status: "DIKLAIM", weightKg: 12, pricePerKg: 1500, user: { name: "Siti" } }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "3", title: "New Mock Listing", status: "TERSEDIA" }, { status: 201 });
}
`,
    'src/app/api/materials/route.ts': `import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "m1", wasteType: "PLASTIK_PET", weightKg: 100, pricePerKg: 3000, status: "TERSEDIA", collector: { name: "Pengepul Jaya" } }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "m2", status: "TERSEDIA" }, { status: 201 });
}
`,
    'src/app/api/orders/[id]/negotiate/route.ts': `import { NextResponse } from "next/server";
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true, newPrice: 5000 });
}
`,
    'src/app/api/orders/route.ts': `import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { id: "o1", materialId: "m1", status: "NEGOSIASI", volumeKg: 50, finalPrice: 150000 }
  ]);
}
export async function POST() {
  return NextResponse.json({ id: "o2", status: "MENUNGGU" }, { status: 201 });
}
`,
    'src/app/api/upload/route.ts': `import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ url: "https://mock.url/image.png" });
}
`
};

Object.entries(files_to_stub).forEach(([filepath, content]) => {
  const absolutePath = path.join(__dirname, filepath);
  if (fs.existsSync(absolutePath)) {
    fs.writeFileSync(absolutePath, content, 'utf-8');
    console.log("Stubbed:", filepath);
  } else {
    console.log("Not found:", filepath);
  }
});

const files_to_clean = [
  'src/lib/ai/wasteClassifier.ts',
  'src/lib/co2.ts',
  'src/lib/geo/haversine.ts',
  'src/lib/geo/routeOptimizer.ts'
];

// Replaces from <<<<<<< HEAD to >>>>>>> commit with just the feature branch group
const pattern = /<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-fA-F0-9]+/g;

files_to_clean.forEach(filepath => {
  const absolutePath = path.join(__dirname, filepath);
  if (fs.existsSync(absolutePath)) {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const newContent = content.replace(pattern, (match, g1, g2) => g2);
    fs.writeFileSync(absolutePath, newContent, 'utf-8');
    console.log("Cleaned:", filepath);
  } else {
    console.log("Not found:", filepath);
  }
});

console.log("Done");
