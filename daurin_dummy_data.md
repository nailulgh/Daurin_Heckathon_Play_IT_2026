# Daurin — Data Dummy Lengkap

> Versi: 1.0 | Cakupan: Semua layer (RT → Pengepul → Industri), edge case negosiasi, skenario AI/ML klasifikasi foto

---

## 1. USERS (Akun Demo per Peran)

### 1.1 Rumah Tangga

| id | nama | email | password | koordinat (lat, lng) | kelurahan | kota |
|----|------|-------|----------|----------------------|-----------|------|
| USR-RT-001 | Dewi Rahayu | dewi.rt@daurin.id | demo1234 | -7.9539, 112.6131 | Lowokwaru | Malang |
| USR-RT-002 | Budi Santoso | budi.rt@daurin.id | demo1234 | -7.9664, 112.6326 | Blimbing | Malang |
| USR-RT-003 | Siti Aminah | siti.rt@daurin.id | demo1234 | -7.9797, 112.6208 | Kedungkandang | Malang |
| USR-RT-004 | Rian Perkasa | rian.rt@daurin.id | demo1234 | -7.9432, 112.6044 | Sukun | Malang |
| USR-RT-005 | Fitri Handayani | fitri.rt@daurin.id | demo1234 | -7.9601, 112.6170 | Klojen | Malang |

### 1.2 Pengepul

| id | nama | email | password | koordinat (lat, lng) | jenis_ditangani | radius_km | kelurahan |
|----|------|-------|----------|----------------------|-----------------|-----------|-----------|
| USR-PGL-001 | Ahmad Collector | ahmad.col@daurin.id | demo1234 | -7.9480, 112.6100 | plastik_PET, plastik_HDPE, kertas, kardus | 5 | Sukun |
| USR-PGL-002 | Rudi Scrap | rudi.col@daurin.id | demo1234 | -7.9700, 112.6350 | logam, kaleng, elektronik | 7 | Blimbing |
| USR-PGL-003 | Mega Daur | mega.col@daurin.id | demo1234 | -7.9600, 112.6200 | kaca, plastik_PET, plastik_HDPE | 6 | Klojen |
| USR-PGL-004 | Joko Recycle | joko.col@daurin.id | demo1234 | -7.9550, 112.6300 | kertas, kardus, organik | 4 | Lowokwaru |

### 1.3 Industri Pengolah

| id | nama | email | password | koordinat (lat, lng) | spesialisasi | kota |
|----|------|-------|----------|----------------------|--------------|------|
| USR-IND-001 | PT Plastindo Maju | plastindo@daurin.id | demo1234 | -7.9900, 112.6500 | plastik_PET, plastik_HDPE | Malang |
| USR-IND-002 | CV Logam Perkasa | logamperkasa@daurin.id | demo1234 | -8.0100, 112.6600 | logam, kaleng | Malang |
| USR-IND-003 | PT Kertas Nusantara | kertas.nu@daurin.id | demo1234 | -7.9800, 112.6400 | kertas, kardus | Malang |
| USR-IND-004 | CV Kaca Bening | kacabening@daurin.id | demo1234 | -7.9750, 112.6450 | kaca | Malang |

---

## 2. MASTER DATA JENIS SAMPAH

