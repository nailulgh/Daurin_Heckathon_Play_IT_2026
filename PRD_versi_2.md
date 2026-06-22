**PRODUCT REQUIREMENTS DOCUMENT**

**DAURIN**

_Marketplace Daur Ulang Terintegrasi_

Rumah Tangga → Pengepul → Industri Pengolah

Tim Mie Ayam Solo • PLAY IT! 2026 • Hackathon Web Application

PT Lestari Daur Nusantara (LDN) • Studi Kasus Final 24 Jam

**SDG 1 • SDG 9 • SDG 11 • SDG 12 • SDG 13 • SDG 17**

# **1\. Executive Summary**

Daurin adalah platform marketplace daur ulang berbasis web yang menghubungkan tiga lapisan ekosistem: Rumah Tangga sebagai penghasil sampah terpilah, Pengepul sebagai pengumpul dan pemilah lanjutan, serta Industri Pengolah sebagai pembeli bahan baku daur ulang. Platform ini dibangun untuk PT Lestari Daur Nusantara (LDN) dalam rangka mendigitalkan dan mengoptimalkan rantai nilai daur ulang yang saat ini masih terputus dan tidak efisien.

Daurin mengintegrasikan AI/ML Waste Image Classification berbasis TensorFlow.js (MobileNet transfer learning) untuk membantu rumah tangga mengklasifikasikan jenis sampah dari foto secara otomatis, serta algoritma optimasi rute pengambilan berbasis Nearest-Neighbor Haversine untuk memaksimalkan efisiensi logistik pengepul. Platform ini juga menghadirkan sistem negosiasi harga multi-putaran (offer/counter-offer) antara pengepul dan industri, serta dashboard impact lingkungan real-time yang mengukur estimasi emisi CO2 yang berhasil dihindari.

Dampak SDG yang ditargetkan:

- SDG 1 (Tanpa Kemiskinan): Monetisasi sampah rumah tangga dan peningkatan pendapatan pengepul melalui efisiensi rute
- SDG 9 (Industri, Inovasi, Infrastruktur): Digitalisasi rantai pasok daur ulang dengan AI dan geolokasi
- SDG 11 (Kota Berkelanjutan): Pengelolaan sampah perkotaan yang lebih terstruktur dan terlacak
- SDG 12 (Konsumsi & Produksi Bertanggung Jawab): Pengurangan waste-to-landfill melalui ekonomi sirkular
- SDG 13 (Penanganan Iklim): Estimasi dan tracking pengurangan emisi karbon dari daur ulang
- SDG 17 (Kemitraan): Ekosistem tiga pihak yang saling menguntungkan dan terkoneksi digital

## **Nilai Diferensiasi Utama**

| **Aspek**          | **Solusi Saat Ini**            | **Daurin**                                     |
| ------------------ | ------------------------------ | ---------------------------------------------- |
| Klasifikasi Sampah | Manual, rentan salah kategori  | AI foto classification (MobileNet TF.js)       |
| Matching Pengepul  | Tidak ada, dari mulut ke mulut | Filter otomatis berdasarkan jenis & wilayah    |
| Optimasi Rute      | Tidak ada, tidak efisien       | Nearest-neighbor Haversine + estimasi biaya    |
| Negosiasi Harga    | Informal, tidak terdokumentasi | Sistem offer/counter-offer terstruktur         |
| Traceability       | Tidak ada                      | Status berjenjang RT > Pengepul > Industri     |
| Impact Tracking    | Tidak ada                      | Dashboard CO2 offset & nilai ekonomi real-time |

# **2\. Problem Statement**

## **2.1 Konteks & Latar Belakang**

Indonesia menghasilkan lebih dari 67,8 juta ton sampah per tahun (KLHK, 2023), namun tingkat daur ulang masih di bawah 10%. Rantai nilai daur ulang saat ini sangat fragmentasi dan tidak efisien karena tiga aktor utama beroperasi secara silo tanpa koneksi digital yang memadai:

- Rumah tangga: bingung memilah dan tidak tahu ke mana menjual sampah terpilah
- Pengepul: kesulitan mendapatkan pasokan sesuai jenis yang mereka tangani, rute pengambilan tidak efisien
- Industri pengolah: sulit mendapatkan bahan baku daur ulang yang konsisten dalam jenis dan volume

## **2.2 Root Cause Analysis**

