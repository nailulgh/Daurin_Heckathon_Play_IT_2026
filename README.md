<div align="center">

# 🌿 DAURIN
### *Marketplace Daur Ulang Terintegrasi*

**Menghubungkan Rumah Tangga → Pengepul → Industri Pengolah dalam Satu Ekosistem Digital**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-greenshift.web.id-2D7D46?style=for-the-badge)](https://greenshift.web.id)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.io)

---

**🏆 PLAY IT! 2026 Hackathon — Tim Mie Ayam Solo**
*Studi Kasus: PT Lestari Daur Nusantara (LDN)*

**SDG 1 · SDG 9 · SDG 11 · SDG 12 · SDG 13 · SDG 17**

</div>

---

## 📋 Daftar Isi

- [Executive Summary](#-executive-summary)
- [Demo & Akun Uji Coba](#-demo--akun-uji-coba)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Cara Menjalankan Lokal](#-cara-menjalankan-lokal)
- [Struktur Folder](#-struktur-folder)
- [API Endpoints](#-api-endpoints)
- [Skema Database](#-skema-database)
- [Modul AI & Algoritma](#-modul-ai--algoritma)
- [Deployment](#-deployment)
- [Dampak SDG](#-dampak-sdg)
- [Tim & Kontribusi](#-tim--kontribusi)
- [Asumsi & Batasan](#-asumsi--batasan)

---

## 🎯 Executive Summary

**Daurin** adalah platform marketplace daur ulang berbasis web yang mendigitalkan dan mengoptimalkan rantai nilai daur ulang di Indonesia, menghubungkan **tiga lapisan ekosistem**:

| Peran | Bahasa | Fungsi |
|---|---|---|
| 🏠 **Rumah Tangga** | Warga | Upload & jual sampah terpilah |
| 🚛 **Pengepul** | Collector | Klaim, jemput, pilah, jual bahan baku |
| 🏭 **Industri** | Manufacturer | Beli bahan baku, negosiasi harga B2B |

### Nilai Diferensiasi

| Aspek | Solusi Lama | Daurin |
|---|---|---|
| Klasifikasi Sampah | Manual, rentan salah | **AI foto (MobileNet TF.js)** |
| Matching Pengepul | Dari mulut ke mulut | **Filter otomatis jenis & wilayah** |
| Optimasi Rute | Tidak ada, boros BBM | **Nearest-Neighbor Haversine** |
| Negosiasi Harga | Informal, tidak terdokumentasi | **Offer/Counter-Offer/Deal terstruktur** |
| Traceability | Tidak ada | **Status berjenjang RT → Pengepul → Industri** |
| Impact Tracking | Tidak ada | **Dashboard CO₂ offset real-time** |

---

## 🖥️ Demo & Akun Uji Coba

> **🌐 URL Live:** [https://greenshift.web.id](https://greenshift.web.id)

### Akun Demo (Siap Pakai)

| Peran | Email | Password |
|---|---|---|
| 🏠 Rumah Tangga | `rt@daurin.id` | `demo123` |
| 🚛 Pengepul | `pengepul@daurin.id` | `demo123` |
| 🏭 Industri | `industri@daurin.id` | `demo123` |

### Skenario Demo (5 Menit)

```
1. LOGIN sebagai Rumah Tangga
   → Upload foto botol plastik
   → AI otomatis klasifikasi: "PLASTIK_PET"
   → Buat listing sampah

2. SWITCH ke akun Pengepul
   → Lihat peta titik sampah tersebar
   → Aktifkan Rute Optimal (nearest-neighbor)
   → Klaim & tandai listing sebagai Diambil

3. KEMBALI ke Rumah Tangga
   → Status listing sudah berubah "Diambil"
   → Nominal yang diterima tampil

4. SEBAGAI Pengepul
   → Input bahan baku hasil pilahan "Flake PET"
   → Listing ke marketplace industri

5. SWITCH ke akun Industri
   → Filter bahan baku → Pesan
   → Lakukan negosiasi (Offer → Counter → Deal)
   → Dashboard CO₂ offset terupdate otomatis
```

---

## ✨ Fitur Utama

### FR-001: Autentikasi & RBAC
- ✅ Registrasi tiga peran dengan validasi Zod
- ✅ NextAuth.js JWT dengan payload `{ id, role, email }`
- ✅ Route protection per role via Next.js Middleware
- ✅ Redirect otomatis ke dashboard sesuai peran
- ✅ Pengepul memilih jenis sampah yang ditangani saat registrasi

### FR-002: Rumah Tangga — Listing Sampah
- ✅ Form input: jenis, berat, harga/kg, deskripsi, foto
- ✅ **AI Photo Classifier** — prediksi jenis sampah otomatis dari foto (TF.js MobileNetV2)
- ✅ Confidence bar per prediksi + fallback manual jika < 50%
- ✅ Status tracking: `TERSEDIA → DIKLAIM → DIAMBIL → SELESAI`
- ✅ Dashboard riwayat listing + nominal yang diterima
- ✅ Notifikasi real-time saat listing diklaim

### FR-003: Pengepul — Logistik & Bahan Baku
- ✅ Marketplace sampah RT dengan filter jenis & wilayah
- ✅ Klaim listing (atomic Prisma transaction)
- ✅ **Peta Interaktif** — Leaflet.js + OpenStreetMap dengan marker warna per jenis sampah
- ✅ **Algoritma Rute Optimal** — Nearest-Neighbor Haversine dari posisi pengepul
- ✅ Estimasi jarak (km) & biaya bensin (Rp) per rute
- ✅ Form listing bahan baku hasil pilahan ke marketplace B2B
- ✅ CRUD material listing + status management

### FR-004: Industri — Pemesanan & Negosiasi B2B
- ✅ Marketplace bahan baku dengan filter multi-dimensi
- ✅ Pemesanan volume + pesan awal
- ✅ **State Machine Negosiasi**: `OFFER → COUNTER_OFFER → DEAL / CANCEL`
- ✅ Thread negosiasi bergaya chat bubble
- ✅ Simulasi transaksi — Deal otomatis buat record Transaction
- ✅ Riwayat pesanan & transaksi

### FR-005: Marketplace & Dashboard
- ✅ Landing Page 3 Lapis: Sampah RT | Bahan Baku Pengepul | Produk Industri
- ✅ Dashboard per peran dengan Server Component (zero latency)
- ✅ **Dashboard Impact Global** — CO₂ offset, volume daur ulang, nilai ekonomi
- ✅ Notification Bell — lonceng unread + dropdown riwayat
- ✅ Responsif mobile (min 375px)

---

## 🛠️ Tech Stack

```
FRONTEND
├── Next.js 14          — App Router + Server/Client Components
├── TypeScript 5        — Strict mode, type-safe end-to-end
├── Tailwind CSS 3      — Mobile-first utility CSS
├── shadcn/ui           — Radix UI components (Card, Dialog, Toast, dll)
└── Recharts            — Visualisasi chart dashboard

AI / MAPS
├── TensorFlow.js 4     — Client-side ML inference (browser)
├── MobileNetV2         — Pre-trained image classification
├── Leaflet.js 1.9      — Peta interaktif dengan marker kustom
└── React-Leaflet 5     — React wrapper untuk Leaflet

BACKEND
├── Next.js API Routes  — RESTful endpoints (TypeScript)
├── Prisma ORM 5        — Type-safe database access
└── Zod 4               — Schema validation setiap API

DATABASE & STORAGE
├── PostgreSQL           — Via Supabase Cloud
├── Supabase Storage    — Upload & serve foto sampah (CDN)
└── Supabase Realtime   — WebSocket untuk notifikasi

AUTH
├── NextAuth.js 4       — Session management + JWT
└── bcryptjs            — Password hashing

DEPLOYMENT
├── Jagoan Hosting      — VPS Rocky Linux (Indonesia)
├── Nginx               — Reverse proxy → port 3000
├── PM2                 — Node.js process manager
└── Cloudflare          — DNS, SSL, CDN, DDoS protection
```

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐  │
│  │  Next.js    │  │ TF.js       │  │ Leaflet.js             │  │
│  │  App Router │  │ MobileNet   │  │ + Route Optimizer      │  │
│  │  (RSC+CSR)  │  │ (AI Infer.) │  │ (Nearest-Neighbor)     │  │
│  └──────┬──────┘  └─────────────┘  └────────────────────────┘  │
└─────────│───────────────────────────────────────────────────────┘
          │ HTTP / WebSocket
┌─────────▼───────────────────────────────────────────────────────┐
│                   NEXT.JS API ROUTES                            │
│  /api/auth   /api/listings   /api/materials   /api/orders       │
│  /api/upload  /api/dashboard  /api/notifications                │
└─────────┬───────────────────────────────────────────────────────┘
          │ Prisma ORM
┌─────────▼───────────────────────────────────────────────────────┐
│                  SUPABASE CLOUD                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │ PostgreSQL  │  │  Storage    │  │ Realtime (WebSocket)  │   │
│  │  (Primary)  │  │ (Foto CDN)  │  │ (Notifications)       │   │
│  └─────────────┘  └─────────────┘  └───────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

DEPLOYMENT: Jagoan Hosting → Nginx → PM2 → Cloudflare → greenshift.web.id
```

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat

- Node.js v18+
- npm v9+
- Akun Supabase (database + storage)

### 1. Clone Repository

```bash
git clone https://github.com/nailulgh/Daurin_Heckathon_Play_IT_2026.git
cd Daurin_Heckathon_Play_IT_2026/daurin
```

### 2. Instalasi Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Salin file contoh dan isi nilainya:

```bash
cp ../.env.example .env
```

Edit file `.env`:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# NextAuth
NEXTAUTH_SECRET="[generate: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Migrasi Database & Seed Data

```bash
# Jalankan migrasi Prisma
npx prisma migrate deploy

# Isi data demo (akun + listing dummy Malang Raya)
npx prisma db seed
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi berjalan di: **[http://localhost:3000](http://localhost:3000)**

### 6. (Opsional) Buka Prisma Studio

```bash
npx prisma studio
```

---

## 📁 Struktur Folder

```
daurin/
├── prisma/
│   ├── schema.prisma          # Ground truth schema database
│   └── seed.ts                # Data demo 3 role + Malang Raya coords
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── rumah-tangga/
│   │   │   ├── dashboard/page.tsx     ★ Server Component
│   │   │   └── listing/new/page.tsx   ★ AI Photo Classifier
│   │   ├── pengepul/
│   │   │   ├── dashboard/page.tsx     ★ Server Component
│   │   │   ├── marketplace/page.tsx
│   │   │   ├── peta/page.tsx          ★ Leaflet Map + Route Optimizer
│   │   │   └── bahan-baku/new/page.tsx
│   │   ├── industri/
│   │   │   ├── dashboard/page.tsx     ★ Server Component
│   │   │   ├── marketplace/page.tsx
│   │   │   ├── pesanan/page.tsx       ★ Order Tracking
│   │   │   └── transaksi/page.tsx
│   │   ├── marketplace/page.tsx       # Public 3-layer marketplace
│   │   ├── dashboard/page.tsx         # Public impact dashboard
│   │   └── api/
│   │       ├── auth/[...nextauth]/    # NextAuth handlers
│   │       ├── listings/              # Waste listing CRUD + claim
│   │       ├── materials/             # Material listing CRUD
│   │       ├── orders/                # Order + negotiation state machine
│   │       ├── upload/                # Supabase Storage upload
│   │       ├── dashboard/             # Aggregated stats + CO2
│   │       └── notifications/         # Notification system
│   ├── components/
│   │   ├── listing/
│   │   │   ├── AIPhotoClassifier.tsx  ★ TF.js MobileNet component
│   │   │   └── WasteListingForm.tsx
│   │   ├── map/
│   │   │   └── CollectorMap.tsx       ★ Leaflet (dynamic import)
│   │   ├── shared/
│   │   │   ├── Navbar.tsx
│   │   │   └── NotificationBell.tsx   ★ Real-time notifications
│   │   └── ui/                        # shadcn/ui components
│   └── lib/
│       ├── ai/wasteClassifier.ts      ★ TF.js model wrapper
│       ├── geo/
│       │   ├── haversine.ts           ★ Distance calculation
│       │   └── routeOptimizer.ts      ★ Nearest-neighbor algorithm
│       ├── co2.ts                     ★ CO2 offset calculator
│       ├── auth.ts                    # NextAuth config
│       └── prisma.ts                  # Prisma singleton
└── middleware.ts                      # Route protection by role
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Daftar akun (3 role) |
| `POST` | `/api/auth/[...nextauth]` | NextAuth handlers |

### Waste Listings (RT → Pengepul)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/listings` | Marketplace + filter |
| `POST` | `/api/listings` | Buat listing sampah |
| `GET` | `/api/listings/[id]` | Detail listing |
| `PATCH` | `/api/listings/[id]` | Update listing/status |
| `DELETE` | `/api/listings/[id]` | Hapus listing |
| `POST` | `/api/listings/[id]/claim` | Klaim listing (Pengepul) |

### Material Listings (Pengepul → Industri)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/materials` | Marketplace bahan baku |
| `POST` | `/api/materials` | Buat listing bahan baku |
| `GET/PATCH/DELETE` | `/api/materials/[id]` | CRUD material |

### Orders & Negotiation
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/orders` | Buat pesanan |
| `GET` | `/api/orders` | Daftar pesanan (role-filtered) |
| `POST` | `/api/orders/[id]/negotiate` | Offer / Counter / Deal / Cancel |

### Dashboard & Utilities
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/dashboard` | Stats per role (RT/Pengepul/Industri) |
| `GET` | `/api/dashboard/impact` | CO₂ offset publik |
| `POST` | `/api/upload` | Upload foto ke Supabase Storage |
| `GET` | `/api/notifications` | Notifikasi user |
| `PATCH` | `/api/notifications/[id]` | Tandai sudah dibaca |

---

## 🗄️ Skema Database

```
USERS ──────────────────────────────────────────────┐
 id, name, email, role, lat, lng, wasteTypesHandled  │
                                                      │
WASTE_LISTINGS ─── userId(FK) ───────────────────────┤
 id, wasteType, weightKg, pricePerKg                  │
 photoUrl, aiClassification, status, earnedAmount     │
       │                                              │
PICKUP_CLAIMS ─── listingId(FK), collectorId(FK) ────┤
 id, status, claimedAt, pickedAt                      │
                                                      │
MATERIAL_LISTINGS ─── collectorId(FK) ───────────────┤
 id, wasteType, purpose, weightKg, pricePerKg         │
 photoUrl, lat, lng, status                           │
       │                                              │
ORDERS ─── buyerId(FK), materialId(FK) ──────────────┤
 id, volumeKg, status, finalPrice                     │
       │                                              │
NEGOTIATIONS ─── orderId(FK), actorId(FK)             │
 id, type[OFFER/COUNTER/DEAL/CANCEL], amount, message │
       │                                              │
TRANSACTIONS ─── orderId(FK)                          │
 id, amount, status[SIMULATED]                        │
                                                      │
NOTIFICATIONS ─── userId(FK) ────────────────────────┘
 id, type, title, body, isRead
```

### State Machine Listing Sampah
```
TERSEDIA ──[klaim]──→ DIKLAIM ──[diambil]──→ DIAMBIL ──[selesai]──→ SELESAI
```

### State Machine Negosiasi Order
```
MENUNGGU ──[offer]──→ NEGOSIASI ──[deal]──→ DEAL ──[auto]──→ SELESAI
                          │
                       [cancel]
                          ↓
                      DIBATALKAN
```

---

## 🤖 Modul AI & Algoritma

### AI Waste Image Classifier (TF.js MobileNetV2)

```typescript
// Inferensi berjalan 100% di browser — tidak ada backend AI terpisah
// Model pre-trained ImageNet → dipetakan ke 6 kelas Daurin

export type WasteClass =
  | "PLASTIK_PET" | "PLASTIK_HDPE"
  | "KERTAS_KARDUS" | "LOGAM_KALENG"
  | "KACA" | "ELEKTRONIK"

// Threshold manual review jika confidence < 50%
```

**Pipeline:**
1. User upload foto → preview tampil
2. Model MobileNetV2 download & cache di browser (1x, ~17MB)
3. Inference → Top-3 prediksi dengan confidence bar
4. Field `wasteType` form otomatis terisi dengan kelas tertinggi
5. Jika confidence < 50% → warning "Pilih manual"

### Route Optimizer (Nearest-Neighbor Haversine)

```
Input:  Posisi pengepul (lat, lng) + array listing aktif [{id, lat, lng}]
Proses: Iteratif pilih titik terdekat yang belum dikunjungi (greedy)
Output: Urutan ID listing + total jarak (km) + estimasi biaya (Rp)

Formula Haversine:
d = 2r · arcsin(√(sin²(Δφ/2) + cosφ₁·cosφ₂·sin²(Δλ/2)))

Asumsi biaya: Rp 10.000/liter, 40 km/liter (motor pengepul)
```

### CO₂ Offset Calculator

| Jenis Sampah | Faktor CO₂ (kg CO₂e/kg) | Referensi |
|---|---|---|
| Plastik PET | 1.75 | EPA WARM |
| Plastik HDPE | 1.80 | EPA WARM |
| Kertas/Kardus | 0.90 | IPCC Waste |
| Logam/Kaleng | 8.75 | World Aluminium |
| Kaca | 0.40 | Glass Recycling Coalition |
| Elektronik | 20.0 | StEP Initiative |

---

## 🌐 Deployment

### Infrastruktur

```
User Browser
     │ HTTPS
     ▼
Cloudflare Edge (CDN + WAF + SSL)
     │
     ▼
Jagoan Hosting VPS (Rocky Linux 8)
  └── Nginx (Port 80/443 → Reverse Proxy)
       └── PM2 (Process Manager)
            └── Next.js (Port 3000)
                 └── Prisma → Supabase PostgreSQL (Cloud)
```

### Environment Production

| Variabel | Nilai |
|---|---|
| `NEXTAUTH_URL` | `https://greenshift.web.id` |
| `NEXT_PUBLIC_APP_URL` | `https://greenshift.web.id` |
| Domain | `greenshift.web.id` |

### Perintah Deploy ke VPS

```bash
# Di server VPS (SSH ke root@[IP])

# Pull kode terbaru
cd /var/www/daurin/daurin
git pull origin main

# Build produksi
npm run build

# Restart via PM2
pm2 restart daurin

# Cek status
pm2 status
```

---

## 🌱 Dampak SDG

| SDG | Target | Kontribusi Daurin |
|---|---|---|
| **SDG 1** | Tanpa Kemiskinan | Monetisasi sampah RT + peningkatan margin pengepul via rute efisien |
| **SDG 9** | Industri & Inovasi | Digitalisasi rantai pasok dengan AI & geolokasi tanpa biaya tinggi |
| **SDG 11** | Kota Berkelanjutan | Pengelolaan sampah perkotaan terstruktur & terlacak |
| **SDG 12** | Konsumsi Bertanggung Jawab | Pengurangan waste-to-landfill melalui ekonomi sirkular |
| **SDG 13** | Penanganan Iklim | Tracking CO₂ offset real-time dari setiap transaksi daur ulang |
| **SDG 17** | Kemitraan Global | Ekosistem tiga pihak yang saling menguntungkan & terkoneksi digital |

---

## 👥 Tim & Kontribusi

**Tim Mie Ayam Solo — PLAY IT! 2026**

| Dev | Bidang | Kontribusi Utama |
|---|---|---|
| **Dev 1** | Backend & Database | Schema Prisma, API Routes, Auth, Business Logic, Deployment |
| **Dev 2** | Frontend & UI/UX | Pages, Components, Responsive Design, State Management |
| **Dev 3** | AI & Integration | TF.js Classifier, Route Optimizer, Supabase Realtime, QA |

---

## ⚠️ Asumsi & Batasan

1. **Pembayaran Disimulasikan** — Tidak terhubung ke payment gateway nyata. Record `Transaction` dibuat otomatis saat Deal terjadi.
2. **AI Accuracy** — MobileNetV2 adalah model pre-trained ImageNet. Akurasi bervariasi tergantung kualitas foto & pencahayaan. Confidence < 50% akan memunculkan peringatan.
3. **Rute Tidak Optimal Global** — Algoritma Nearest-Neighbor bersifat greedy dan tidak menjamin solusi global optimal untuk lebih dari 10 titik.
4. **CO₂ Offset** — Dihitung berdasarkan nilai tengah tabel EPA/IPCC. Merupakan estimasi, bukan angka akurat terverifikasi.
5. **Koordinat** — Disimpan sebagai `Float` latitude/longitude desimal. Seed data menggunakan koordinat wilayah Malang Raya (radius ~15 km dari pusat kota).
6. **Jenis Sampah Pengepul** — Didaftarkan saat registrasi dan tidak dapat diubah dalam versi MVP.
7. **Semua Mata Uang** — Dalam Rupiah (IDR), disimpan sebagai `Float`.
8. **Multi-putaran Negosiasi** — Didukung tanpa batas putaran hingga salah satu pihak menekan Deal atau Cancel.

---

## 📄 Dokumen Pendukung

| Dokumen | Deskripsi |
|---|---|
| [PRD_versi_2.md](./PRD_versi_2.md) | Product Requirements Document lengkap |
| [ERD.md](./ERD.md) | Entity Relationship Diagram & State Machine |
| [ROADMAP.md](./ROADMAP.md) | Timeline & task breakdown hackathon 24 jam |
| [CHANGELOG.md](./CHANGELOG.md) | Riwayat perubahan lengkap per commit |
| [AGENTS.md](./.agents/AGENTS.md) | Panduan AI coding agent (konteks proyek) |

---

<div align="center">

**🌿 Daurin** — *Bersama Kita Daur, Bersama Kita Baur*

Dibangun dalam 24 jam untuk **PLAY IT! 2026 Hackathon**

*Tim Mie Ayam Solo · PT Lestari Daur Nusantara (LDN) · greenshift.web.id*

---

*Setiap kg sampah yang didaur ulang adalah satu langkah nyata menuju Indonesia yang lebih hijau* 🇮🇩

</div>
