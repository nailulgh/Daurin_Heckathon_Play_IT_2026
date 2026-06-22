import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MarketplaceClient from "./MarketplaceClient";

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  // Aturan Bisnis 3: Role RUMAH_TANGGA ditolak dan diredirect
  if (role === "RUMAH_TANGGA") {
    redirect("/dashboard"); // atau halaman etalase edukasi
  }

  let wasteListings: any[] = [];
  let materialListings: any[] = [];

  // Aturan Bisnis 1: Role PENGEPUL hanya melihat WasteListing
  if (role === "PENGEPUL") {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { wasteTypesHandled: true },
    });
    
    const handledTypes = dbUser?.wasteTypesHandled || [];

    wasteListings = await prisma.wasteListing.findMany({
      where: {
        status: "TERSEDIA",
        ...(handledTypes.length > 0 ? { wasteType: { in: handledTypes } } : {}),
      },
      include: {
        user: { select: { name: true, address: true } },
      },
    });
  } 
  // Aturan Bisnis 2: Role INDUSTRI hanya melihat MaterialListing
  else if (role === "INDUSTRI") {
    materialListings = await prisma.materialListing.findMany({
      where: {
        status: "TERSEDIA",
      },
      include: {
        collector: { select: { name: true, address: true } },
      },
    });
  }

  return (
    <MarketplaceClient 
      role={role}
      wasteListings={wasteListings}
      materialListings={materialListings}
    />
  );
}