| **Masalah**                    | **Akar Penyebab**                                         | **Dampak**                                           |
| ------------------------------ | --------------------------------------------------------- | ---------------------------------------------------- |
| Salah klasifikasi sampah       | Tidak ada panduan visual/AI saat memilah                  | Kontaminasi, penolakan pengepul                      |
| Pengepul tidak efisien         | Tidak ada informasi ketersediaan real-time & rute optimal | Biaya operasional tinggi, margin tipis               |
| Industri sulit cari bahan baku | Tidak ada marketplace B2B terstruktur                     | Produksi terhambat, harga fluktuatif                 |
| Harga tidak transparan         | Negosiasi informal tanpa referensi pasar                  | Petani/pengepul dirugikan, tidak ada rekam jejak     |
| Tidak ada traceability         | Sistem terputus, tanpa status tracking                    | Tidak bisa diaudit, tidak ada data dampak lingkungan |

## **2.3 Pernyataan Masalah**

"Bagaimana membangun platform digital yang menghubungkan rumah tangga, pengepul, dan industri pengolah dalam satu ekosistem terintegrasi dengan dukungan AI klasifikasi sampah, optimasi rute logistik, sistem negosiasi terstruktur, dan traceability material end-to-end, sehingga meningkatkan efisiensi, transparansi, dan dampak lingkungan dari rantai daur ulang di Indonesia?"

# **3\. Goals & Non-Goals**

## **3.1 Goals (Dalam Scope MVP 24 Jam)**

- Autentikasi RBAC tiga peran: Rumah Tangga, Pengepul, Industri Pengolah
- Pendaftaran & CRUD listing sampah oleh rumah tangga
- Klasifikasi jenis sampah dari foto menggunakan AI (TensorFlow.js / MobileNet)
- Marketplace listing tiga lapis dengan filter kategori, lokasi, harga
- Peta titik pengambilan interaktif (Leaflet.js / OpenStreetMap) + algoritma rute nearest-neighbor
- Alur pilah & jual sampah: RT input > pengepul ambil > pilah jadi bahan baku > listing ke industri
- Pemesanan + negosiasi harga (offer/counter-offer/deal/cancel) + simulasi transaksi
- Dashboard ringkas: volume transaksi, estimasi CO2 offset, nilai ekonomi
- Deploy public yang dapat diakses juri + README + commit history 24 jam

## **3.2 Bonus Goals (Pembeda Nilai)**

- Optimasi rute lengkap dengan urutan pengambilan + estimasi jarak & biaya logistik
- Chat negosiasi real-time (WebSocket/Supabase Realtime) + riwayat percakapan
- Material traceability: lacak aliran sampah dari RT > pengepul > industri per batch
- Sistem rating & ulasan antar aktor pasca-transaksi
- Dashboard dampak lingkungan: emisi CO2 dihemat, estimasi energi ekuivalen
- Ekspor laporan transaksi ke PDF/Excel

## **3.3 Non-Goals (Di Luar Scope)**

- Integrasi payment gateway nyata (pembayaran cukup disimulasikan)
- Mobile native app (Android/iOS)
- Training model AI dari nol (gunakan model pre-trained/transfer learning)
- Sistem manajemen armada pengepul yang kompleks
- Integrasi API pemerintah atau dinas lingkungan

# **4\. User Personas**

## **Persona 1: Bu Sari - Rumah Tangga**

| **Atribut**     | **Detail**                                                                           |
| --------------- | ------------------------------------------------------------------------------------ |
| Nama            | Sari Rahmawati, 35 tahun                                                             |
| Profil          | Ibu rumah tangga, tinggal di perumahan, aktif di grup WhatsApp lingkungan            |
| Pain Point      | Sudah rajin pilah sampah tapi bingung mau dijual ke mana, sering salah kategori      |
| Goal            | Mendapat penghasilan tambahan dari sampah rumah tangga & berkontribusi ke lingkungan |
| Kebutuhan Utama | Antarmuka mudah, panduan klasifikasi foto, tracking status penjualan                 |
| Tech Literacy   | Menengah, familiar dengan WhatsApp & marketplace online                              |

## **Persona 2: Pak Budi - Pengepul**

| **Atribut**     | **Detail**                                                                                |
| --------------- | ----------------------------------------------------------------------------------------- |
| Nama            | Budi Santoso, 42 tahun                                                                    |
| Profil          | Pengepul sampah dengan motor & gerobak, menangani plastik PET & kardus di 3 kelurahan     |
| Pain Point      | Sering kehabisan pasokan jenis tertentu, rute pengambilan tidak efisien, buang bensin     |
| Goal            | Efisiensi rute, mendapat pasokan konsisten sesuai jenis yang ditangani, margin lebih baik |
| Kebutuhan Utama | Peta ketersediaan real-time, filter jenis sampah, rute optimal, listing bahan baku        |
| Tech Literacy   | Dasar, familiar dengan Google Maps & WhatsApp                                             |

