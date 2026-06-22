# 🗺️ ROADMAP HACKATHON 24 JAM — DAURIN

**Marketplace Daur Ulang Terintegrasi**
Tim Mie Ayam Solo · PLAY IT! 2026 · Hackathon Web Application

> Roadmap ini disusun berdasarkan **PRD v2** dan **ERD v1.0** Daurin.
> Setiap task dipetakan ke tabel, entitas, dan FR yang relevan agar tidak ada kontradiksi.

---

## 🧭 Legenda Prioritas

| Simbol | Arti                                                             |
| ------ | ---------------------------------------------------------------- |
| 🔴 P0  | **Wajib MVP** — harus selesai sebelum jam 20                     |
| 🟡 P1  | **Penting** — dikerjakan jika P0 sudah selesai                   |
| 🟢 P2  | **Bonus / Pembeda nilai** — dikerjakan jika masih ada sisa waktu |

---

## 👥 Pembagian Tim

| Posisi                          | Tanggung Jawab Utama                                                             |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **Dev 1 — Backend**             | Database, API Routes (Next.js), Auth, Business Logic, Deployment                 |
| **Dev 2 — Frontend**            | UI/UX, Pages, Components, Responsive Design, State Management                    |
| **Dev 3 — Data/AI/Integration** | AI Klasifikasi (TF.js), Algoritma Rute, Supabase Realtime, QA & Integration Test |

---

## ⏱️ FASE 1 — FONDASI (Jam 0–3)

> Target: Repo berjalan, DB terbuat, Auth fungsional, dependency terpasang.

### Dev 1 — Backend

| Jam     | Task                                                                                                       | FR/ERD Ref    | Prioritas |
| ------- | ---------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| 0–0.5   | Init project Next.js 14 (App Router + TypeScript), install Prisma, Supabase client, NextAuth               | —             | 🔴 P0     |
| 0.5–1.5 | Buat `schema.prisma` lengkap: `USERS`, `COLLECTOR_PROFILES`, `COLLECTOR_WASTE_TYPES`, `INDUSTRY_PROFILES`  | ERD §2.1–2.3  | 🔴 P0     |
| 1.5–2   | Tambah tabel listing ke schema: `WASTE_LISTINGS`, `PICKUP_CLAIMS`, `MATERIAL_LISTINGS`                     | ERD §2.4–2.6  | 🔴 P0     |
| 2–2.5   | Tambah tabel transaksi ke schema: `ORDERS`, `NEGOTIATIONS`, `TRANSACTIONS`, `NOTIFICATIONS`, `IMPACT_LOGS` | ERD §2.7–2.13 | 🔴 P0     |
| 2.5–3   | `prisma migrate dev` ke Supabase · buat seed awal (3 akun demo per role)                                   | ERD §2.1      | 🔴 P0     |

> **Catatan:** Tabel bonus (`ROUTE_SESSIONS`, `RATINGS`, `CHAT_MESSAGES`, `PROCESSED_OUTPUTS`) ikut di-schema sekarang agar tidak ada migrasi ulang nanti. Cukup definisikan, tidak perlu langsung diisi.

---

### Dev 2 — Frontend

| Jam     | Task                                                                                                                                      | FR/ERD Ref         | Prioritas |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| 0–0.5   | Install Tailwind CSS, shadcn/ui, setup global layout, color tokens                                                                        | —                  | 🔴 P0     |
| 0.5–1.5 | Desain & buat komponen layout global: Navbar (role-aware), Sidebar, Footer, Loading skeleton                                              | —                  | 🔴 P0     |
| 1.5–2.5 | Buat halaman `/auth/register` dengan role selector (Rumah Tangga / Pengepul / Industri) + field kondisional (jenis sampah untuk pengepul) | FR-001.1, FR-001.4 | 🔴 P0     |
| 2.5–3   | Buat halaman `/auth/login` + redirect ke dashboard per role setelah login                                                                 | FR-001.2, FR-001.3 | 🔴 P0     |