| kode | nama_tampil | kategori | satuan | harga_acuan_per_kg | deskripsi |
|------|------------|----------|--------|-------------------|-----------|
| PLSTK-PET | Plastik PET | plastik | kg | 3.500 | Botol air mineral, botol soda — biasanya ada kode daur ulang angka 1 |
| PLSTK-HDPE | Plastik HDPE | plastik | kg | 2.800 | Jerigen, ember, galon — kode daur ulang angka 2 |
| PLSTK-PP | Plastik PP | plastik | kg | 2.000 | Tutup botol, sedotan, wadah makanan — kode 5 |
| PLSTK-MIX | Plastik Campuran | plastik | kg | 1.200 | Plastik tidak teridentifikasi / campur jenis |
| KRTS-HVS | Kertas HVS/Koran | kertas | kg | 1.800 | Kertas bekas cetak, koran, majalah |
| KRTS-KRD | Kardus/Karton | kertas | kg | 1.500 | Dus bekas, karton tebal |
| LOGM-BJ | Besi/Baja | logam | kg | 4.500 | Sisa konstruksi, peralatan rusak |
| LOGM-ALM | Aluminium | logam | kg | 14.000 | Kaleng minuman, kusen aluminium bekas |
| LOGM-TBG | Tembaga | logam | kg | 65.000 | Kabel tembaga, fitting rusak |
| KCA-BTL | Kaca Botol | kaca | kg | 800 | Botol kaca bekas |
| KCA-LBR | Kaca Lembaran | kaca | kg | 600 | Kaca jendela pecah |
| ELKT-HP | Handphone Bekas | elektronik | unit | 25.000 | HP rusak/tidak terpakai |
| ELKT-PCB | PCB/Komponen Elektronik | elektronik | kg | 18.000 | Papan sirkuit, komponen elektronik |
| ORGK | Organik/Kompos | organik | kg | 500 | Sisa makanan, daun kering — untuk kompos |

---

## 3. LISTING SAMPAH (Rumah Tangga)

> Status: `tersedia` | `diambil` | `terjual`

| id | user_id | jenis_kode | jumlah_kg | foto_url | status | harga_ditawarkan | koordinat | ai_klasifikasi | ai_confidence | ai_saran_jenis | catatan | created_at |
|----|---------|------------|-----------|----------|--------|-----------------|-----------|----------------|---------------|----------------|---------|------------|
| LST-001 | USR-RT-001 | PLSTK-PET | 3.5 | /uploads/img_001.jpg | tersedia | 12.000 | -7.9539, 112.6131 | plastik_PET | 0.94 | PLSTK-PET | Botol aqua & sprite dikumpulkan seminggu | 2025-06-20 09:10 |
| LST-002 | USR-RT-001 | KRTS-KRD | 7.2 | /uploads/img_002.jpg | diambil | 10.000 | -7.9539, 112.6131 | kardus | 0.91 | KRTS-KRD | Dus bekas belanja online | 2025-06-19 14:30 |
| LST-003 | USR-RT-002 | LOGM-ALM | 1.8 | /uploads/img_003.jpg | terjual | 25.000 | -7.9664, 112.6326 | aluminium | 0.88 | LOGM-ALM | Kaleng bir & minuman soda | 2025-06-18 10:00 |
| LST-004 | USR-RT-002 | PLSTK-MIX | 4.0 | /uploads/img_004.jpg | tersedia | 4.000 | -7.9664, 112.6326 | plastik_campuran | 0.72 | PLSTK-PP | AI ragu: bisa PP atau MIX, user pilih MIX | 2025-06-20 11:00 |
| LST-005 | USR-RT-003 | KCA-BTL | 5.5 | /uploads/img_005.jpg | tersedia | 4.000 | -7.9797, 112.6208 | kaca | 0.96 | KCA-BTL | Botol kecap, saus, sirup | 2025-06-20 08:45 |
| LST-006 | USR-RT-003 | ELKT-HP | 2.0 (unit) | /uploads/img_006.jpg | tersedia | 40.000 | -7.9797, 112.6208 | elektronik | 0.85 | ELKT-HP | 2 hp android rusak layar | 2025-06-20 09:30 |
| LST-007 | USR-RT-004 | KRTS-HVS | 3.0 | /uploads/img_007.jpg | tersedia | 5.000 | -7.9432, 112.6044 | kertas | 0.90 | KRTS-HVS | Koran & majalah lama | 2025-06-20 12:00 |
| LST-008 | USR-RT-004 | PLSTK-PET | 2.2 | /uploads/img_008.jpg | diambil | 7.500 | -7.9432, 112.6044 | plastik_PET | 0.93 | PLSTK-PET | Botol PET bersih, sudah dicuci | 2025-06-19 16:00 |
| LST-009 | USR-RT-005 | LOGM-BJ | 8.0 | /uploads/img_009.jpg | tersedia | 35.000 | -7.9601, 112.6170 | besi | 0.89 | LOGM-BJ | Besi tua dari renovasi kamar | 2025-06-20 07:30 |
| LST-010 | USR-RT-005 | ORGK | 10.0 | /uploads/img_010.jpg | tersedia | 4.500 | -7.9601, 112.6170 | organik | 0.78 | ORGK | Sisa makanan campur daun, agak basah | 2025-06-20 10:15 |