## **Persona 3: Pak Andi - Manajer Industri**

| **Atribut**     | **Detail**                                                                        |
| --------------- | --------------------------------------------------------------------------------- |
| Nama            | Andi Prasetyo, 45 tahun, Manajer Procurement                                      |
| Profil          | Pabrik daur ulang plastik skala menengah, butuh bahan baku konsisten 10 ton/bulan |
| Pain Point      | Sumber bahan baku tidak konsisten, harga tidak transparan, negosiasi informal     |
| Goal            | Pasokan bahan baku terstandar, harga transparan, transaksi terdokumentasi         |
| Kebutuhan Utama | Marketplace bahan baku terfilter, sistem negosiasi digital, riwayat transaksi     |
| Tech Literacy   | Tinggi, familiar dengan sistem ERP & platform B2B                                 |

# **5\. Functional Requirements**

## **FR-001: Autentikasi & Role-Based Access Control (RBAC)**

| **ID**   | **Requirement**                                                  | **Priority** | **Acceptance Criteria**                                                          |
| -------- | ---------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| FR-001.1 | Registrasi dengan pilihan peran (Rumah Tangga/Pengepul/Industri) | P0           | Form registrasi berhasil membuat akun dengan peran berbeda; data tersimpan di DB |
| FR-001.2 | Login dengan JWT token / session management                      | P0           | Login berhasil menghasilkan token; sesi expired setelah 24 jam                   |
| FR-001.3 | Route protection per role; unauthorized redirect ke login        | P0           | URL /pengepul/\* hanya bisa diakses pengepul; redirect jika tidak authorized     |
| FR-001.4 | Pengepul input jenis sampah yang ditangani saat registrasi       | P0           | Field multi-select jenis sampah tersimpan & digunakan sebagai filter marketplace |
| FR-001.5 | Koordinat lokasi dikumpulkan saat registrasi (geolocation API)   | P1           | Browser geolocation digunakan; fallback ke input manual koordinat                |

## **FR-002: Rumah Tangga - Input & Listing Sampah**

| **ID**   | **Requirement**                                                           | **Priority** | **Acceptance Criteria**                                                               |
| -------- | ------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| FR-002.1 | Form input sampah: jenis, jumlah/berat, deskripsi, upload foto            | P0           | Form tersimpan ke DB; foto terupload ke storage; listing muncul di marketplace        |
| FR-002.2 | AI Klasifikasi foto: prediksi jenis sampah dari gambar (TF.js MobileNet)  | P0           | Setelah upload foto, sistem menampilkan prediksi jenis sampah dengan confidence score |
| FR-002.3 | Status tracking listing: Tersedia / Diklaim / Diambil / Selesai + nominal | P0           | Status berubah otomatis sesuai aksi pengepul; RT dapat melihat nominal yang diterima  |
| FR-002.4 | Notifikasi saat sampah diklaim/diambil pengepul                           | P1           | Banner/toast notifikasi muncul saat pengepul mengklaim listing milik RT               |
| FR-002.5 | Riwayat penjualan: daftar listing historis dengan status & nominal        | P1           | Halaman riwayat menampilkan semua listing milik user dengan filter status             |

## **FR-003: Pengepul - Manajemen Pengambilan & Bahan Baku**

| **ID**   | **Requirement**                                                                     | **Priority** | **Acceptance Criteria**                                                           |
| -------- | ----------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| FR-003.1 | Marketplace listing sampah RT dengan filter jenis (sesuai yang ditangani) & wilayah | P0           | Pengepul hanya melihat listing sesuai jenis sampah yang didaftarkan               |
| FR-003.2 | Klaim & ambil listing; status otomatis berubah ke Diklaim > Diambil                 | P0           | Satu listing hanya bisa diklaim satu pengepul; status terkunci setelah diklaim    |
| FR-003.3 | Peta titik pengambilan interaktif (Leaflet.js) dengan marker listing aktif          | P0           | Peta menampilkan marker lokasi semua listing aktif yang relevan untuk pengepul    |
| FR-003.4 | Algoritma rute optimal nearest-neighbor dari posisi pengepul ke listing aktif       | P1           | Sistem menghasilkan urutan pengambilan yang meminimalkan total jarak (Haversine)  |
| FR-003.5 | Estimasi jarak & biaya bensin per rute pengambilan                                  | P1           | Panel rute menampilkan total km dan estimasi biaya (asumsi Rp X/km, configurable) |
| FR-003.6 | Input bahan baku hasil pilahan: jenis, peruntukan, berat, harga awal, foto          | P0           | Form bahan baku tersimpan; listing bahan baku muncul di marketplace industri      |
| FR-003.7 | Manajemen listing bahan baku: CRUD + status (Tersedia/Dipesan/Terjual)              | P0           | Pengepul dapat edit harga, berat; status terkunci saat ada pesanan aktif          |