---

### Dev 3 — Data/AI/Integration

| Jam | Task                                                                                                               | FR/ERD Ref                                   | Prioritas |
| --- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | --------- |
| 0–1 | Setup repo GitHub, buat README skeleton, breakdown task ke issue/kanban sederhana                                  | —                                            | 🔴 P0     |
| 1–2 | Load TF.js + MobileNetV2 di browser: buat komponen `<WasteClassifier />` proof-of-concept, test dengan 3–5 foto    | FR-002.2, ERD §2.4 (`ai_classification`)     | 🔴 P0     |
| 2–3 | Setup Leaflet.js + React-Leaflet + OpenStreetMap tile layer: buat komponen `<MapView />` dasar dengan marker dummy | FR-003.3, ERD §2.4 (`latitude`, `longitude`) | 🔴 P0     |

---

## ⚙️ FASE 2 — CORE FEATURES (Jam 3–14)

> Target: 8 fitur wajib MVP fungsional end-to-end (belum perlu polish).

---

### 🔐 Auth & RBAC (Jam 3–5)

#### Dev 1 — Backend

| Jam | Task                                                                                                                                                                                       | FR Ref             | Prioritas |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | --------- |
| 3–4 | Implementasi NextAuth dengan Credentials Provider · buat `api/auth/[...nextauth]` · JWT dengan payload `{ id, role, email }`                                                               | FR-001.2, FR-001.3 | 🔴 P0     |
| 4–5 | Buat API `POST /api/auth/register` · handle 3 role · buat `COLLECTOR_PROFILES` + `COLLECTOR_WASTE_TYPES` otomatis saat register pengepul · buat `INDUSTRY_PROFILES` saat register industri | FR-001.1, FR-001.4 | 🔴 P0     |

#### Dev 2 — Frontend

| Jam | Task                                                                                                                             | FR Ref   | Prioritas |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| 3–4 | Hubungkan form register ke API · handle error · redirect ke dashboard per role                                                   | FR-001.1 | 🔴 P0     |
| 4–5 | Tambah middleware Next.js untuk route protection: `/rt/*`, `/pengepul/*`, `/industri/*` · unauthorized redirect ke `/auth/login` | FR-001.3 | 🔴 P0     |

#### Dev 3 — Data/AI/Integration

| Jam | Task                                                                                                                                     | FR Ref             | Prioritas |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| 3–5 | Integrasi `navigator.geolocation` di form register · simpan `latitude`/`longitude` ke field USERS · buat fallback input manual koordinat | FR-001.5, ERD §2.1 | 🟡 P1     |

---

### 🏠 Rumah Tangga — Input & Listing Sampah (Jam 5–8)

#### Dev 1 — Backend

| Jam | Task                                                                                                                                         | FR Ref   | Prioritas |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| 5–6 | API `POST /api/waste-listings` · validasi role = `rumah_tangga` · upload foto ke Supabase Storage · simpan URL ke `WASTE_LISTINGS.photo_url` | FR-002.1 | 🔴 P0     |
| 6–7 | API `GET /api/waste-listings?role=rt` (listing milik user saat ini) · API `PATCH /api/waste-listings/:id` (update status)                    | FR-002.3 | 🔴 P0     |
| 7–8 | API `GET /api/waste-listings/marketplace` (filter by waste_type, status=tersedia) · sertakan `latitude`/`longitude` untuk peta               | FR-003.1 | 🔴 P0     |

#### Dev 2 — Frontend