---

## 4. SKENARIO AI/ML — KLASIFIKASI FOTO

> Ini adalah skenario lengkap yang harus bisa didemokan, termasuk edge case confidence rendah dan salah klasifikasi yang dikoreksi user.

| skenario_id | deskripsi_foto | ai_output_kelas | ai_confidence | edge_case | aksi_user | hasil_akhir |
|-------------|---------------|-----------------|---------------|-----------|-----------|-------------|
| AI-SC-001 | Foto botol plastik bening (PET) bersih, cahaya baik | plastik_PET | 0.94 | Normal — high confidence | User setuju | PLSTK-PET dikonfirmasi |
| AI-SC-002 | Foto kardus coklat, dilipat | kardus | 0.91 | Normal — high confidence | User setuju | KRTS-KRD dikonfirmasi |
| AI-SC-003 | Foto kaleng aluminium minuman | aluminium | 0.88 | Normal | User setuju | LOGM-ALM dikonfirmasi |
| AI-SC-004 | Foto campuran plastik warna-warni dalam kantong | plastik_campuran | 0.72 | **Low confidence** — AI ragu antara PP dan MIX | User override pilih PLSTK-MIX | User correction dicatat |
| AI-SC-005 | Foto botol kecap kaca gelap | kaca | 0.96 | Normal — very high confidence | User setuju | KCA-BTL dikonfirmasi |
| AI-SC-006 | Foto HP rusak layar retak | elektronik | 0.85 | Normal | User setuju | ELKT-HP dikonfirmasi |
| AI-SC-007 | Foto kertas HVS putih kusut | kertas | 0.90 | Normal | User setuju | KRTS-HVS dikonfirmasi |
| AI-SC-008 | Foto styrofoam putih (bukan kategori) | styrofoam | 0.65 | **Out-of-class** — AI klasifikasi diluar 5 kategori utama | User mendapat warning: "Jenis ini belum kami terima" | Listing tidak bisa dibuat untuk jenis ini |
| AI-SC-009 | Foto besi berkarat di sudut gelap | plastik_campuran | 0.51 | **Misclassification + very low confidence** — AI salah & tidak yakin | AI tampilkan warning "Kami kurang yakin, tolong pilih manual" → User pilih LOGM-BJ | User correction dicatat sebagai training data |
| AI-SC-010 | Foto campuran besi dan plastik dalam 1 foto | logam | 0.58 | **Multi-object confusion** — foto berisi >1 jenis | AI sarankan: "Pisahkan foto per jenis sampah" | User ambil 2 foto terpisah |

---

## 5. PENGAMBILAN (Klaim Listing oleh Pengepul)

| id | listing_id | pengepul_id | status | rute_titik | jarak_total_km | estimasi_biaya_rp | waktu_klaim | waktu_ambil |
|----|------------|-------------|--------|------------|----------------|-------------------|-------------|-------------|
| AMB-001 | LST-002 | USR-PGL-001 | selesai | [USR-PGL-001 → LST-002] | 2.3 | 5.750 | 2025-06-19 15:00 | 2025-06-19 16:30 |
| AMB-002 | LST-008 | USR-PGL-001 | selesai | [USR-PGL-001 → LST-008] | 3.1 | 7.750 | 2025-06-19 16:05 | 2025-06-19 17:00 |
| AMB-003 | LST-003 | USR-PGL-002 | selesai | [USR-PGL-002 → LST-003] | 1.8 | 4.500 | 2025-06-18 10:30 | 2025-06-18 11:15 |
| AMB-004 | LST-001, LST-007 | USR-PGL-001 | proses | [USR-PGL-001 → LST-007 → LST-001] | 4.8 | 12.000 | 2025-06-20 10:00 | - |