## **FR-004: Industri - Pemesanan & Negosiasi**

| **ID**   | **Requirement**                                                             | **Priority** | **Acceptance Criteria**                                                          |
| -------- | --------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| FR-004.1 | Marketplace bahan baku dengan filter jenis, lokasi, harga, ketersediaan     | P0           | Grid/list bahan baku dengan filter aktif; sort by harga/jarak/terbaru            |
| FR-004.2 | Pesan bahan baku: input volume yang dibutuhkan + pesan awal                 | P0           | Order tersimpan; status listing berubah ke Dipesan; pengepul mendapat notifikasi |
| FR-004.3 | Sistem negosiasi: Offer > Counter-Offer > Deal / Cancel (multi-putaran)     | P0           | Thread negosiasi tersimpan; status berurutan; deal mengunci harga & volume final |
| FR-004.4 | Simulasi transaksi: konfirmasi deal > status Terjual + nominal tercatat     | P0           | Transaksi tersimpan di DB dengan timestamp; nominal masuk ke dashboard           |
| FR-004.5 | Riwayat transaksi & pesanan aktif industri                                  | P1           | Halaman riwayat menampilkan semua order dengan status & detail negosiasi         |
| FR-004.6 | (Bonus) Input bahan baku jadi hasil olahan; listing opsional dijual kembali | P2           | Industri dapat mencatat produk jadi; muncul di dashboard volume produksi         |

## **FR-005: Marketplace Landing & Dashboard**

| **ID**   | **Requirement**                                                                            | **Priority** | **Acceptance Criteria**                                                               |
| -------- | ------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| FR-005.1 | Landing page etalase 3 lapis: Sampah RT \| Bahan Baku Pengepul \| Bahan Baku Jadi Industri | P0           | Tiga tab/seksi dengan listing aktif masing-masing; dapat difilter & diurutkan         |
| FR-005.2 | Dashboard per peran: statistik relevan & ringkasan aktivitas                               | P0           | Setiap peran memiliki dashboard berbeda setelah login; data real dari DB              |
| FR-005.3 | Dashboard global admin/publik: total volume, transaksi, estimasi CO2 offset                | P1           | Halaman ringkasan aggregasi; CO2 offset dihitung berdasarkan tabel konversi per jenis |
| FR-005.4 | (Bonus) Grafik tren: volume per jenis per bulan, nilai transaksi kumulatif                 | P2           | Chart.js/Recharts menampilkan grafik time-series dari data transaksi                  |
| FR-005.5 | (Bonus) Ekspor laporan transaksi ke PDF/Excel                                              | P2           | Tombol ekspor menghasilkan file yang dapat diunduh dengan data terfilter              |

# **6\. Komponen AI/ML - Waste Image Classification**

## **6.1 Pendekatan Teknis**

Menggunakan Transfer Learning berbasis MobileNetV2 (via TensorFlow.js) yang berjalan di browser (client-side inference), sehingga tidak memerlukan backend AI terpisah. Pendekatan ini layak diselesaikan dalam 24 jam karena menggunakan model pre-trained yang sudah ada.

## **6.2 Arsitektur Klasifikasi**

| **Layer**   | **Detail**                                                                 |
| ----------- | -------------------------------------------------------------------------- |
| Model Base  | MobileNetV2 pre-trained (ImageNet weights via TF.js CDN)                   |
| Klasifikasi | 5 kelas: Plastik (PET/HDPE), Kertas/Kardus, Logam/Kaleng, Kaca, Elektronik |
| Inference   | Client-side browser inference; input: foto upload 224x224px                |
| Output      | Top-3 prediksi dengan confidence score (%)                                 |
| Fallback    | Manual selection jika confidence < 50%                                     |
| Integrasi   | Hasil klasifikasi otomatis mengisi field 'jenis sampah' pada form input RT |

## **6.3 Bonus: Optimasi Rute Nearest-Neighbor**

Algoritma rute pengambilan menggunakan pendekatan Nearest-Neighbor Greedy dengan kalkulasi jarak Haversine:

- Input: koordinat posisi pengepul + array koordinat listing aktif yang diklaim
- Proses: mulai dari posisi pengepul, iteratif pilih titik terdekat yang belum dikunjungi
- Output: urutan pengambilan optimal + total estimasi jarak (km) + estimasi biaya bensin
- Formula Haversine: d = 2r · arcsin(√(sin²(Δφ/2) + cosφ₁·cosφ₂·sin²(Δλ/2)))
- Asumsi biaya: Rp 10.000/liter, konsumsi 40 km/liter (motor pengepul), dapat dikonfigurasi