| Jam     | Task                                                                                                                                                                    | FR Ref             | Prioritas |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| 5–6.5   | Halaman `/rt/listing/new` · form: jenis sampah (dropdown enum), berat, harga/kg, deskripsi, upload foto · tampilkan preview foto                                        | FR-002.1           | 🔴 P0     |
| 6.5–7.5 | Integrasi komponen `<WasteClassifier />` ke form · setelah upload foto → AI prediksi otomatis mengisi field `waste_type` · tampilkan confidence score + fallback manual | FR-002.2           | 🔴 P0     |
| 7.5–8   | Halaman `/rt/dashboard` · list semua listing milik RT · tampilkan status badge (tersedia/diklaim/diambil/selesai) + nominal                                             | FR-002.3, FR-002.5 | 🔴 P0     |

#### Dev 3 — Data/AI/Integration

| Jam | Task                                                                                                                                                                                                  | FR Ref              | Prioritas |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------- |
| 5–6 | Finalisasi komponen `<WasteClassifier />` · mapping output MobileNet ke 5 kelas Daurin (`plastik_pet`, `plastik_hdpe`, `kertas`, `logam`, `elektronik`) · simpan hasil ke state untuk dikirim ke form | FR-002.2, ERD §2.4  | 🔴 P0     |
| 6–8 | Tulis fungsi utilitas `haversineDistance(lat1, lng1, lat2, lng2): number` · unit test manual di console · akan digunakan oleh algoritma rute                                                          | ERD §2.10, PRD §6.3 | 🟡 P1     |

---

### 🚛 Pengepul — Peta, Klaim & Bahan Baku (Jam 8–12)

#### Dev 1 — Backend

| Jam   | Task                                                                                                                                                                                                                 | FR Ref                           | Prioritas |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------- |
| 8–9   | API `POST /api/pickup-claims` · validasi role = pengepul, listing status = tersedia, waste_type match dengan `COLLECTOR_WASTE_TYPES` · update `WASTE_LISTINGS.status` → `diklaim` secara atomik (Prisma transaction) | FR-003.2, ERD §2.5 state machine | 🔴 P0     |
| 9–10  | API `PATCH /api/pickup-claims/:id` (update status: diklaim → diambil → selesai) · saat selesai: update `WASTE_LISTINGS.status` → `selesai`, catat `final_price`                                                      | FR-003.2, ERD §3.1–3.2           | 🔴 P0     |
| 10–11 | API `POST /api/material-listings` · validasi role = pengepul · opsional `source_claim_id` untuk traceability · simpan ke `MATERIAL_LISTINGS`                                                                         | FR-003.6, ERD §2.6               | 🔴 P0     |
| 11–12 | API `GET /api/material-listings/marketplace` · filter: `material_type`, `status=tersedia`, range harga, lat/lng · sertakan koordinat untuk sorting by jarak di client                                                | FR-004.1                         | 🔴 P0     |

#### Dev 2 — Frontend

| Jam    | Task                                                                                                                                                        | FR Ref             | Prioritas |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | --------- |
| 8–9.5  | Halaman `/pengepul/marketplace` · list sampah tersedia yang sesuai jenis ditangani · card: jenis, berat, harga, jarak dari posisi pengepul · tombol "Klaim" | FR-003.1, FR-003.2 | 🔴 P0     |
| 9.5–11 | Integrasi `<MapView />` ke halaman `/pengepul/peta` · render marker tiap listing aktif · popup per marker: jenis, berat, harga · tombol Klaim dari popup    | FR-003.3           | 🔴 P0     |
| 11–12  | Halaman `/pengepul/bahan-baku/new` · form: material_type (dropdown), purpose, berat, harga awal, foto, source_claim (dropdown klaim selesai)                | FR-003.6, FR-003.7 | 🔴 P0     |

#### Dev 3 — Data/AI/Integration

| Jam   | Task                                                                                                                                                                                                                                       | FR Ref                       | Prioritas |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | --------- |
| 8–10  | Implementasi algoritma rute nearest-neighbor · input: posisi pengepul + array `{id, lat, lng}` klaim aktif · output: array ID terurut + total jarak km + estimasi biaya bensin · integrasikan ke halaman peta sebagai panel "Rute Optimal" | FR-003.4, FR-003.5, PRD §6.3 | 🟡 P1     |
| 10–12 | Setup Supabase Realtime subscription untuk tabel `NOTIFICATIONS` · buat helper `createNotification(userId, type, title, body, referenceId)` · panggil dari API klaim & update status                                                       | FR-002.4, ERD §2.12          | 🟡 P1     |