> **Catatan rute multi-titik AMB-004:**
> Nearest-neighbor dari posisi pengepul USR-PGL-001 (-7.948, 112.610):
> - Titik 1: LST-007 (-7.9432, 112.6044) → jarak haversine ≈ 0.7 km
> - Titik 2: LST-001 (-7.9539, 112.6131) → jarak dari titik 1 ≈ 1.4 km
> - Total rute: 0.7 + 1.4 + (balik base) 2.7 ≈ 4.8 km
> - Estimasi biaya: 4.8 km × Rp2.500/km = Rp12.000

---

## 6. BAHAN BAKU (Output Pilahan Pengepul)

> Setelah pengepul mengambil dan memilah, mereka input bahan baku untuk dijual ke industri.

| id | pengepul_id | asal_pengambilan | jenis_kode | berat_kg | peruntukan | harga_awal_per_kg | status | created_at |
|----|-------------|-----------------|------------|----------|------------|-------------------|--------|------------|
| BB-001 | USR-PGL-001 | AMB-001 | KRTS-KRD | 6.8 | Bahan baku kertas daur ulang | 1.800 | tersedia | 2025-06-20 08:00 |
| BB-002 | USR-PGL-001 | AMB-002 | PLSTK-PET | 2.0 | Bahan baku cacahan PET | 4.000 | terjual | 2025-06-20 08:15 |
| BB-003 | USR-PGL-002 | AMB-003 | LOGM-ALM | 1.7 | Bahan baku ingot aluminium | 15.000 | tersedia | 2025-06-19 13:00 |
| BB-004 | USR-PGL-001 | AMB-004 | PLSTK-PET | 3.3 | Cacahan PET grade A | 4.200 | tersedia | 2025-06-20 13:00 |
| BB-005 | USR-PGL-001 | AMB-004 | KRTS-HVS | 2.8 | Pulp kertas | 1.900 | negosiasi | 2025-06-20 13:10 |
| BB-006 | USR-PGL-003 | - | KCA-BTL | 12.0 | Cullet kaca hijau | 1.000 | tersedia | 2025-06-20 09:00 |
| BB-007 | USR-PGL-002 | - | LOGM-BJ | 25.0 | Skrap besi untuk peleburan | 5.000 | tersedia | 2025-06-20 10:00 |
| BB-008 | USR-PGL-004 | - | KRTS-KRD | 18.0 | Kardus daur ulang industri | 1.600 | tersedia | 2025-06-20 11:00 |

---

## 7. PEMESANAN & NEGOSIASI HARGA (Edge Case Lengkap)

> Flow: `pending` → `negosiasi` → `deal` / `batal`
> Negosiasi: offer → counter_offer → deal/cancel (minimal 1 round, bisa multi-round)

### 7.1 Skenario Normal — Deal di Round 1

| id | bahan_baku_id | industri_id | status_pesanan | harga_awal | offer_industri | counter_pengepul | final_price | status_nego | catatan |
|----|---------------|-------------|----------------|-----------|----------------|-----------------|-------------|-------------|---------|
| ORD-001 | BB-001 | USR-IND-003 | selesai | 1.800/kg | 1.600/kg | 1.750/kg | 1.750/kg | deal | Sepakat di round 1 counter |
| ORD-002 | BB-003 | USR-IND-002 | selesai | 15.000/kg | 14.000/kg | 14.500/kg | 14.500/kg | deal | Deal round 1 |