# **7\. Tech Stack & Arsitektur**

## **7.1 Stack Rekomendasi (Hackathon-Optimized)**

| **Layer**    | **Teknologi**                      | **Justifikasi**                                                            |
| ------------ | ---------------------------------- | -------------------------------------------------------------------------- |
| Frontend     | Next.js 14 (App Router)            | Full-stack dalam satu repo, SSR + CSR, routing mudah                       |
| UI Library   | Tailwind CSS + shadcn/ui           | Komponen siap pakai, mobile-first, development cepat                       |
| AI/ML        | TensorFlow.js + MobileNetV2        | Client-side inference, tidak butuh backend AI terpisah                     |
| Peta         | Leaflet.js + OpenStreetMap         | Free, no API key, interaktif, marker kustom                                |
| Charts       | Recharts / Chart.js                | Integrasi mudah dengan React, banyak tipe chart                            |
| Backend      | Next.js API Routes + Prisma ORM    | Type-safe, satu bahasa (TypeScript), migrasi mudah                         |
| Database     | PostgreSQL via Supabase            | Real-time subscriptions, storage built-in, free tier cukup                 |
| Auth         | NextAuth.js / Supabase Auth        | Multi-provider, JWT, session management otomatis                           |
| Storage      | Supabase Storage                   | Upload foto sampah, CDN built-in, gratis untuk hackathon                   |
| Real-time    | Supabase Realtime (WebSocket)      | Notifikasi & chat negosiasi tanpa setup tambahan                           |
| Deployment   | Jagoan Hosting + Cloudflare Tunnel | VPS/shared hosting lokal Indonesia, latensi rendah, domain .web.id resmi   |
| CDN & Tunnel | Cloudflare Tunnel (cloudflared)    | Expose app ke publik tanpa buka port; SSL otomatis; DDoS protection gratis |
| Domain       | devmieayam.web.id                  | Domain .web.id via Jagoan Hosting; dikonfigurasi via Cloudflare DNS        |

## **7.2 Arsitektur Sistem**

Arsitektur monorepo Next.js dengan pemisahan concern yang jelas:

- Presentation Layer: Next.js App Router (RSC + Client Components) + Tailwind + shadcn/ui
- Business Logic Layer: Next.js API Routes (RESTful) + Custom hooks untuk data fetching
- AI Layer: TensorFlow.js berjalan di browser (client-side), tanpa latency network
- Data Layer: Prisma ORM > PostgreSQL (Supabase); Supabase Storage untuk file
- Real-time Layer: Supabase Realtime untuk notifikasi status & chat negosiasi
- Map Layer: Leaflet.js + React-Leaflet; algoritma rute di client-side JavaScript

## **7.3 Deployment Architecture - Jagoan Hosting + Cloudflare Tunnel**

Infrastruktur deployment menggunakan Jagoan Hosting sebagai server aplikasi dengan Cloudflare Tunnel untuk expose ke publik secara aman tanpa membuka port langsung ke internet.

| **Komponen**      | **Detail**                            | **Konfigurasi**                                                                                     |
| ----------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Hosting Provider  | Jagoan Hosting (Indonesia)            | Server lokal Indonesia; latensi rendah untuk pengguna domestik                                      |
| Domain            | devmieayam.web.id                     | Domain .web.id resmi; dikonfigurasi nameserver ke Cloudflare                                        |
| Cloudflare Tunnel | cloudflared Zero Trust Tunnel         | Tunnel dari Jagoan Hosting ke Cloudflare edge; tidak perlu IP publik statis atau buka port firewall |
| SSL/TLS           | Cloudflare SSL otomatis (Full/Strict) | HTTPS end-to-end; sertifikat dikelola Cloudflare secara otomatis                                    |
| DNS               | Cloudflare DNS                        | NS domain di Cloudflare; CNAME ke tunnel UUID; propagasi instan                                     |
| CDN               | Cloudflare CDN global edge            | Aset statis di-cache di edge; performa lebih cepat untuk juri dari luar kota                        |
| DDoS Protection   | Cloudflare WAF bawaan                 | Proteksi otomatis; app tetap accessible saat demo meski ada traffic spike                           |
| Process Manager   | PM2 (Node.js)                         | next start via PM2; auto-restart jika crash; log terpusat                                           |
| Database          | PostgreSQL via Supabase Cloud         | DB di Supabase cloud; koneksi dari Jagoan Hosting via connection string                             |
| File Storage      | Supabase Storage                      | Foto sampah di Supabase Storage; URL publik via CDN Supabase                                        |

