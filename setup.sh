#!/bin/bash
set -e

echo "=========================================="
echo "🚀 DAURIN DEPLOYMENT SCRIPT (ROCKY 8 VPS)"
echo "=========================================="

echo "[1/5] Menginstal dependensi dasar (Node.js, tar, unzip)..."
dnf install -y curl tar unzip
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs

echo "[2/5] Menginstal PM2 & Cloudflared..."
npm install -g pm2
if ! command -v cloudflared &> /dev/null; then
    curl -L --output cloudflared.rpm https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
    dnf localinstall -y cloudflared.rpm
fi

echo "[3/5] Mengekstrak Source Code Daurin..."
mkdir -p /var/www/daurin
mv ~/daurin.tar.gz /var/www/daurin/
cd /var/www/daurin
tar -xzf daurin.tar.gz

echo "[4/5] Install dependencies & Build Next.js..."
npm install
npx prisma generate
npm run build

echo "[5/5] Konfigurasi Server PM2..."
pm2 delete daurin || true
pm2 start npm --name daurin -- start
pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root || true

echo "=========================================="
echo "✅ APLIKASI BERHASIL DI-DEPLOY!"
echo "Langkah Terakhir: Hubungkan Cloudflare Tunnel."
echo "Jalankan perintah ini sekarang:"
echo "cloudflared tunnel login"
echo "Lalu klik link yang muncul di layar!"
echo "=========================================="