### 7.2 Skenario Multi-Round Negosiasi

| id | bahan_baku_id | industri_id | status_pesanan | harga_awal | riwayat_nego | final_price | status_nego |
|----|---------------|-------------|----------------|-----------|--------------|-------------|-------------|
| ORD-003 | BB-004 | USR-IND-001 | aktif | 4.200/kg | Lihat tabel negosiasi detail di bawah | - | proses |
| ORD-004 | BB-005 | USR-IND-003 | aktif | 1.900/kg | Lihat tabel negosiasi detail di bawah | - | proses |

#### Detail Riwayat Negosiasi ORD-003 (Multi-round, masih jalan)

| round | aktor | tipe | harga_per_kg | pesan | timestamp |
|-------|-------|------|-------------|-------|-----------|
| 0 | Pengepul USR-PGL-001 | harga_awal | 4.200 | "Cacahan PET grade A, bersih, kering" | 2025-06-20 13:00 |
| 1 | Industri USR-IND-001 | offer | 3.600 | "Stok kami lagi penuh, bisa lebih murah?" | 2025-06-20 13:15 |
| 2 | Pengepul USR-PGL-001 | counter_offer | 4.000 | "Kualitas grade A, susah di bawah 4.000" | 2025-06-20 13:30 |
| 3 | Industri USR-IND-001 | counter_offer | 3.800 | "3.800 final dari kami" | 2025-06-20 13:45 |
| 4 | Pengepul USR-PGL-001 | counter_offer | 3.900 | "3.900, kita ketemu di tengah" | 2025-06-20 14:00 |
| *(menunggu respon industri)* | - | - | - | - | - |

#### Detail Riwayat Negosiasi ORD-004 (Batal)

| round | aktor | tipe | harga_per_kg | pesan | timestamp |
|-------|-------|------|-------------|-------|-----------|
| 0 | Pengepul USR-PGL-001 | harga_awal | 1.900 | "Pulp kertas kering" | 2025-06-20 13:10 |
| 1 | Industri USR-IND-003 | offer | 1.200 | "Harga pasar lagi turun" | 2025-06-20 13:25 |
| 2 | Pengepul USR-PGL-001 | counter_offer | 1.750 | "1.200 terlalu jauh, minimal 1.750" | 2025-06-20 13:40 |
| 3 | Industri USR-IND-003 | batal | - | "Maaf, budget kami tidak cukup" | 2025-06-20 14:00 |

> Status ORD-004: **batal**. BB-005 kembali ke status `tersedia`.

### 7.3 Skenario Transaksi Selesai

| id | order_id | nominal_transaksi | metode_bayar | status_bayar | timestamp |
|----|----------|------------------|--------------|--------------|-----------|
| TRX-001 | ORD-001 | 12.240 | simulasi_transfer | lunas | 2025-06-20 09:00 |
| TRX-002 | ORD-002 | 24.650 | simulasi_transfer | lunas | 2025-06-19 15:00 |

> Kalkulasi TRX-001: 6.8 kg × Rp1.750 = Rp11.900 *(dibulatkan + biaya admin 2.8% = Rp12.234, dibulatkan Rp12.240)*

---

## 8. BAHAN BAKU JADI (Output Industri — Opsional)

| id | industri_id | asal_order | jenis_produk | berat_kg | harga_jual_per_kg | status | keterangan |
|----|-------------|------------|-------------|----------|-------------------|--------|------------|
| BBJ-001 | USR-IND-003 | ORD-001 | Kertas daur ulang A4 | 5.5 | 8.500 | tersedia | Diproses dari BB-001, yield 81% |
| BBJ-002 | USR-IND-002 | ORD-002 | Ingot aluminium 99% | 1.5 | 22.000 | tersedia | Yield peleburan 88% |

---

## 9. DATA RUTE OPTIMASI (Nearest-Neighbor + Haversine)

> Dipakai untuk demo fitur peta dan rute pengepul.