## **7.4 Langkah Setup Deployment (Jam 20-22)**

- Step 1 - Build: npm run build di server Jagoan Hosting
- Step 2 - PM2: pm2 start npm --name daurin -- start && pm2 save && pm2 startup
- Step 3 - Install cloudflared di Jagoan Hosting (curl script dari Cloudflare docs)
- Step 4 - Buat tunnel: cloudflared tunnel login > cloudflared tunnel create daurin
- Step 5 - Konfigurasi config.yml: ingress rule localhost:3000 ke tunnel UUID
- Step 6 - Cloudflare Dashboard > DNS: CNAME devmieayam.web.id ke &lt;tunnel-uuid&gt;.cfargotunnel.com
- Step 7 - Jalankan: cloudflared tunnel run daurin (via PM2 juga agar persist)
- Step 8 - Test <https://devmieayam.web.id> dari device lain; verifikasi SSL aktif (gembok hijau)
- Backup Plan: Jika tunnel bermasalah, gunakan ngrok sebagai fallback instant (ngrok http 3000)

## **7.5 Database Schema Overview**

| **Tabel**         | **Kolom Kunci**                                                           | **Relasi**                          |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| users             | id, name, email, role, lat, lng, waste_types_handled                      | 1 to many ke listings, orders       |
| waste_listings    | id, user_id, type, weight, photo_url, ai_classification, status, price    | FK user_id; FK ke pickup_claims     |
| pickup_claims     | id, listing_id, collector_id, status, claimed_at, picked_at               | FK listing_id, collector_id (users) |
| material_listings | id, collector_id, type, purpose, weight, price, status, photo_url         | FK collector_id; FK ke orders       |
| orders            | id, buyer_id, material_id, volume, status, final_price                    | FK buyer_id, material_id            |
| negotiations      | id, order_id, actor_id, type (offer/counter/deal/cancel), amount, message | FK order_id, actor_id               |
| transactions      | id, order_id, amount, status, created_at                                  | FK order_id                         |
| chat_messages     | id, negotiation_id, sender_id, message, created_at                        | FK negotiation_id (bonus)           |

# **8\. User Stories**

## **8.1 Rumah Tangga**

| **ID**   | **User Story**                                                                                                  | **Priority** |
| -------- | --------------------------------------------------------------------------------------------------------------- | ------------ |
| US-RT-01 | Sebagai RT, saya bisa mendaftar & login dengan peran Rumah Tangga agar bisa menggunakan platform                | P0           |
| US-RT-02 | Sebagai RT, saya bisa upload foto sampah dan mendapat prediksi jenis otomatis dari AI agar tidak salah kategori | P0           |
| US-RT-03 | Sebagai RT, saya bisa membuat listing sampah dengan detail berat & harga agar dapat ditemukan pengepul          | P0           |
| US-RT-04 | Sebagai RT, saya bisa melihat status listing saya (tersedia/diklaim/selesai) dan nominal yang diterima          | P0           |
| US-RT-05 | Sebagai RT, saya mendapat notifikasi saat sampah saya diklaim pengepul                                          | P1           |

## **8.2 Pengepul**

| **ID**   | **User Story**                                                                                            | **Priority** |
| -------- | --------------------------------------------------------------------------------------------------------- | ------------ |
| US-PG-01 | Sebagai pengepul, saya mendaftar dengan jenis sampah yang saya tangani agar hanya melihat listing relevan | P0           |
| US-PG-02 | Sebagai pengepul, saya bisa melihat peta titik sampah aktif yang sesuai jenis yang saya tangani           | P0           |
| US-PG-03 | Sebagai pengepul, saya bisa mengklaim & menandai listing sebagai diambil untuk memperbarui status         | P0           |
| US-PG-04 | Sebagai pengepul, saya mendapat saran rute pengambilan optimal berdasarkan posisi saya (nearest-neighbor) | P1           |
| US-PG-05 | Sebagai pengepul, saya bisa input hasil pilahan sebagai bahan baku dan listing-nya ke marketplace         | P0           |

## **8.3 Industri**

| **ID**   | **User Story**                                                                             | **Priority** |
| -------- | ------------------------------------------------------------------------------------------ | ------------ |
| US-IN-01 | Sebagai industri, saya bisa filter bahan baku berdasarkan jenis, lokasi, dan rentang harga | P0           |
| US-IN-02 | Sebagai industri, saya bisa memesan bahan baku dan memulai proses negosiasi harga          | P0           |
| US-IN-03 | Sebagai industri, saya bisa melakukan counter-offer dan menyepakati harga final            | P0           |
| US-IN-04 | Sebagai industri, saya bisa melihat riwayat transaksi dan status pesanan aktif             | P1           |
| US-IN-05 | (Bonus) Sebagai industri, saya bisa ekspor laporan transaksi bulanan ke PDF/Excel          | P2           |

