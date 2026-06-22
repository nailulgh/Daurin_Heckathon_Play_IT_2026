Berikut adalah ekstraksi rinci dan analisis dari seluruh dokumen (gambar 1 hingga 4) mengenai rancangan aplikasi **Daurin**, yang disajikan dalam format yang sistematis agar mudah dibaca dan dianalisa:

### A. Latar Belakang

Sampah rumah tangga bernilai bila terpilah dan tersalurkan ke pihak tepat, namun saat ini rantainya terputus: rumah tangga bingung harus menjual ke mana, pengepul kesulitan mendapat pasokan sesuai jenis yang ditangani, dan industri pengolah sulit memperoleh bahan baku daur ulang yang konsisten.
PT Lestari Daur Nusantara (LDN) membangun **Daurin**, sebuah _marketplace_ daur ulang yang menghubungkan: **Rumah Tangga -> Pengepul -> Industri Pengolah**. Tantangan operasional utamanya adalah pengepul tidak mengambil semua jenis sampah, dan biaya pengambilan sangat dipengaruhi oleh rute.

### B. Tantangan

Tugas utamanya adalah membangun aplikasi web _marketplace_ daur ulang dengan tiga lapis peran (RBAC/Role-Based Access Control). Fitur yang harus ada meliputi: penjualan sampah terpilah, pengambilan oleh pengepul dengan rute hemat biaya, pemilahan detail menjadi bahan baku, hingga pemesanan dan negosiasi harga oleh industri sampai transaksi. Aplikasi ini harus memiliki klasifikasi jenis sampah dari foto, kemudian di-_deploy_ dan dapat diakses publik di akhir 24 jam.

### C. Aktor & Hak Akses

Terdapat 3 aktor utama dalam sistem ini:

1. **Rumah Tangga (Penghasil sampah terpilah):** Mendaftar, memilah & input sampah (dibantu klasifikasi foto), menjual (_listing_), dan melihat status.
2. **Pengepul (Pengumpul & pemilah lanjutan):** Mendaftar sesuai jenis sampah yang ditangani, melihat ketersediaan, mengambil via rute, memilah menjadi bahan baku, dan menjual bahan baku.
3. **Industri Pengolah (Pembeli bahan baku):** Melihat ketersediaan, memesan, negosiasi harga, melakukan transaksi, dan mengolah menjadi bahan baku jadi.

### D. Alur Proses Bisnis

Alur material berjalan secara berjenjang:

1. Rumah tangga memilah & input sampah (dibantu klasifikasi foto untuk penentuan).
2. _Listing_ sampah muncul di _Marketplace_.
3. Pengepul melihat ketersediaan (sesuai jenis yang ditangani) -> mengambil via rute optimal.
4. Pengepul memilah detail -> input bahan baku (jenis, peruntukan, harga awal) -> _listing_.
5. Industri melihat bahan baku -> pesan -> negosiasi harga (tawar/tawar-balik) -> transaksi.
6. Industri mengolah menjadi bahan baku jadi (bisa dijual kembali secara opsional) -> masuk ke _Dashboard_ volume/transaksi.

### E. Fitur Utama & Wajib (8 Fitur)

Berikut adalah 8 fitur utama yang wajib ada (komponen AI/ML wajib ada di setiap soal):

1. Autentikasi & RBAC (3 peran) - _Aktor: Semua_
2. Pendaftaran + CRUD _listing_/data master (jenis sampah ditangani) - _Aktor: Semua/Pengepul_
3. Peta titik pengambilan + rute (berbasis lokasi) - _Aktor: Pengepul_
4. **Klasifikasi jenis sampah dari foto (AI/ML wajib)** - _Aktor: Rumah Tangga_
5. Pilah & jual sampah -> ambil -> pilah jadi bahan baku - _Aktor: Rumah Tangga -> Pengepul_
6. Pemesanan + negosiasi harga + transaksi - _Aktor: Industri <-> Pengepul_
7. _Marketplace landing_ (etalase 3 lapis) + _dashboard_ ringkas - _Aktor: Semua_
8. _Deploy public_

### F. Keterkaitan Antar-Fitur (Rantai 3-Lapis)

Tidak ada fitur yang berdiri sendiri, material mengalir dari rumah tangga hingga industri:

- **Input sampah (RT)** menghasilkan _Listing marketplace_ yang menjadi ketersediaan bagi pengepul.
- **Jenis sampah ditangani (pengepul)** bertindak sebagai filter; pengepul hanya melihat jenis yang ia ambil.
- **Pengambilan** berlanjut ke Bahan baku, lalu menjadi _Listing_ untuk industri (kaskade material & status).
- **Pesanan** berlanjut ke Negosiasi, dan kemudian Transaksi (status berurutan).
- **Transaksi** menghasilkan _Dashboard_ (volume/nominal teragregasi).