### 9.1 Contoh Kalkulasi Haversine (Pseudo-data)

| id | dari | ke | lat_dari | lng_dari | lat_ke | lng_ke | jarak_km | estimasi_biaya_rp |
|----|------|----|----------|----------|--------|--------|----------|-------------------|
| RT-001 | Base USR-PGL-001 | LST-007 | -7.9480 | 112.6100 | -7.9432 | 112.6044 | 0.72 | 1.800 |
| RT-002 | LST-007 | LST-001 | -7.9432 | 112.6044 | -7.9539 | 112.6131 | 1.43 | 3.575 |
| RT-003 | LST-001 | Base USR-PGL-001 | -7.9539 | 112.6131 | -7.9480 | 112.6100 | 0.72 | 1.800 |

> **Total AMB-004:** 0.72 + 1.43 + 0.72 = **2.87 km** → Rp2.500/km → **Rp7.175**
> *(Asumsi: biaya operasional kendaraan = Rp2.500/km)*

### 9.2 Semua Titik Pengambilan Aktif (untuk render peta)

| titik_id | listing_id | user_rt | lat | lng | jenis | status |
|----------|------------|---------|-----|-----|-------|--------|
| PIN-001 | LST-001 | Dewi Rahayu | -7.9539 | 112.6131 | Plastik PET | tersedia |
| PIN-002 | LST-004 | Budi Santoso | -7.9664 | 112.6326 | Plastik Campuran | tersedia |
| PIN-003 | LST-005 | Siti Aminah | -7.9797 | 112.6208 | Kaca Botol | tersedia |
| PIN-004 | LST-006 | Siti Aminah | -7.9797 | 112.6208 | Elektronik HP | tersedia |
| PIN-005 | LST-007 | Rian Perkasa | -7.9432 | 112.6044 | Kertas HVS | tersedia |
| PIN-006 | LST-009 | Fitri Handayani | -7.9601 | 112.6170 | Besi/Baja | tersedia |
| PIN-007 | LST-010 | Fitri Handayani | -7.9601 | 112.6170 | Organik | tersedia |

---

## 10. DASHBOARD — DATA AGREGAT

| metrik | nilai | keterangan |
|--------|-------|-----------|
| Total listing aktif | 7 | Status `tersedia` |
| Total listing diambil (bulan ini) | 2 | LST-002, LST-008 |
| Total transaksi selesai | 2 | TRX-001, TRX-002 |
| Total nominal transaksi | Rp36.890 | TRX-001 + TRX-002 |
| Total berat material terproses | 8.5 kg | BB-001 (6.8) + BB-003 (1.7) |
| Estimasi emisi CO₂ dihemat | 12.75 kg CO₂ | Asumsi: 1.5 kg CO₂/kg material daur ulang |
| Jenis sampah terbanyak | Plastik PET | 3 listing dari total |
| Pengepul paling aktif | USR-PGL-001 (Ahmad) | 3 pengambilan |

### 10.1 Volume per Jenis (untuk chart)

| jenis | total_kg_masuk | total_kg_terjual | persentase_konversi |
|-------|----------------|-----------------|---------------------|
| Plastik PET | 7.7 | 5.3 | 68.8% |
| Kardus | 14.0 | 6.8 | 48.6% |
| Aluminium | 1.8 | 1.7 | 94.4% |
| Kaca Botol | 17.5 | 0 | 0% |
| Besi/Baja | 33.0 | 0 | 0% |
| Kertas HVS | 5.8 | 0 | 0% |

---

## 11. EDGE CASE KHUSUS (Untuk Test Integritas Sistem)