# **9\. Sprint Plan 24 Jam**

Dengan tim 3 orang: Dev 1 (Backend/DB), Dev 2 (Frontend/UI), Dev 3 (AI/Map/Integration/PM)

## **Fase 1: Fondasi (Jam 0-3)**

| **Jam** | **Dev 1 - Backend**                       | **Dev 2 - Frontend**                 | **Dev 3 - AI/Map/PM**                        |
| ------- | ----------------------------------------- | ------------------------------------ | -------------------------------------------- |
| 0-1     | Setup Next.js + Supabase + Prisma         | Setup Next.js + Tailwind + shadcn/ui | Setup repo, README awal, task breakdown      |
| 1-2     | Desain & push schema DB (Prisma migrate)  | Desain layout & navigation global    | Load TF.js + MobileNet, test inference lokal |
| 2-3     | Implementasi Auth API (NextAuth/Supabase) | Halaman registrasi & login per role  | Setup Leaflet.js + OpenStreetMap tile        |

## **Fase 2: Core Features (Jam 3-14)**

| **Jam** | **Dev 1 - Backend**                             | **Dev 2 - Frontend**                         | **Dev 3 - AI/Map/PM**                                     |
| ------- | ----------------------------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| 3-7     | API: CRUD listing sampah RT + status management | Form input sampah RT + upload foto           | Integrasi TF.js ke form; klasifikasi otomatis saat upload |
| 7-10    | API: Marketplace query + filter + klaim         | Marketplace landing 3 lapis + filter UI      | Peta Leaflet + marker listing aktif per lokasi            |
| 10-14   | API: Bahan baku CRUD + order + negosiasi state  | UI bahan baku pengepul + order flow industri | Negosiasi thread UI + rute optimal nearest-neighbor       |

## **Fase 3: Integration & Dashboard (Jam 14-20)**

| **Jam** | **Dev 1 - Backend**                             | **Dev 2 - Frontend**                               | **Dev 3 - AI/Map/PM**                             |
| ------- | ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------- |
| 14-17   | API: Dashboard aggregasi + transaksi + CO2 calc | Dashboard per role + global dashboard              | End-to-end test alur RT > Pengepul > Industri     |
| 17-20   | Seed data dummy lengkap semua role              | Polish UI: responsif mobile, loading states, error | Bug fixing lintas fitur + Supabase Realtime notif |

## **Fase 4: Deployment & Presentasi (Jam 20-24)**

| **Jam** | **Aktivitas**                                                                                                                                                   | **PIC**       |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 20-22   | Deploy app ke Jagoan Hosting + setup Cloudflare Tunnel (cloudflared service) + konfigurasi DNS devmieayam.web.id di Cloudflare dashboard + test live URL publik | Dev 1 + Dev 3 |
| 22-23   | Finalisasi README (cara run, tech, asumsi, demo accounts) + commit push                                                                                         | Dev 3         |
| 23-24   | Latihan demo script & pitching; backup demo dengan data dummy siap                                                                                              | Semua         |

# **10\. Demo & Pitching Strategy**

## **10.1 Skenario Demo (Urutan 5 Menit)**

- Login sebagai Rumah Tangga Bu Sari > upload foto botol plastik > AI klasifikasi otomatis 'Plastik PET' > buat listing > confirm listing muncul di marketplace
- Switch ke akun Pengepul Pak Budi > filter marketplace 'Plastik PET' > lihat peta titik tersebar > aktifkan rute optimal nearest-neighbor > klaim listing Bu Sari > tandai diambil
- Balik ke akun Bu Sari > tunjukkan status sudah berubah 'Diambil' + nominal diterima
- Sebagai Pak Budi > input bahan baku hasil pilahan 'Flake PET' > listing ke marketplace industri dengan harga awal
- Switch ke akun Industri Pak Andi > filter bahan baku > pesan > mulai negosiasi (offer/counter-offer) > deal > tunjukkan dashboard transaksi + CO2 offset terupdate

## **10.2 Poin Pitching Utama**

- Hook: 'Setiap tahun Indonesia kehilangan nilai daur ulang senilai ratusan triliun rupiah karena rantai yang terputus. Daurin menghubungkan semua titik rantai itu dalam satu platform.'
- Differentiator: AI foto classification yang membantu RT; rute optimal yang hemat bensin pengepul; negosiasi terstruktur yang melindungi semua pihak
- Impact SDG: tampilkan dashboard CO2 offset dari data demo sebagai bukti konkret dampak lingkungan
- Scalability: arsitektur cloud-ready di Jagoan Hosting + Cloudflare Tunnel; mudah dipindahkan ke VPS yang lebih besar atau cloud provider (AWS/GCP) saat skala bertambah
- Revenue model: komisi transaksi 1-2% + SaaS untuk dasbor monitoring pemerintah

