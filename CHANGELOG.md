## [2026-06-22] — FASE 2: Fitur Core (Auth & RBAC)

- ✅ **Backend Auth**: Mengimplementasi `POST /api/auth/register` API untuk pendaftaran user (Rumah Tangga, Pengepul, Industri).
- ✅ **Frontend Auth**: Membuat komponen form `RegisterForm` dan `LoginForm` yang terhubung ke API backend.
- ✅ Menerapkan Zod validation di form registrasi dan login.
- ✅ Memasang route protection lewat Next.js Middleware dan NextAuth callbacks.
- ✅ Install ulang paket Prisma yang sebelumnya sempat gagal (Network error `ECONNRESET`).

**Why it changed:**
- Menyelesaikan prioritas Fase 2 awal (jam 3-5) yang mewajibkan seluruh flow registrasi dan autentikasi fungsional agar proses marketplace dan negosiasi aman.

**Impact:**
- Modul autentikasi telah lengkap. Lanjut siap mengerjakan Listing Sampah (CRUD).

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