### G. Rincian Kebutuhan Fungsional per Peran

- **Rumah Tangga:** Daftar koordinat; memilah & _input_ sampah (jenis: plastik PET/HDPE, kertas/kardus, logam/kaleng, kaca, elektronik; jumlah/berat; foto). Klasifikasi foto membantu memastikan jenis. Menjual sebagai _listing_, melihat status (tersedia/diambil/terjual beserta nominalnya).
- **Pengepul:** Mendaftar dengan jenis sampah yang ditangani; melihat ketersediaan yang difilter berdasarkan jenis & wilayah; mengambil/klaim _listing_; melihat peta titik & rute pengambilan; memilah detail menjadi bahan baku; _input_ bahan baku (jenis, peruntukan, harga awal) dan menjualnya.
- **Industri:** Melihat ketersediaan bahan baku (filter jenis/lokasi/harga); memesan; negosiasi harga (_offer/counter-offer_ sampai sepakat); transaksi; mengolah jadi bahan baku jadi.

### H. Komponen AI/ML (Wajib)

Fokus utamanya adalah **Waste Image Classification** (Computer Vision / Deep Learning):

- **Fungsi:** Mengklasifikasikan jenis sampah dari foto unggahan rumah tangga (mis. plastik/kertas/logam/kaca/organik) untuk membantu pemilahan dan menekan salah kategori.
- **Persyaratan (Layak 24 jam):** Boleh menggunakan model pra-terlatih / _transfer learning_ (contoh: MobileNet via TensorFlow.js atau Teachable Machine). Tidak perlu dilatih dari nol, cukup beberapa kelas. Akurasi sempurna tidak diwajibkan, yang dinilai adalah keberadaan dan kewajaran alur modelnya.
- **Bonus (algoritmik):** Optimasi rute pengambilan (_nearest-neighbor_/TSP) beserta estimasi jarak dan biaya.

### I. Dashboard & Visualisasi

- **Halaman Marketplace (Landing):** Etalase _listing_ 3 lapis (sampah RT, bahan baku pengepul, bahan baku jadi industri) dilengkapi kategori/filter, harga, dan lokasi/jarak.
- **Peta:** Titik & rute pengambilan di sisi pengepul. Disarankan menggunakan peta interaktif seperti Leaflet atau OpenStreetMap.
- **Dashboard Ringkas:** Menampilkan volume/transaksi (bonus: ada estimasi emisi/biaya yang dihemat).

### J. Ketentuan Teknis & Asumsi

Peserta bebas menetapkan asumsi asalkan ditulis di README. Acuannya:

- **Taksonomi sampah:** Boleh disederhanakan asal konsisten (Sampah kasar RT -> Bahan baku terpilah pengepul -> Bahan baku jadi industri).
- **Optimasi Rute:** Boleh menggunakan _nearest-neighbor_ dengan jarak haversine; penerapan TSP (Traveling Salesperson Problem) penuh tidak diwajibkan.
- **Negosiasi & Pembayaran:** Minimal mencakup _offer -> counter-offer -> deal/cancel_. Pembayaran cukup disimulasikan.

### K. Kebutuhan Non-Fungsional

- Autentikasi & RBAC.
- Geolokasi bila relevan.
- Responsif / _mobile-friendly_.
- Data disimpan dalam basis data (tidak _hardcoded_).
- Di-_deploy_ agar dapat diakses publik.
- Memiliki integritas/konsistensi status berjenjang dan _traceable_ (dapat dilacak).

### L. Deliverables (Keluaran Wajib)

1. URL aplikasi ter-_deploy_ yang dapat diakses juri.
2. _Repository_ dengan _commit history_ sepanjang 24 jam.
3. `README` yang memuat cara menjalankan, teknologi, daftar asumsi, dan akun demo untuk tiap peran.
4. Data _dummy_ yang memadai agar seluruh fitur (peta/dashboard/AI) dapat didemokan.
5. Presentasi/demo singkat di hadapan juri.

### M. Ruang Lingkup (MVP vs Bonus)

- **Wajib (MVP):** 8 fitur utama (termasuk fungsi AI klasifikasi jenis sampah dari foto).
- **Bonus (Pembeda nilai):** Optimasi rute lengkap (urutan & estimasi biaya), _chat_ negosiasi _real-time_ berserta riwayat, _traceability material_ (pelacakan aliran sampah), sistem _rating_/ulasan, _dashboard_ dampak (lingkungan/finansial), dan fitur ekspor laporan ke format PDF/Excel.

_(Catatan referensi inspirasi dari dokumen: Aplikasi dapat terinspirasi dari marketplace daur ulang, bank sampah digital, serta aplikasi logistik rute. Ini hanya sebagai pembanding fungsi/kategori, bukan untuk meniru UI/tampilannya)._