---

### 🏭 Industri — Pemesanan & Negosiasi (Jam 12–16)

#### Dev 1 — Backend

| Jam     | Task                                                                                                                                                                                                                                                    | FR Ref                                     | Prioritas |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------- |
| 12–13   | API `POST /api/orders` · validasi role = industri · buat ORDER dengan status `pending` · update `MATERIAL_LISTINGS.status` → `dipesan` · insert notifikasi ke pengepul                                                                                  | FR-004.2, ERD §2.7, §3.4                   | 🔴 P0     |
| 13–14.5 | Implementasi state machine negosiasi · API `POST /api/negotiations` · action_type: `offer`, `counter_offer`, `deal`, `cancel` · saat `deal`: update ORDER → `deal`, simpan `final_price_per_kg`, `final_total_price` · buat TRANSACTION secara otomatis | FR-004.3, FR-004.4, ERD §2.8 state machine | 🔴 P0     |
| 14.5–16 | API `GET /api/orders?role=industri` (riwayat order + status) · API `GET /api/negotiations/:orderId` (thread lengkap)                                                                                                                                    | FR-004.5                                   | 🟡 P1     |

#### Dev 2 — Frontend

| Jam     | Task                                                                                                                                                                   | FR Ref   | Prioritas |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------- |
| 12–13   | Halaman `/industri/marketplace` · grid bahan baku dengan filter: material_type, rentang harga, sorting by jarak/harga/terbaru                                          | FR-004.1 | 🔴 P0     |
| 13–14.5 | Halaman `/industri/order/new/:materialId` · form: volume dibutuhkan, catatan · submit → buat ORDER & mulai negosiasi                                                   | FR-004.2 | 🔴 P0     |
| 14.5–16 | Halaman `/industri/negosiasi/:orderId` · tampilkan thread negosiasi (mirip chat bubble) · tombol: Offer, Counter-Offer, Deal, Cancel · tampilkan status order realtime | FR-004.3 | 🔴 P0     |

#### Dev 3 — Data/AI/Integration

| Jam   | Task                                                                                                                                                                     | FR Ref                   | Prioritas |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | --------- |
| 12–14 | Integrasi Supabase Realtime ke halaman negosiasi · subscribe perubahan tabel `NEGOTIATIONS` per `order_id` · update UI tanpa refresh                                     | FR-004.3, PRD §3.2 bonus | 🟡 P1     |
| 14–16 | End-to-end test alur: RT input → AI klasifikasi → listing → pengepul klaim → ambil → bahan baku → industri order → negosiasi → deal → transaksi · catat bug ke checklist | PRD §10.1 demo script    | 🔴 P0     |

---

## 📊 FASE 3 — MARKETPLACE, DASHBOARD & POLISH (Jam 16–20)

> Target: Landing page 3-lapis, dashboard per role, CO2 offset, notifikasi, responsif mobile.

### Dev 1 — Backend

| Jam   | Task                                                                                                                                                                                                         | FR Ref                          | Prioritas |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | --------- |
| 16–17 | API `GET /api/marketplace/landing` · return 3 dataset: waste_listings (RT), material_listings (pengepul), processed_outputs (industri, jika ada) · filter status = tersedia                                  | FR-005.1                        | 🔴 P0     |
| 17–18 | API `GET /api/dashboard/:role` · RT: jumlah listing + total nominal · Pengepul: klaim aktif + bahan baku listing + pendapatan · Industri: order aktif + total transaksi                                      | FR-005.2                        | 🔴 P0     |
| 18–19 | API `GET /api/dashboard/impact` · aggregasi `IMPACT_LOGS`: total CO2 offset per waste_type, total nilai ekonomi · otomatis create IMPACT_LOG saat TRANSACTION dibuat (trigger di API transaksi)              | FR-005.3, ERD §2.13, Appendix A | 🟡 P1     |
| 19–20 | Seed data dummy lengkap: 5 listing RT (berbagai jenis), 3 klaim selesai, 4 material listing, 2 order (1 deal, 1 negosiasi aktif), 2 transaksi → isi IMPACT_LOGS → pastikan semua fitur bisa didemonstrasikan | PRD §L deliverable #4           | 🔴 P0     |

