# Dev 3 — Panduan Aset Gambar Real untuk Demo AI

> Konteks: MobileNetV2 via TensorFlow.js, 5 kelas Daurin
> Tujuan: Demo AI terasa real di depan juri — bukan sekadar screenshot

---

## Kenapa Ini Penting

MobileNetV2 dilatih di ImageNet (1.000 kelas objek nyata). Artinya model ini tidak mengenal kata "sampah" secara langsung — dia mengenal "bottle", "can", "carton", dll. Foto yang bagus = confidence tinggi = demo yang meyakinkan. Foto yang jelek = confidence rendah = juri ragu apakah AI-nya jalan.

**Satu aturan utama:** Foto harus mirip kondisi foto produk di e-commerce — objek jelas, background bersih, pencahayaan cukup.

---

## Opsi A — Download dari Dataset Open Source (Recommended)

Ini paling efisien. Gambar-gambar ini sudah dipakai di paper akademik, jadi kualitasnya terjamin.

### Dataset Utama: Drinking Waste Classification (Kaggle)

**Link:** `https://www.kaggle.com/datasets/arkadiyhacks/drinking-waste-classification`

Dataset ini berisi sekitar 10.000 gambar yang dibagi ke 4 kelas: Aluminium Cans, Glass Bottles, PET Bottles, dan HDPE Milk Bottles — diambil dengan kamera HP 12 MP. Ini paling relevan karena langsung memisahkan PET dan HDPE, yang persis sama dengan kebutuhan Daurin.

Mapping ke kelas Daurin:

| Folder di Dataset | Kode Daurin | Label |
|---|---|---|
| `aluminium_cans/` | LOGM-ALM | Aluminium/Kaleng |
| `glass_bottles/` | KCA-BTL | Kaca Botol |
| `plastic_pet/` | PLSTK-PET | Plastik PET |
| `plastic_hdpe/` | PLSTK-HDPE | Plastik HDPE |

### Dataset Backup: TrashNet (Kaggle)

**Link:** `https://www.kaggle.com/datasets/feyzazkefe/trashnet`

TrashNet berisi 2.527 gambar yang dibagi ke 6 kelas: glass, paper, cardboard, plastic, metal, dan trash. Semua foto diambil dengan objek di atas posterboard putih menggunakan cahaya alami — kondisi foto yang konsisten dan bersih.

Mapping ke kelas Daurin:

| Folder TrashNet | Kode Daurin | Label |
|---|---|---|
| `plastic/` | PLSTK-PET | Plastik PET (fallback) |
| `cardboard/` | KRTS-KRD | Kardus |
| `paper/` | KRTS-HVS | Kertas HVS |
| `metal/` | LOGM-ALM | Logam/Kaleng |
| `glass/` | KCA-BTL | Kaca Botol |

---

## 5 Foto Wajib untuk Demo Juri

Pilih 1 gambar terbaik per kelas. Kriteria: objek mengisi minimal 60% frame, background terang/putih, tidak blur.

### Foto 1 — PLASTIK PET (`PLSTK-PET`)

**Objek ideal:** Botol Aqua 600ml bersih, sudah dicuci, label masih ada

**Ambil dari:** `drinking-waste-classification/plastic_pet/` atau `trashnet/plastic/`

**Apa yang diharapkan dari MobileNetV2:**
```
Prediksi: "water bottle" → mapped ke PLSTK-PET
Confidence target: > 0.85
```

**Tips foto sendiri jika perlu:**
- Taruh botol di atas meja putih / kertas HVS
- Foto dari depan, tegak, full objek terlihat
- Gunakan cahaya siang dari jendela (bukan flash)

---

### Foto 2 — PLASTIK HDPE (`PLSTK-HDPE`)

**Objek ideal:** Botol sampo Sunsilk / Pantene ukuran besar, atau jerigen 5L

