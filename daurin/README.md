# Daurin — Marketplace Daur Ulang Terintegrasi

Proyek Daurin (Tim Mie Ayam Solo) dibangun untuk PLAY IT! 2026. Aplikasi ini memfasilitasi transaksi sampah daur ulang dari Rumah Tangga ➔ Pengepul ➔ Industri Pengolahan, lengkap dengan fitur klasifikasi AI (TensorFlow.js) dan algoritma rute Geospatial.

## 🚀 Cara Deployment (Sesuai Aturan Juri/Hackathon)

Berbeda dengan proyek Next.js biasa yang di-deploy ke Vercel, **Daurin wajib di-deploy di VPS (Jagoan Hosting)** lalu di-*tunneling* menggunakan **Cloudflare Tunnel** agar bisa diakses secara publik di `https://greenshift.web.id`.

### Langkah 1: Persiapan Server & Build
Pastikan Anda sudah berada di dalam VPS Jagoan Hosting Anda.

```bash
# 1. Install dependensi
npm install

# 2. Pastikan file .env sudah disesuaikan dengan koneksi database produksi
# NEXTAUTH_URL=https://greenshift.web.id
# NEXT_PUBLIC_APP_URL=https://greenshift.web.id

# 3. Lakukan build aplikasi
npm run build
```

### Langkah 2: Menjalankan Server dengan PM2
Agar aplikasi berjalan nonstop di background (daemon) VPS:

```bash
# Instalasi PM2 secara global (jika belum ada)
npm install -g pm2

# Menjalankan aplikasi
pm2 start npm --name daurin -- start
pm2 save
pm2 startup
```

### Langkah 3: Setup Cloudflare Tunnel (cloudflared)
Mengekspos port 3000 lokal ke domain publik `greenshift.web.id`.

```bash
# 1. Login ke akun Cloudflare Anda
cloudflared tunnel login

# 2. Buat tunnel khusus
cloudflared tunnel create daurin

# 3. Edit konfigurasi di ~/.cloudflared/config.yml:
# ---------------------------------------------
# tunnel: <UUID_DARI_LANGKAH_SEBELUMNYA>
# credentials-file: /root/.cloudflared/<UUID>.json
# ingress:
#   - hostname: greenshift.web.id
#     service: http://localhost:3000
#   - service: http_status:404
# ---------------------------------------------

# 4. Arahkan DNS di Dashboard Cloudflare
# Buka Cloudflare > DNS > Tambahkan CNAME:
# Name: greenshift
# Target: <UUID>.cfargotunnel.com
# Proxied: ON

# 5. Jalankan tunnel dan pasangkan ke PM2 agar terus berjalan
pm2 start cloudflared --name tunnel -- tunnel run daurin
pm2 save
```

### Langkah 4: Verifikasi
Aplikasi seharusnya sudah dapat diakses oleh juri secara *live*.
```bash
curl -I https://greenshift.web.id
```
*(Status kembalian harus HTTP 200)*

---
*Daurin v1.0 — Tim Mie Ayam Solo (Hackathon 2026)*
