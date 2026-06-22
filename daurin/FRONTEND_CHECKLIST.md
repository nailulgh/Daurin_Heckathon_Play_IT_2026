# 🖥️ Status Checklist Frontend Daurin

Berdasarkan pengecekan direktori `src/app`, `src/components`, serta file dokumentasi `ROADMAP.md` dan `CHANGELOG.md`, berikut adalah status pengerjaan spesifik untuk sisi Frontend.

Sebagian besar antarmuka (UI/UX) dan *routing* halaman telah selesai dibuat (Scaffolding selesai), namun **sebagian besar masih menggunakan Mock Data / Simulasi API** dan belum terhubung dengan endpoint backend yang sebenarnya sudah selesai dikerjakan.

## 1. 🔐 Autentikasi & Layout Global (FR-001)
- [x] **Setup Tailwind, Shadcn/UI, Theme Tokens**
- [x] **Global Layout** (Navbar, Sidebar dinamis per-role)
- [x] **Form Register** (`/auth/register`)
- [x] **Form Login** (`/auth/login`)
- [x] **Integrasi NextAuth Client** (Pembacaan `role` pada navigasi sudah diaktifkan)

## 2. 🏠 Sisi Rumah Tangga (FR-002)
- [x] **Halaman Dashboard** (`/rumah-tangga/dashboard`) - *UI Selesai, Data Masih Mock*
- [x] **Halaman Form Jual Sampah** (`/rumah-tangga/listing`) - *UI Selesai*
- [x] **Komponen AI Klasifikasi** (`<WasteClassifier />`) - *Selesai & terhubung ke form*
- [x] **Integrasi API Jual Sampah** - Form telah terhubung ke API `POST /api/listings` dengan validasi dan redirect.
- [ ] **Integrasi API Dashboard** - Belum fetch data `GET /api/listings` milik user.

## 3. 🚛 Sisi Pengepul (FR-003)
- [x] **Halaman Dashboard** (`/pengepul/dashboard`) - *UI Selesai, Data Masih Mock*
- [x] **Halaman Peta Jemput** (`/pengepul/peta`) - *Peta Leaflet berhasil dirender, integrasi koordinat statis*
- [x] **Marketplace Sampah Warga** (`/marketplace`) - *Sudah dirombak menjadi Server Component, filter tersambung ke Prisma DB*
- [x] **Form Input Bahan Baku** (`/pengepul/bahan-baku/new`) - *UI Form Selesai*
- [ ] **Integrasi API Peta Rute** - Belum memanggil data klaim dinamis untuk dimasukkan ke algoritma *Route Optimizer*.
- [ ] **Integrasi API Input Bahan Baku** - Form masih simulasi, belum terhubung ke `POST /api/material-listings`.

## 4. 🏭 Sisi Industri (FR-004)
- [x] **Halaman Dashboard** (`/industri/dashboard`) - *UI Selesai, Data Masih Mock*
- [x] **Marketplace Bahan Baku Pengepul** (`/marketplace`) - *UI Selesai, Tersambung Server Component & Prisma DB*
- [x] **Thread Negosiasi Pesanan** (`/industri/pesanan/[id]`) - *UI Chat Bubble & Action Buttons Selesai*
- [ ] **Integrasi API Order Baru** - Tombol "Beli" belum mengeksekusi `POST /api/orders`.
- [ ] **Integrasi API Negosiasi** - Tombol Offer/Counter/Deal belum menembak state machine API `POST /api/orders/[id]/negotiate`.
- [ ] **Supabase Realtime Subscriptions** - UI belum bereaksi secara *real-time* terhadap perubahan state negosiasi.

## 5. 📊 Landing Page & Global (FR-005)
- [x] **Landing Page Publik** (`/`) - *UI Landing, Teks Copywriting, Call-to-Actions (Selesai)*
- [x] **Notifikasi Lonceng (Komponen)** - *UI Selesai*
- [ ] **Integrasi API Landing Marketplace** - Grid *showcase* di halaman utama masih menggunakan *dummy arrays*, belum fetch ke endpoint publik `GET /api/marketplace/landing`.
- [ ] **Integrasi Data Impact (CO2)** - Komponen statistik lingkungan di dashboard belum menampilkan hitungan riil dari tabel `IMPACT_LOGS`.
- [ ] **Supabase Realtime Notifications** - Sidebar notifikasi belum melacak *event* baru dari backend.

---
> **Kesimpulan:** 
> Secara visual dan pengalaman pengguna, Frontend hampir 100% selesai. Langkah krusial berikutnya (Phase Integration) adalah menghapus *dummy data* (contoh: blok `setTimeout` di `handleFormSubmit`) dan menggantinya dengan pemanggilan `fetch` atau `axios` ke rute API (`/api/...`) yang bersesuaian, mengingat backend API sudah tuntas dikerjakan.