**Ambil dari:** `drinking-waste-classification/plastic_hdpe/` (folder HDPE milk bottles paling mirip bentuknya)

**Apa yang diharapkan dari MobileNetV2:**
```
Prediksi: "lotion" / "bottle" / "soap dispenser" → mapped ke PLSTK-HDPE
Confidence target: > 0.75
```

> **Catatan:** HDPE confidence biasanya lebih rendah dari PET karena bentuknya lebih bervariasi. Ini justru bagus untuk demo — tunjukkan ke juri bahwa sistem punya threshold dan minta user konfirmasi kalau confidence < 0.60.

**Tips foto sendiri:**
- Objek rapi (tidak penyok parah), berdiri tegak
- Lepas tutup botol agar bentuk lebih jelas

---

### Foto 3 — KARDUS (`KRTS-KRD`)

**Objek ideal:** Dus bekas J&T / Shopee yang sudah dilipat rapi

**Ambil dari:** `trashnet/cardboard/`

**Apa yang diharapkan dari MobileNetV2:**
```
Prediksi: "carton" / "box" → mapped ke KRTS-KRD
Confidence target: > 0.88
```

**Tips foto sendiri:**
- Lipat kardus flat, taruh di lantai
- Foto dari atas (bird-eye view) → kardus paling mudah dikenali dari atas
- Pastikan terlihat tekstur coklat khasnya

---

### Foto 4 — KALENG ALUMINIUM (`LOGM-ALM`)

**Objek ideal:** Kaleng Pocari Sweat / Sprite / Coca-Cola bersih

**Ambil dari:** `drinking-waste-classification/aluminium_cans/`

**Apa yang diharapkan dari MobileNetV2:**
```
Prediksi: "can" / "tin can" / "beer bottle" → mapped ke LOGM-ALM
Confidence target: > 0.90
```

> Ini biasanya confidence paling tinggi karena bentuk kaleng aluminium sangat khas dan banyak di ImageNet.

**Tips foto sendiri:**
- Satu kaleng, tegak, label menghadap depan
- Background putih / meja kayu terang

---

### Foto 5 — EDGE CASE: PLASTIK CAMPURAN LOW CONFIDENCE (`PLSTK-MIX`)

**Objek ideal:** Kantong kresek hitam isi campur-campur, atau tumpukan plastik warna-warni

**Ambil dari:** Foto sendiri — ini sengaja dibuat ambigu

**Apa yang diharapkan dari MobileNetV2:**
```
Prediksi: confidence < 0.60 (mungkin "bag" atau "plastic bag")
Sistem response: warning muncul → user harus pilih manual
```

> **Ini adalah foto terpenting untuk demo.** Juri yang paham AI akan sangat terkesan melihat sistem yang *tahu kapan dia tidak yakin* dan meminta konfirmasi user — bukan memaksakan prediksi salah dengan confidence tinggi palsu.

---

## Struktur Folder Aset di Repo

```
/public/
  demo-images/
    demo_01_plastik_pet.jpg       ← botol Aqua
    demo_02_plastik_hdpe.jpg      ← botol sampo
    demo_03_kardus.jpg            ← dus belanja online
    demo_04_kaleng_aluminium.jpg  ← kaleng minuman
    demo_05_plastik_campuran.jpg  ← edge case, low confidence
    
  seed-images/                    ← gambar untuk data dummy (10 listing)
    img_001.jpg  → LST-001 (Dewi, PET)
    img_002.jpg  → LST-002 (Dewi, kardus)
    img_003.jpg  → LST-003 (Budi, aluminium)
    img_004.jpg  → LST-004 (Budi, plastik campuran)
    img_005.jpg  → LST-005 (Siti, kaca)
    img_006.jpg  → LST-006 (Siti, HP)
    img_007.jpg  → LST-007 (Rian, kertas)
    img_008.jpg  → LST-008 (Rian, PET)
    img_009.jpg  → LST-009 (Fitri, besi) ← edge case misclassification
    img_010.jpg  → LST-010 (Fitri, organik)
```