### Dev 2 — Frontend

| Jam       | Task                                                                                                                                                                    | FR Ref                | Prioritas |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------- |
| 16–17.5   | Halaman `/` (landing page publik) · 3 tab: Sampah RT, Bahan Baku Pengepul, Bahan Baku Jadi · card grid dengan filter + sort                                             | FR-005.1              | 🔴 P0     |
| 17.5–18.5 | Dashboard per role: `/rt/dashboard`, `/pengepul/dashboard`, `/industri/dashboard` · statistik ringkas (card angka) + list aktivitas terbaru                             | FR-005.2              | 🔴 P0     |
| 18.5–19   | Komponen `<ImpactCard />` di dashboard global · tampilkan total CO2 offset (kg), total nilai ekonomi (Rp), total transaksi · gunakan Recharts / Chart.js jika ada waktu | FR-005.3              | 🟡 P1     |
| 19–20     | **Mobile responsiveness pass** · test semua halaman di viewport 375px · fix breakpoint Tailwind · pastikan form, tabel, dan peta bisa digunakan di mobile               | PRD §K non-fungsional | 🔴 P0     |

### Dev 3 — Data/AI/Integration

| Jam     | Task                                                                                                                                                                                 | FR Ref              | Prioritas |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | --------- |
| 16–17   | Komponen `<NotificationBell />` · subscribe `NOTIFICATIONS` per user via Supabase Realtime · tampilkan badge unread + dropdown list notifikasi · `PATCH /api/notifications/:id/read` | FR-002.4, ERD §2.12 | 🟡 P1     |
| 17–18.5 | Finalisasi panel rute di `/pengepul/peta` · tampilkan ordered list titik pengambilan + total jarak + estimasi biaya · tombol "Mulai Rute" update status claim → `dalam_perjalanan`   | FR-003.4, FR-003.5  | 🟡 P1     |
| 18.5–20 | Regression test seluruh alur dengan seed data baru · verifikasi state machine (ERD §3) tidak ada status yang loncat · pastikan filter marketplace akurat                             | ERD §3.1–3.4        | 🔴 P0     |

---

## 🚀 FASE 4 — DEPLOYMENT & PRESENTASI (Jam 20–24)

### Dev 1 + Dev 3 — Deployment

| Jam     | Task                                                                                                                                                                       | Ref                  | Prioritas |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------- |
| 20–21   | `npm run build` di Jagoan Hosting · fix build error (type, import, env var)                                                                                                | PRD §7.4             | 🔴 P0     |
| 21–21.5 | Setup PM2: `pm2 start npm --name daurin -- start && pm2 save && pm2 startup`                                                                                               | PRD §7.4 Step 2      | 🔴 P0     |
| 21.5–22 | Install cloudflared · `cloudflared tunnel login` · `cloudflared tunnel create daurin` · buat `config.yml` dengan ingress ke `localhost:3000`                               | PRD §7.4 Step 3–5    | 🔴 P0     |
| 22–22.5 | Cloudflare Dashboard: CNAME `devmieayam.web.id` → `<tunnel-uuid>.cfargotunnel.com` · jalankan tunnel via PM2                                                               | PRD §7.4 Step 6–7    | 🔴 P0     |
| 22.5–23 | Test `https://devmieayam.web.id` dari device lain · verifikasi SSL aktif · test login demo account 3 role · **Jika tunnel bermasalah → fallback ngrok: `ngrok http 3000`** | PRD §7.4 backup plan | 🔴 P0     |