# **11\. Success Metrics**

| **Metric**                    | **Baseline**          | **Target MVP Demo**                   | **Cara Ukur**          |
| ----------------------------- | --------------------- | ------------------------------------- | ---------------------- |
| Semua 8 fitur wajib berjalan  | 0                     | 8/8 fitur functional                  | Checklist demo juri    |
| AI klasifikasi akurat         | N/A                   | \> 70% top-1 accuracy (5 kelas)       | Manual test 10+ gambar |
| Alur end-to-end RT > Industri | Tidak ada             | Dapat didemonstrasikan tanpa error    | Demo live juri         |
| Deploy public accessible      | Tidak ada             | URL dapat diakses dalam < 3 detik     | Juri akses langsung    |
| Responsif mobile              | Tidak ada             | Usable di layar 375px+                | Browser dev tools      |
| Rute optimal berjalan         | Manual, tidak efisien | Urutan rute + estimasi jarak tampil   | Demo peta pengepul     |
| Negosiasi flow lengkap        | Tidak ada             | Offer > Counter > Deal tercatat di DB | Cek riwayat negosiasi  |
| Dashboard CO2 offset          | Tidak ada             | Nilai CO2 terupdate setelah transaksi | Demo dashboard publik  |

# **12\. Risks & Mitigations**

| **Risk**                          | **Probability** | **Impact** | **Mitigation**                                                                                                       |
| --------------------------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| TF.js MobileNet lambat di browser | Medium          | Tinggi     | Cache model setelah load pertama; tampilkan loading state; gunakan quantized model                                   |
| Supabase quota habis              | Low             | Tinggi     | Monitor usage; gunakan seed data efisien; tidak upload foto besar-besar                                              |
| Leaflet/map tidak load            | Low             | Medium     | Fallback ke list koordinat tanpa peta; test offline dulu                                                             |
| Negosiasi state machine kompleks  | High            | Medium     | Buat state diagram sederhana dulu; hardcode state transitions yang valid                                             |
| Waktu 24 jam tidak cukup          | Medium          | Tinggi     | Prioritas strict P0 dulu; bonus dikerjakan hanya jika P0 semua selesai sebelum jam 18                                |
| Deploy/tunnel gagal               | Medium          | Tinggi     | Test Cloudflare Tunnel sejak jam 16; siapkan ngrok sebagai backup tunnel; simpan local screenshots untuk backup demo |

# **13\. Appendix**

## **A. Kalkuasi CO2 Offset per Jenis Sampah**

| **Jenis Sampah**     | **CO2 Offset per kg** | **Referensi**                           |
| -------------------- | --------------------- | --------------------------------------- |
| Plastik (PET/HDPE)   | 1.5 - 2.0 kg CO2e/kg  | EPA Waste Reduction Model (WARM)        |
| Kertas/Kardus        | 0.7 - 1.1 kg CO2e/kg  | IPCC Waste Sector Guidelines            |
| Logam/Aluminium      | 8.0 - 9.5 kg CO2e/kg  | World Aluminium (recycling vs. primary) |
| Kaca                 | 0.3 - 0.5 kg CO2e/kg  | Glass Recycling Coalition               |
| Elektronik (e-waste) | 20+ kg CO2e/kg        | StEP Initiative E-waste Monitor         |

## **B. Daftar Asumsi untuk README**

- Pembayaran disimulasikan (tidak terhubung ke payment gateway nyata)
- Koordinat lokasi disimpan sebagai latitude/longitude desimal
- AI klasifikasi menggunakan MobileNetV2 pre-trained; akurasi bervariasi tergantung kualitas foto
- Optimasi rute menggunakan nearest-neighbor greedy; tidak menjamin solusi global optimal
- CO2 offset dihitung berdasarkan nilai tengah tabel konversi EPA/IPCC
- Negosiasi harga minimal mencakup offer > counter-offer > deal/cancel; multi-putaran didukung
- Pengepul mendaftar jenis sampah yang ditangani saat registrasi dan tidak dapat diubah (dalam MVP)
- Semua mata uang dalam Rupiah (IDR)

_Daurin PRD v1.0 • Tim Mie Ayam Solo • PLAY IT! 2026_

**SDG 1 • SDG 9 • SDG 11 • SDG 12 • SDG 13 • SDG 17**