---

## Checklist Sebelum Hari H

**Download & seleksi (bisa dikerjakan sekarang, tanpa nunggu dev lain):**

- [ ] Download dataset `drinking-waste-classification` dari Kaggle
- [ ] Pilih 1 foto terbaik untuk PET, HDPE, dan aluminium dari folder masing-masing
- [ ] Download dataset `trashnet` dari Kaggle
- [ ] Pilih 1 foto terbaik untuk kardus
- [ ] Foto sendiri kantong plastik campuran (edge case)
- [ ] Resize semua foto ke ukuran ≤ 800×800px, format JPG, ukuran ≤ 500KB (sesuai constraint Supabase dari risk mitigation)
- [ ] Simpan di folder `/public/demo-images/` dengan nama sesuai skema di atas
- [ ] Lakukan test manual: buka `wasteClassifier.test.html`, upload tiap foto, catat confidence yang keluar
- [ ] Dokumentasikan hasil confidence di tabel bawah

**Tabel hasil test manual (isi saat testing):**

| Foto | Prediksi MobileNet | Confidence | Mapped ke | Status |
|------|--------------------|------------|-----------|--------|
| demo_01_plastik_pet.jpg | | | PLSTK-PET | |
| demo_02_plastik_hdpe.jpg | | | PLSTK-HDPE | |
| demo_03_kardus.jpg | | | KRTS-KRD | |
| demo_04_kaleng_aluminium.jpg | | | LOGM-ALM | |
| demo_05_plastik_campuran.jpg | | | PLSTK-MIX (manual) | |

---

## Script Demo AI (Urutan Presentasi ke Juri)

Ini urutan yang paling impresif dan logis untuk ditunjukkan:

```
1. Buka form "Input Listing Sampah" sebagai akun Rumah Tangga (dewi.rt@daurin.id)
2. Upload demo_04_kaleng_aluminium.jpg
   → Tunjukkan AI langsung detect "Aluminium/Kaleng" dengan confidence tinggi
   → Field waste_type terisi otomatis
   "Ini contoh AI bekerja dengan confidence tinggi — sistem langsung mengisi kategori."

3. Upload demo_01_plastik_pet.jpg
   → AI detect "Plastik PET" dengan confidence tinggi
   → Submit listing → listing muncul di marketplace

4. Upload demo_05_plastik_campuran.jpg
   → AI confidence rendah → warning muncul
   → User diminta pilih manual
   "Nah, ini edge case — AI tidak memaksakan prediksi kalau tidak yakin.
    User harus konfirmasi sendiri. Ini desain yang aman dan jujur."

5. Tunjukkan listing yang sudah masuk ke marketplace
   → Pindah ke akun pengepul → filter jenis → listing muncul di peta
```

---

## Sumber Download Resmi

| Dataset | Link | Ukuran | Relevansi |
|---------|------|--------|-----------|
| Drinking Waste Classification | `kaggle.com/datasets/arkadiyhacks/drinking-waste-classification` | ~10K gambar | ⭐⭐⭐⭐⭐ Terbaik — pisah PET & HDPE |
| TrashNet | `kaggle.com/datasets/feyzazkefe/trashnet` | 2.527 gambar | ⭐⭐⭐⭐ Bagus untuk kardus, logam, kaca |
| Garbage Classification v2 | `kaggle.com/datasets/sumn2u/garbage-classification-v2` | 19.762 gambar | ⭐⭐⭐ Backup, ada kelas biological (organik) |

> Butuh akun Kaggle gratis untuk download. Kalau tidak ada akses, TrashNet juga tersedia di Google Drive via repo GitHub: `github.com/garythung/trashnet`

---

*Dev 3 — Tim Mie Ayam Solo · PLAY IT! 2026 · Daurin v1.0*