### Dev 3 — Dokumentasi

| Jam     | Task                                                                                                                               | Ref                   | Prioritas |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------- |
| 23–23.5 | Finalisasi `README.md`: cara run lokal, env vars yang diperlukan, tech stack, daftar asumsi, akun demo per role (email + password) | PRD §L deliverable #3 | 🔴 P0     |
| 23.5–24 | Final commit push · pastikan commit history span 24 jam ada                                                                        | PRD §L deliverable #2 | 🔴 P0     |

### Semua — Latihan Demo & Pitching

| Jam   | Task                                                                                                                                                         | Ref            | Prioritas |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | --------- |
| 23–24 | Dry-run demo script 5 menit (PRD §10.1) · assign siapa yang handle setiap switch akun · siapkan backup screenshot/screen-record jika koneksi demo bermasalah | PRD §10.1–10.2 | 🔴 P0     |

---

## 🟢 BONUS FEATURES — Dikerjakan Hanya Jika Semua P0 Selesai Sebelum Jam 18

| Feature                   | Task                                                                                                                 | PIC           | Prioritas |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| Chat negosiasi real-time  | Buat tabel `CHAT_MESSAGES` aktif · komponen `<NegotiationChat />` · Supabase Realtime subscribe per `negotiation_id` | Dev 3 + Dev 2 | 🟢 P2     |
| Material traceability     | Tampilkan chain: listing_id RT → pickup_claim_id → material_listing_id di halaman detail bahan baku                  | Dev 1 + Dev 2 | 🟢 P2     |
| Rating & ulasan           | API CRUD `RATINGS` · komponen bintang di halaman riwayat transaksi                                                   | Dev 1 + Dev 2 | 🟢 P2     |
| Grafik tren dashboard     | Recharts: line chart volume/bulan + bar chart nilai transaksi dari `IMPACT_LOGS.created_at`                          | Dev 2         | 🟢 P2     |
| Ekspor laporan PDF/Excel  | Tombol ekspor di halaman riwayat transaksi · gunakan `jsPDF` atau `xlsx` package                                     | Dev 3         | 🟢 P2     |
| Processed Output Industri | Form input bahan baku jadi · listing opsional ke marketplace lapis 3                                                 | Dev 1 + Dev 2 | 🟢 P2     |

---

## 🗓️ RINGKASAN TIMELINE VISUAL

```
JAM  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24
     ├───────────────────────────────────────────────────────────────────────────────────────────────────┤
BE   [SETUP DB & SCHEMA][AUTH API][WASTE API      ][PICKUP+MATERIAL][ORDER+NEGO    ][DASHBOARD+SEED ][DEPLOY ]
FE   [SETUP+LAYOUT][AUTH PAGES][FORM RT+AI    ][PETA+PENGEPUL ][NEGO UI       ][LANDING+DASH   ][DEMO   ]
AI   [TF.JS+LEAFLET  ][GEOAPI][CLASSIFIER+HAVERSINE][RUTE+REALTIME][E2E TEST  ][NOTIF+REGRESS  ][README ]
```

---

## 📋 CHECKLIST MVP (8 Fitur Wajib)

Gunakan checklist ini untuk progress tracking selama hackathon:

- [ ] **FR-001** Auth & RBAC 3 role — registrasi, login, route protection
- [ ] **FR-002.1** Rumah tangga bisa input & listing sampah (form + foto upload)
- [ ] **FR-002.2** AI klasifikasi foto otomatis mengisi jenis sampah (TF.js MobileNet)
- [ ] **FR-002.3** Status tracking listing RT (tersedia → diklaim → diambil → selesai)
- [ ] **FR-003.1–3.2** Pengepul lihat marketplace terfilter & bisa klaim listing
- [ ] **FR-003.3** Peta titik pengambilan (Leaflet.js + marker aktif)
- [ ] **FR-003.6** Pengepul input bahan baku hasil pilahan → listing ke marketplace industri
- [ ] **FR-004.2–4.4** Industri pesan → negosiasi (offer/counter/deal/cancel) → transaksi
- [ ] **FR-005.1** Landing marketplace 3 lapis (sampah RT / bahan baku / bahan baku jadi)
- [ ] **FR-005.2** Dashboard per role dengan statistik relevan
- [ ] **Deploy public** URL dapat diakses juri dari luar jaringan lokal

---

## ⚠️ RISK MITIGATION CHECKLIST

| Risk                   | Kapan Cek            | Mitigasi                                                         |
| ---------------------- | -------------------- | ---------------------------------------------------------------- |
| TF.js lambat load      | Jam 2 (dev test)     | Quantized model; cache setelah load pertama; loading spinner     |
| Negosiasi state loncat | Jam 14 (e2e test)    | Validasi server-side: state hanya bisa maju sesuai ERD §3.3      |
| Supabase quota         | Jam 16 (monitoring)  | Foto dikompres < 500KB sebelum upload; seed data efisien         |
| Peta tidak load        | Jam 8 (dev test)     | Fallback list koordinat tanpa peta; OSM tile tidak butuh API key |
| Deploy gagal           | Jam 22 (deploy test) | Fallback ngrok instant; siapkan screenshots backup               |
| Waktu tidak cukup      | Jam 18 (checkpoint)  | Drop semua P2; fokus polish P0 & seed data untuk demo            |

---

## 🔗 REFERENSI SILANG — ERD → ROADMAP

| Tabel ERD                                       | Dibuat di Fase                                        | PIC           |
| ----------------------------------------------- | ----------------------------------------------------- | ------------- |
| `USERS`                                         | Fase 1 (Jam 0.5–2)                                    | Dev 1         |
| `COLLECTOR_PROFILES`, `COLLECTOR_WASTE_TYPES`   | Fase 1 (Jam 2–2.5) + Auth API (Jam 4–5)               | Dev 1         |
| `INDUSTRY_PROFILES`                             | Fase 2 — Auth API (Jam 4–5)                           | Dev 1         |
| `WASTE_LISTINGS`                                | Fase 1 (schema) + Fase 2 Jam 5–8 (API)                | Dev 1         |
| `PICKUP_CLAIMS`                                 | Fase 2 Jam 8–10 (API)                                 | Dev 1         |
| `MATERIAL_LISTINGS`                             | Fase 2 Jam 10–12 (API)                                | Dev 1         |
| `ORDERS`                                        | Fase 2 Jam 12–13 (API)                                | Dev 1         |
| `NEGOTIATIONS`                                  | Fase 2 Jam 13–14.5 (API)                              | Dev 1         |
| `TRANSACTIONS` + `IMPACT_LOGS`                  | Fase 2 Jam 13–14.5 (API) + Fase 3 Jam 18–19           | Dev 1         |
| `NOTIFICATIONS`                                 | Fase 2 Jam 10–12 (helper) + Fase 3 Jam 16–17 (UI)     | Dev 3 + Dev 2 |
| `ROUTE_SESSIONS`, `ROUTE_SESSION_CLAIMS`        | Fase 2 Jam 8–10 (algoritma) + Fase 3 Jam 17–18.5 (UI) | Dev 3         |
| `RATINGS`, `CHAT_MESSAGES`, `PROCESSED_OUTPUTS` | Bonus — Fase 3 jika ada waktu                         | Dev 1+2+3     |

---

_Roadmap Daurin v1.0 — Tim Mie Ayam Solo · PLAY IT! 2026_
_Disusun berdasarkan PRD v2 & ERD v1.0 · Konsisten dengan 8 fitur wajib studi kasus_
