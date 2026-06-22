import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed 3 Rumah Tangga
  const rt1 = await prisma.user.upsert({
    where: { email: "rt1@daurin.id" },
    update: {},
    create: {
      name: "Rumah Tangga 1",
      email: "rt1@daurin.id",
      password: "hashed_password_demo123", // In a real app this should be bcrypt/argon2 hashed
      role: "RUMAH_TANGGA",
      lat: -7.9825,
      lng: 112.6308,
      address: "Jl. Veteran, Malang",
    },
  });

  const rt2 = await prisma.user.upsert({
    where: { email: "rt2@daurin.id" },
    update: {},
    create: {
      name: "Rumah Tangga 2",
      email: "rt2@daurin.id",
      password: "hashed_password_demo123",
      role: "RUMAH_TANGGA",
      lat: -7.97,
      lng: 112.62,
      address: "Jl. Soekarno Hatta, Malang",
    },
  });

  const rt3 = await prisma.user.upsert({
    where: { email: "rt@daurin.id" }, // the demo account from PRD
    update: {},
    create: {
      name: "Sari Rahmawati",
      email: "rt@daurin.id",
      password: "hashed_password_demo123",
      role: "RUMAH_TANGGA",
      lat: -7.95,
      lng: 112.61,
      address: "Jl. Ijen, Malang",
    },
  });

  // Seed 2 Pengepul
  const pengepul1 = await prisma.user.upsert({
    where: { email: "pengepul@daurin.id" }, // the demo account from PRD
    update: {},
    create: {
      name: "Budi Santoso",
      email: "pengepul@daurin.id",
      password: "hashed_password_demo123",
      role: "PENGEPUL",
      wasteTypesHandled: ["PLASTIK_PET", "PLASTIK_HDPE", "KERTAS_KARDUS"],
      lat: -7.96,
      lng: 112.62,
      address: "Jl. Kawi, Malang",
    },
  });

  const pengepul2 = await prisma.user.upsert({
    where: { email: "pengepul2@daurin.id" },
    update: {},
    create: {
      name: "Joko Anwar",
      email: "pengepul2@daurin.id",
      password: "hashed_password_demo123",
      role: "PENGEPUL",
      wasteTypesHandled: ["LOGAM_KALENG", "KACA", "ELEKTRONIK"],
      lat: -7.99,
      lng: 112.6,
      address: "Jl. Galunggung, Malang",
    },
  });

  // Seed 2 Industri
  const industri1 = await prisma.user.upsert({
    where: { email: "industri@daurin.id" }, // the demo account from PRD
    update: {},
    create: {
      name: "Andi Prasetyo (LDN)",
      email: "industri@daurin.id",
      password: "hashed_password_demo123",
      role: "INDUSTRI",
      lat: -7.92,
      lng: 112.65,
      address: "Kawasan Industri Malang",
    },
  });

  const industri2 = await prisma.user.upsert({
    where: { email: "industri2@daurin.id" },
    update: {},
    create: {
      name: "Pabrik Kertas Malang",
      email: "industri2@daurin.id",
      password: "hashed_password_demo123",
      role: "INDUSTRI",
      lat: -7.91,
      lng: 112.66,
      address: "Kawasan Industri Singosari",
    },
  });

  console.log("Seeding done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
