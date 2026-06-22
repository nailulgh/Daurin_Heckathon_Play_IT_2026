## [2026-06-22] — FASE 3: Core Logic Data/AI/Integration

- ✅ **AI Image Classifier**: Implementasi wrapper `src/lib/ai/wasteClassifier.ts` menggunakan TensorFlow.js MobileNetV2 dengan mapping output kelas ImageNet ke tipe enum Daurin.
- ✅ **Geospatial Distance**: Implementasi algoritma jarak lurus `src/lib/geo/haversine.ts`.
- ✅ **Route Optimizer**: Implementasi algoritma Nearest-Neighbor di `src/lib/geo/routeOptimizer.ts` untuk mengurutkan titik pengambilan sampah pengepul beserta estimasi biaya bahan bakar dan durasi perjalanan (berdasarkan dummy data wilayah Malang Raya).

**Why it changed:**
- Mengerjakan checklist prioritas P0 dan P1 pada Fase 3 yang bersifat *core logic* independen (tidak bergantung langsung pada komponen Frontend) sesuai roadmap.

**Impact:**
- Modul utilitas untuk AI klasifikasi sampah dan rute pengumpulan pengepul telah lengkap, siap untuk dihubungkan ke UI Frontend pada fase selanjutnya.

## [2026-06-22] — FASE 2 & 3: Fitur Pengepul, Industri, dan Aggregation (Backend)

- ✅ **API Upload**: Mengimplementasi `POST /api/upload` untuk unggah gambar ke Supabase Storage.
- ✅ **API Material Listings**: Mengimplementasi CRUD untuk `MATERIAL_LISTINGS` (`POST`, `GET`, `PATCH`, `DELETE`).
- ✅ **API Orders & Negotiation**: Mengimplementasi `POST /api/orders` dan logic state machine `POST /api/orders/[id]/negotiate` yang meng-handle `OFFER`, `COUNTER_OFFER`, `DEAL`, `CANCEL`, serta auto-create `TRANSACTION`.
- ✅ **API Dashboard & Marketplace**: Mengimplementasi endpoint `/api/dashboard`, `/api/dashboard/impact`, dan `/api/marketplace/landing` untuk data agregasi.
- ✅ **Listing Lifecycle**: Menambahkan transisi `SELESAI` pada `PATCH /api/listings/[id]` beserta perhitungan nominal harga.
- ✅ **CO2 Library**: Membuat utilitas untuk konversi jejak karbon (`src/lib/co2.ts`).
- ✅ **Database Seed**: Mengupdate script `prisma/seed.ts` dengan dummy data lengkap yang mencakup listings, claims, materials, orders, dan transactions.

**Why it changed:**
- Menyelesaikan seluruh *core feature API routes* untuk fase Pengepul dan Industri, serta menyiapkan endpoints public untuk *marketplace* dan dashboard agregasi CO2.

**Impact:**
- Fondasi *backend/API* telah rampung dan siap dikonsumsi oleh UI Frontend. Seluruh skenario (dari upload sampah hingga deal transaksi material) sudah dapat dieksekusi.

## [2026-06-22] — FASE 2: Fitur Core (Rumah Tangga Listing)

- ✅ **API Waste Listings**: Mengimplementasi `GET /api/listings` untuk filter status (marketplace) dan spesifik `userId`.
- ✅ **API Waste Listings**: Mengimplementasi `POST /api/listings` dengan RoleGuard (hanya Rumah Tangga yang dapat mem-posting).
- ✅ **API Detail Listing**: Mengimplementasi `GET /api/listings/[id]`, `PATCH`, dan `DELETE`.
- ✅ **API Claim Listing**: Mengimplementasi `POST /api/listings/[id]/claim` (Atomic Transaction via Prisma) khusus untuk role Pengepul.

**Why it changed:**
- Membangun fitur inti (CRUD) bagi Rumah Tangga untuk memposting sampah daur ulang, yang kemudian bisa diakses di Peta Kolektor.

**Impact:**
- Backend API untuk *Waste Listings* selesai secara end-to-end. Endpoint API ini siap dihubungkan dengan komponen frontend `<WasteListingForm />`.

## [2026-06-22] — FASE 2: Fitur Core (Auth & RBAC)

- ✅ **Backend Auth**: Mengimplementasi `POST /api/auth/register` API untuk pendaftaran user (Rumah Tangga, Pengepul, Industri).
- ✅ **Frontend Auth**: Membuat komponen form `RegisterForm` dan `LoginForm` yang terhubung ke API backend.
- ✅ Menerapkan Zod validation di form registrasi dan login.
- ✅ Memasang route protection lewat Next.js Middleware dan NextAuth callbacks.
- ✅ Install ulang paket Prisma yang sebelumnya sempat gagal (Network error `ECONNRESET`).
- ✅ **FIX**: Downgrade versi Prisma dari v7.8.0 ke v5.22.0. Hal ini dilakukan untuk menyelesaikan error validasi schema P1012 karena property `url` dan `directUrl` tidak lagi didukung secara bawaan di file `schema.prisma` pada Prisma v7. Downgrade ini menjaga konsistensi dengan instruksi arsitektur Daurin pada `AGENTS.md`.

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
