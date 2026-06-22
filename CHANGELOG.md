## [2026-06-22] — FASE 1: Fondasi Backend & Database Setup

- ✅ Init project Next.js 14 (App Router + TypeScript) dan integrasi Tailwind CSS.
- ✅ Konfigurasi dan instalasi dependensi utama: `next-auth`, `@prisma/client`, `zod`, dan `prisma`.
- ✅ Membuat `prisma/schema.prisma` sesuai spesifikasi Daurin (Tabel User, WasteListing, MaterialListing, Order, Negotiation, dll).
- ✅ Membuat setup keamanan awal: `.env.example`, konfigurasi `src/lib/auth.ts`, `src/lib/validators.ts`, dan Route Protection di `src/middleware.ts`.
- ✅ Membuat script `prisma/seed.ts` berisi data demo untuk 3 Rumah Tangga, 2 Pengepul, dan 2 Industri.

**Why it changed:**
Fase inisiasi struktur dasar Daurin berdasarkan PRD v2 dan ERD v1.0.

**Impact:**
Repository siap untuk pengembangan komponen Frontend dan integrasi API Routes.