| edge_case_id | deskripsi | data terkait | ekspektasi sistem |
|-------------|-----------|-------------|-------------------|
| EC-001 | Pengepul mencoba klaim listing jenis yang tidak ditangani | USR-PGL-004 (kertas,kardus) coba klaim LST-003 (aluminium) | Sistem tolak, tampilkan "Jenis sampah tidak sesuai spesialisasi Anda" |
| EC-002 | Listing di-klaim dua pengepul bersamaan (race condition) | LST-001 diklaim USR-PGL-001 dan USR-PGL-003 hampir bersamaan | Sistem hanya terima pertama, yang kedua dapat notif "Sudah diambil" |
| EC-003 | Negosiasi expired — tidak ada respon 24 jam | ORD-003 round 4 tanpa respon | Sistem auto-cancel dan kembalikan status BB ke `tersedia` |
| EC-004 | AI confidence sangat rendah (<0.55) | AI-SC-009 (besi difoto gelap, AI bilang plastik confidence 0.51) | Sistem paksa user pilih manual, tidak bisa submit tanpa konfirmasi |
| EC-005 | User RT input foto jenis diluar kategori | AI-SC-008 (styrofoam) | Sistem warning: "Jenis belum kami terima", listing tidak bisa dibuat |
| EC-006 | Bahan baku diorder tapi industri batalkan setelah deal | ORD-004 batal setelah counter offer round 2 | Status BB-005 kembali `tersedia`, notif ke pengepul |
| EC-007 | Pengepul klaim listing tapi tidak pernah diambil (timeout) | AMB-004 melewati waktu estimasi | Status listing kembali `tersedia`, pengepul dapat warning |
| EC-008 | Multi-foto per listing untuk identifikasi campuran | LST-004 (plastik campuran) — AI confusion | AI sarankan pisah per jenis, atau konfirmasi manual kategori dominan |

---

## 12. AKUN DEMO (Ringkasan untuk README)

```
=== AKUN DEMO DAURIN ===

[RUMAH TANGGA]
Email: dewi.rt@daurin.id     | Pass: demo1234  → punya listing aktif + sudah pernah terjual
Email: budi.rt@daurin.id     | Pass: demo1234  → punya listing dengan edge case AI confidence rendah
Email: siti.rt@daurin.id     | Pass: demo1234  → punya listing elektronik & kaca

[PENGEPUL]
Email: ahmad.col@daurin.id   | Pass: demo1234  → pengepul paling aktif, punya rute multi-titik
Email: rudi.col@daurin.id    | Pass: demo1234  → spesialis logam, sudah ada transaksi selesai
Email: mega.col@daurin.id    | Pass: demo1234  → spesialis kaca + plastik

[INDUSTRI PENGOLAH]
Email: plastindo@daurin.id   | Pass: demo1234  → sedang dalam negosiasi multi-round aktif
Email: logamperkasa@daurin.id| Pass: demo1234  → sudah punya transaksi selesai
Email: kertas.nu@daurin.id   | Pass: demo1234  → pernah batalkan negosiasi (edge case)
```

---

## 13. ASUMSI YANG PERLU DICANTUMKAN DI README

- Koordinat dummy menggunakan lokasi di area Kota Malang (bounding box: -8.05 s/d -7.93 lat, 112.59 s/d 112.68 lng).
- Biaya pengambilan = Rp2.500/km (flat, tidak termasuk BBM variabel).
- Algoritma rute = nearest-neighbor greedy dengan jarak haversine; bukan TSP optimal.
- Pembayaran bersifat simulasi (tidak terhubung payment gateway nyata).
- Negosiasi timeout = 24 jam per round tanpa respon → auto-cancel.
- AI klasifikasi menggunakan model pre-trained (MobileNet via TensorFlow.js atau Teachable Machine) dengan 5 kelas: plastik, kertas, logam, kaca, elektronik. Confidence threshold: 0.60.
- Di bawah threshold 0.60, user wajib pilih manual (sistem tidak menerima submission tanpa konfirmasi jenis).
- Yield konversi bahan baku jadi diasumsikan 80-90% dari input berat kotor.
- Emisi CO₂ yang dihemat = 1.5 kg CO₂ per kg material yang berhasil didaur ulang (referensi: KLHK 2023, nilai rata-rata).
