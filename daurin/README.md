<div align="center">

# 🌿 Daurin

### Marketplace Daur Ulang Terintegrasi

**Rumah Tangga → Pengepul → Industri**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-greenshift.web.id-22c55e?style=for-the-badge&logo=cloudflare&logoColor=white)](https://greenshift.web.id)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

<br/>

> **PLAY IT! 2026 Hackathon** — Tim Mie Ayam Solo
> 
> Solusi marketplace 3 tier untuk percepatan ekonomi sirkular Indonesia berbasis SDG 1, 9, 11, 12, 13, 17.

</div>

---

## 📋 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Fitur Unggulan](#-fitur-unggulan)
- [Tech Stack](#️-tech-stack)
- [Akun Demo (untuk Juri)](#-akun-demo-untuk-juri)
- [Cara Jalankan Lokal](#-cara-jalankan-lokal)
- [Variabel Environment](#️-variabel-environment)
- [Arsitektur Sistem](#️-arsitektur-sistem)
- [Struktur Folder](#-struktur-folder)
- [API Endpoints](#-api-endpoints)
- [Deployment (Produksi)](#-deployment-produksi)
- [Tim](#-tim)

---

## 🌱 Tentang Aplikasi

Daurin adalah platform marketplace **3 tier** yang menghubungkan seluruh rantai pasok daur ulang sampah di Indonesia secara efisien dan transparan.

```
Rumah Tangga  →  (sampah terpilah)  →  Pengepul  →  (bahan baku)  →  Industri Pengolahan
     📦                                    🚛                              🏭
  Upload foto                         Klaim & Peta              Negosiasi & Beli
  AI deteksi jenis                   Rute Optimal              Transparansi Harga
```

**Masalah yang Diselesaikan:**
- Sampah RT tidak memiliki akses langsung ke pengepul terverifikasi
- Pengepul tidak efisien dalam merencanakan rute pengambilan
- Industri kesulitan menemukan bahan baku daur ulang berkualitas dengan harga transparan

**Dampak Terukur:**
- Setiap kg sampah plastik yang didaur ulang = **1.75 kg CO₂ yang terhindar**
- Setiap kg sampah elektronik yang didaur ulang = **20 kg CO₂ yang terhindar**

---

## ✨ Fitur Unggulan

### 🤖 AI Vision — Klasifikasi Sampah Otomatis
> *Teknologi Machine Learning berjalan langsung di browser pengguna, tanpa server AI terpisah.*

- Upload foto sampah, AI berbasis **TensorFlow.js + MobileNetV2** mengidentifikasi jenis sampah secara instan
- Menampilkan **Top-3 prediksi** beserta skor kepercayaan (confidence %)
- Otomatis mengisi field "Jenis Sampah" pada form listing
- Fallback pemilihan manual jika confidence < 50%

### 🗺️ Peta Interaktif & Optimasi Rute (Pengepul)
> *Navigasi cerdas berbasis algoritma Nearest-Neighbor untuk efisiensi pengambilan sampah.*

- Visualisasi seluruh klaim sampah aktif pada peta **Leaflet + OpenStreetMap**
- Tombol "Optimalkan Rute" mengurutkan titik pengambilan dengan jarak minimum
- Kalkulasi estimasi **jarak (km)**, **biaya bahan bakar (Rp)**, dan **waktu tempuh**
- Kode warna marker per jenis sampah untuk identifikasi cepat

### 💬 Negosiasi Harga Real-Time (Industri ↔ Pengepul)
- State machine transaksi: `MENUNGGU → NEGOSIASI → DEAL → SELESAI`
- Riwayat penawaran harga lengkap per order
- Notifikasi real-time via **Supabase Realtime** saat status berubah

### 📊 Dashboard Impact Publik
- Total CO₂ Offset yang berhasil dicegah (dalam kg/ton CO₂e)
- Total nilai ekonomi sampah yang berputar (dalam Rupiah)
- Data agregat per jenis sampah

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **AI/ML** | TensorFlow.js + MobileNetV2 (Browser Inference) |
| **Maps** | Leaflet.js + React-Leaflet + OpenStreetMap |
| **Charts** | Recharts |
| **Backend** | Next.js API Routes (RESTful) |
| **ORM** | Prisma ORM 5 |
| **Database** | PostgreSQL (via Supabase) |
| **Auth** | NextAuth.js v4 (Credentials + RBAC) |
| **Storage** | Supabase Storage |
| **Realtime** | Supabase Realtime (WebSockets) |
| **Deployment** | Jagoan Hosting VPS (Rocky Linux 8) + PM2 |
| **Tunnel** | Cloudflare Tunnel (cloudflared) |
| **Domain** | greenshift.web.id |

---

## 👤 Akun Demo (untuk Juri)

Semua akun menggunakan **password yang sama: `demo123`**

> Aplikasi sudah terisi data dummy realistis (Kota Malang & sekitarnya) agar semua fitur dapat didemonstrasikan.

| Role | Email | Deskripsi |
|---|---|---|
| 🏠 **Rumah Tangga** | `rt@daurin.id` | Upload & jual sampah terpilah |
| 🚛 **Pengepul** | `pengepul@daurin.id` | Klaim sampah, lihat peta & rute, jual bahan baku |
| 🏭 **Industri** | `industri@daurin.id` | Beli bahan baku, negosiasi harga |

### Skenario Demo yang Direkomendasikan

1. **AI Classifier** → Login sebagai `rt@daurin.id` → Buat Listing → Upload foto botol plastik → Lihat AI mendeteksi `PLASTIK_PET`
2. **Klaim & Peta** → Login sebagai `pengepul@daurin.id` → Buka Peta → Klaim listing RT → Klik "Optimalkan Rute"
3. **Negosiasi** → Login sebagai `industri@daurin.id` → Buka Marketplace Bahan Baku → Buat Order → Lakukan penawaran harga

---

## 🖥️ Cara Jalankan Lokal

### Prasyarat
- Node.js `>= 18.x`
- npm `>= 9.x`
- Akun Supabase (untuk database PostgreSQL)

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/[username]/daurin.git
cd daurin

# 2. Install dependensi
npm install

# 3. Salin file environment dan isi nilainya
cp .env.example .env.local
```

Isi file `.env.local` dengan kredensial Anda (lihat [Variabel Environment](#️-variabel-environment)).

```bash
# 4. Sinkronisasi schema database
npx prisma db push

# 5. Isi database dengan data contoh (opsional)
npx prisma db seed

# 6. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ⚙️ Variabel Environment

Salin `.env.example` menjadi `.env.local` dan isi semua nilai berikut:

```env
# ── DATABASE (Supabase PostgreSQL) ─────────────────────────────────────────
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# ── SUPABASE ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# ── NEXTAUTH ──────────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generated-via-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"   # Ganti ke https://greenshift.web.id di produksi

# ── APP ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🏗️ Arsitektur Sistem

```
Browser Pengguna
│
│  HTTPS (Cloudflare SSL)
▼
[Cloudflare Network] ──── greenshift.web.id
│
│  Cloudflare Tunnel (cloudflared)
▼
[VPS Jagoan Hosting :3000]
│
│  PM2 Process Manager
├─ daurin (Next.js Server)
│   ├── /api/listings         → CRUD Sampah RT
│   ├── /api/materials        → CRUD Bahan Baku Pengepul
│   ├── /api/orders           → Manajemen Order Industri
│   ├── /api/orders/[id]/negotiate → State Machine Negosiasi
│   ├── /api/upload           → Supabase Storage
│   ├── /api/dashboard        → Agregat Statistik & CO2
│   └── /api/notifications    → Notifikasi In-App
│
└─ daurin-tunnel (cloudflared)
│
│  TLS Connection
▼
[Supabase Cloud]
├── PostgreSQL Database
├── Auth (dikelola via NextAuth)
└── Storage (foto sampah)
```

---

## 📁 Struktur Folder

```
daurin/
├── prisma/
│   ├── schema.prisma          ← Sumber kebenaran schema database
│   └── seed.ts                ← Data dummy untuk demo
├── src/
│   ├── app/
│   │   ├── (auth)/            ← Halaman login & registrasi
│   │   ├── (dashboard)/       ← Dashboard per-role (RT, Pengepul, Industri)
│   │   ├── marketplace/       ← Landing publik 3-layer
│   │   ├── dashboard/         ← Dashboard impact publik (CO2, volume)
│   │   └── api/               ← Semua endpoint REST API
│   ├── components/
│   │   ├── listing/           ← WasteListingForm, AIPhotoClassifier
│   │   ├── map/               ← CollectorMap (Leaflet), RouteOptimizer
│   │   ├── negotiation/       ← NegotiationThread, NegotiationActions
│   │   └── dashboard/         ← ImpactStats, TransactionChart
│   ├── lib/
│   │   ├── ai/wasteClassifier.ts    ← TF.js MobileNet (AI inti)
│   │   ├── geo/routeOptimizer.ts   ← Algoritma Nearest-Neighbor
│   │   ├── geo/haversine.ts        ← Kalkulasi jarak bumi (km)
│   │   ├── co2.ts                  ← Kalkulasi CO2 offset per jenis sampah
│   │   ├── auth.ts                 ← NextAuth config + RBAC
│   │   └── prisma.ts               ← Singleton Prisma Client
│   ├── types/index.ts              ← Shared TypeScript types
│   └── middleware.ts               ← Proteksi rute berdasarkan role
└── .env.example                    ← Template environment variables
```

---

## 🔗 API Endpoints

### Autentikasi
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi akun baru (3 role) |
| `POST` | `/api/auth/[...nextauth]` | NextAuth handlers (login/logout/session) |

### Sampah (Rumah Tangga → Pengepul)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/listings` | Daftar listing sampah (filter: jenis, status, radius) |
| `POST` | `/api/listings` | Buat listing sampah baru |
| `GET/PATCH/DELETE` | `/api/listings/[id]` | Detail, edit, atau hapus listing |
| `POST` | `/api/listings/[id]/claim` | Pengepul klaim listing sampah |

### Bahan Baku (Pengepul → Industri)
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/materials` | Daftar bahan baku (filter: jenis, harga, radius) |
| `POST` | `/api/materials` | Pengepul buat listing bahan baku |
| `GET/PATCH/DELETE` | `/api/materials/[id]` | Detail, edit, atau hapus |

### Order & Negosiasi
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET/POST` | `/api/orders` | Daftar order / Buat order baru |
| `POST` | `/api/orders/[id]/negotiate` | Ajukan OFFER / COUNTER_OFFER / DEAL / CANCEL |

### Utilitas
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/upload` | Upload foto ke Supabase Storage |
| `GET` | `/api/dashboard` | Statistik publik: CO2, volume, nilai ekonomi |
| `GET` | `/api/marketplace/landing` | Data 3-layer marketplace publik |
| `GET/PATCH` | `/api/notifications` | Notifikasi in-app per pengguna |

---

## 🚀 Deployment (Produksi)

Aplikasi di-deploy di **VPS Jagoan Hosting** dan diekspos ke internet via **Cloudflare Tunnel** — tanpa perlu membuka port di firewall VPS.

```bash
# ── DI SERVER VPS ────────────────────────────────────────────

# 1. Build aplikasi
npm run build

# 2. Jalankan dengan PM2
pm2 start npm --name daurin -- start
pm2 save && pm2 startup

# 3. Jalankan Cloudflare Tunnel
pm2 start cloudflared --name "daurin-tunnel" -- tunnel run daurin
pm2 save
```

**Status Produksi:**
- App Process: `pm2 status` → `daurin` ✅ online
- Tunnel Process: `pm2 status` → `daurin-tunnel` ✅ online
- Public URL: [https://greenshift.web.id](https://greenshift.web.id)
- Tunnel ID: `5df091e2-7abc-42d5-881f-0a6e2c31418a`

---

## 👥 Tim

**Tim Mie Ayam Solo** — PLAY IT! 2026

| Peran | Tanggung Jawab |
|---|---|
| Dev 1 — Full-Stack | Backend API, Database Schema, Auth, Deployment |
| Dev 2 — Frontend | UI/UX, Komponen React, Mobile Responsiveness |
| Dev 3 — AI/Data | TF.js AI Classifier, Geo Routing, Seed Data, Dokumentasi |

---

<div align="center">

**Dibangun dalam 24 jam untuk PLAY IT! 2026**

*"Dari sampah jadi berkah — teknologi untuk Indonesia yang lebih hijau"*

[![SDG 1](https://img.shields.io/badge/SDG-1%20No%20Poverty-e5243b?style=flat-square)](https://sdgs.un.org/goals/goal1)
[![SDG 9](https://img.shields.io/badge/SDG-9%20Industry-f36d25?style=flat-square)](https://sdgs.un.org/goals/goal9)
[![SDG 12](https://img.shields.io/badge/SDG-12%20Responsible%20Consumption-bf8b2e?style=flat-square)](https://sdgs.un.org/goals/goal12)
[![SDG 13](https://img.shields.io/badge/SDG-13%20Climate%20Action-3f7e44?style=flat-square)](https://sdgs.un.org/goals/goal13)

</div>
