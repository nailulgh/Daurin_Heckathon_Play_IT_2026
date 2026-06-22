\# Skrip Database PostgreSQL & Seeding Data: Jaringan Sirkular "Daurin" Kota Malang

Dokumen ini berisi struktur tabel standar (\*DDL\*) dan data awal (\*DML/Seeding\*) untuk database \*\*PostgreSQL\*\* sesuai dengan spesifikasi teknis Bab 7.5 pada PRD Daurin. Seluruh data koordinat dan entitas telah dilokalisasikan secara presisi untuk wilayah \*\*Kota Malang, Provinsi Jawa Timur\*\*.

\---

\#\# 1\. Skema Basis Data (DDL \- Data Definition Language)

Eksekusi skrip ini terlebih dahulu di dalam query editor PostgreSQL (atau migrations tool seperti Prisma/Supabase) untuk membuat tipe enum dan tabel-tabel terenkapsulasi dengan integritas referensial (\*Foreign Keys\*).

\`\`\`sql  
\-- Mengaktifkan ekstensi UUID jika diperlukan untuk primary keys ke depan  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- 1\. Pembuatan Tipe ENUM (Constraint Validasi State)  
CREATE TYPE user\_role AS ENUM ('RUMAH\_TANGGA', 'PENGEPUL', 'INDUSTRI');  
CREATE TYPE waste\_status AS ENUM ('TERSEDIA', 'DIAMBIL', 'DIPROSES');  
CREATE TYPE claim\_status AS ENUM ('TERKLAIM', 'PERJALANAN', 'SELESAI', 'BATAL');  
CREATE TYPE material\_status AS ENUM ('TERSEDIA', 'TERJUAL', 'DIKIRIM');  
CREATE TYPE order\_status AS ENUM ('PENDING', 'NEGOSIASI', 'DEAL', 'BATAL');  
CREATE TYPE neg\_type AS ENUM ('OFFER', 'COUNTER', 'DEAL', 'CANCEL');  
CREATE TYPE tx\_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

\-- 2\. Tabel Users (Aktor Ekosistem)  
CREATE TABLE users (  
    id VARCHAR(50) PRIMARY KEY,  
    name VARCHAR(150) NOT NULL,  
    email VARCHAR(150) UNIQUE NOT NULL,  
    role user\_role NOT NULL,  
    lat NUMERIC(10, 7\) NOT NULL,  
    lng NUMERIC(10, 7\) NOT NULL,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 3\. Tabel Waste Listings (Sisi Hulu \- Sampah Terpilah Rumah Tangga)  
CREATE TABLE waste\_listings (  
    id VARCHAR(50) PRIMARY KEY,  
    user\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    type VARCHAR(100) NOT NULL,  
    weight NUMERIC(6, 2\) NOT NULL, \-- dalam satuan Kg  
    photo\_url TEXT,  
    ai\_predicted\_class VARCHAR(100),  
    ai\_confidence\_score NUMERIC(4, 3), \-- rentang 0.000 hingga 1.000  
    status waste\_status DEFAULT 'TERSEDIA',  
    price NUMERIC(12, 2\) NOT NULL, \-- Estimasi nilai tukar awal  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 4\. Tabel Pickup Claims (Logistik Rute Log Pengepul)  
CREATE TABLE pickup\_claims (  
    id VARCHAR(50) PRIMARY KEY,  
    listing\_id VARCHAR(50) REFERENCES waste\_listings(id) ON DELETE CASCADE,  
    collector\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    status claim\_status DEFAULT 'TERKLAIM',  
    start\_lat NUMERIC(10, 7\) NOT NULL,  
    start\_lng NUMERIC(10, 7\) NOT NULL,  
    end\_lat NUMERIC(10, 7\) NOT NULL,  
    end\_lng NUMERIC(10, 7\) NOT NULL,  
    distance\_km NUMERIC(5, 2),  
    fuel\_cost\_idr NUMERIC(12, 2),  
    claimed\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
    picked\_at TIMESTAMP  
);

\-- 5\. Tabel Material Listings (Sisi Tengah \- Bahan Baku Massal Pengepul)  
CREATE TABLE material\_listings (  
    id VARCHAR(50) PRIMARY KEY,  
    collector\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    type VARCHAR(100) NOT NULL,  
    purpose TEXT NOT NULL, \-- Contoh: Cacahan Bening (Flake PET)  
    weight NUMERIC(8, 2\) NOT NULL, \-- Skala tonase/kilogram besar  
    price NUMERIC(12, 2\) NOT NULL, \-- Harga per kg yang dipatok pengepul  
    status material\_status DEFAULT 'TERSEDIA',  
    photo\_url TEXT,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 6\. Tabel Orders (Sisi Hilir \- Kontak Transaksi Industri)  
CREATE TABLE orders (  
    id VARCHAR(50) PRIMARY KEY,  
    buyer\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    material\_id VARCHAR(50) REFERENCES material\_listings(id) ON DELETE CASCADE,  
    volume NUMERIC(8, 2\) NOT NULL,  
    status order\_status DEFAULT 'PENDING',  
    final\_price\_per\_kg NUMERIC(12, 2),  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 7\. Tabel Negotiations (State Machine Pasar B2B Multi-Putaran)  
CREATE TABLE negotiations (  
    id VARCHAR(50) PRIMARY KEY,  
    order\_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,  
    actor\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    type neg\_type NOT NULL,  
    amount NUMERIC(12, 2\) NOT NULL,  
    message TEXT,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 8\. Tabel Transactions (Settle Finansial Akhir)  
CREATE TABLE transactions (  
    id VARCHAR(50) PRIMARY KEY,  
    order\_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,  
    amount NUMERIC(15, 2\) NOT NULL,  
    status tx\_status DEFAULT 'PENDING',  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

\-- 9\. Tabel Chat Messages (Komunikasi Real-Time Terintegrasi)  
CREATE TABLE chat\_messages (  
    id VARCHAR(50) PRIMARY KEY,  
    order\_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,  
    sender\_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,  
    message TEXT NOT NULL,  
    created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

## **2\. Injeksi Data Awal (DML \- Data Manipulation Language / Seeding)**

Skrip SQL di bawah ini mensimulasikan seluruh alur operasional Daurin (Skenario Demo 5 Menit) yang terjadi di **Kota Malang**, mulai dari klasifikasi AI oleh Rumah Tangga hingga kesepakatan harga dengan Industri Pengolah.

\-- \=========================================================================

\-- STEP 1: Pengisian Data Aktor (Users) di Area Strategis Kota Malang

\-- \=========================================================================

INSERT INTO users (id, name, email, role, lat, lng) VALUES

('usr\_rt\_001', 'Sari Rahmawati (Bu Sari)', 'sari.rahma@gmail.com', 'RUMAH\_TANGGA', \-7.9523000, 112.6144000), \-- Lowokwaru (Dekat Kampus UB)

('usr\_rt\_002', 'Pak Eko (Warga Klojen)', 'eko.klojen@gmail.com', 'RUMAH\_TANGGA', \-7.9785000, 112.6318000),  \-- Klojen (Dekat Alun-Alun)

('usr\_pg\_001', 'Budi Santoso (Pak Budi)', 'budi.pengepul@gmail.com', 'PENGEPUL', \-7.9416000, 112.6451000),   \-- Blimbing (Gudang Pengepul)

('usr\_in\_001', 'Andi Prasetyo (PT Malang Sirkular)', 'procurement@malangsirkular.co.id', 'INDUSTRI', \-8.0089000, 112.6601000); \-- Kedungkandang (Kawasan Industri)

\-- \=========================================================================

\-- STEP 2: Rumah Tangga Mengunggah Sampah Terpilih (Waste Listings)

\-- Hasil deteksi AI klasifikasi terekam dengan skor keyakinan tinggi

\-- \=========================================================================

INSERT INTO waste\_listings (id, user\_id, type, weight, photo\_url, ai\_predicted\_class, ai\_confidence\_score, status, price) VALUES

('lst\_waste\_001', 'usr\_rt\_001', 'Plastik (PET/HDPE)', 12.50, '\[https://supabase-storage.daurin.internal/waste/botol\_pet\_sari.jpg\](https://supabase-storage.daurin.internal/waste/botol\_pet\_sari.jpg)', 'Plastik (PET/HDPE)', 0.925, 'DIAMBIL', 43750.00),

('lst\_waste\_002', 'usr\_rt\_002', 'Kertas/Kardus', 25.00, '\[https://supabase-storage.daurin.internal/waste/kardus\_eko.jpg\](https://supabase-storage.daurin.internal/waste/kardus\_eko.jpg)', 'Kertas/Kardus', 0.880, 'TERSEDIA', 55000.00);

\-- \=========================================================================

\-- STEP 3: Pengepul (Pak Budi) Mengklaim dan Mengambil Sampah Bu Sari

\-- Data rute log mencatat jarak Haversine terkalibrasi sirkuit kota Malang

\-- \=========================================================================

INSERT INTO pickup\_claims (id, listing\_id, collector\_id, status, start\_lat, start\_lng, end\_lat, end\_lng, distance\_km, fuel\_cost\_idr, claimed\_at, picked\_at) VALUES

('clm\_001', 'lst\_waste\_001', 'usr\_pg\_001', 'SELESAI', \-7.9416000, 112.6451000, \-7.9523000, 112.6144000, 4.83, 1250.00, '2026-06-22 08:00:00', '2026-06-22 09:30:00');

\-- \=========================================================================

\-- STEP 4: Pengepul Mengolah & Menyediakan Bahan Baku Massal untuk Industri

\-- \=========================================================================

INSERT INTO material\_listings (id, collector\_id, type, purpose, weight, price, status, photo\_url) VALUES

('lst\_mat\_001', 'usr\_pg\_001', 'Plastik (PET/HDPE)', 'Cacahan Botol Transparan (Flake PET Premium)', 100.00, 7500.00, 'TERJUAL', '\[https://supabase-storage.daurin.internal/materials/flake\_pet\_budi.jpg\](https://supabase-storage.daurin.internal/materials/flake\_pet\_budi.jpg)');

\-- \=========================================================================

\-- STEP 5: Industri Membuat Penawaran Pembelian (Orders)

\-- \=========================================================================

INSERT INTO orders (id, buyer\_id, material\_id, volume, status, final\_price\_per\_kg) VALUES

('ord\_001', 'usr\_in\_001', 'lst\_mat\_001', 100.00, 'DEAL', 7200.00);

\-- \=========================================================================

\-- STEP 6: Riwayat Negosiasi Multi-Putaran B2B (Offer & Counter-Offer)

\-- Mengunci nilai deal final pada angka Rp 7.200 dari penawaran awal Rp 7.500

\-- \=========================================================================

INSERT INTO negotiations (id, order\_id, actor\_id, type, amount, message, created\_at) VALUES

('neg\_001', 'ord\_001', 'usr\_pg\_001', 'OFFER', 7500.00, 'Harga Flake PET kualitas super bersih, siap kirim dari Blimbing.', '2026-06-22 10:00:00'),

('neg\_002', 'ord\_001', 'usr\_in\_001', 'COUNTER', 7000.00, 'Bisa kurang Pak? Kami ambil seluruh pasokan 100 kg jika harga cocok.', '2026-06-22 10:15:00'),

('neg\_003', 'ord\_001', 'usr\_pg\_001', 'COUNTER', 7200.00, 'Tengah-tengah saja Pak di Rp 7.200/kg, net untuk biaya operasional cacah mesin.', '2026-06-22 10:20:00'),

('neg\_004', 'ord\_001', 'usr\_in\_001', 'DEAL', 7200.00, 'Baik, kami setuju di harga Rp 7.200/kg. Transaksi dikunci.', '2026-06-22 10:30:00');

\-- \=========================================================================

\-- STEP 7: Penyelesaian Finansial (Transactions) \-\> Memicu Dampak Dashboard

\-- GTV Terhitung: 100 kg x Rp 7.200 \= Rp 720.000

\-- CO2 Ter-offset otomatis di Dashboard: 100 kg x 1.75 kg CO2e \= 175 kg CO2e

\-- \=========================================================================

INSERT INTO transactions (id, order\_id, amount, status, created\_at) VALUES

('tx\_001', 'ord\_001', 720000.00, 'SUCCESS', '2026-06-22 10:35:00');

\-- \=========================================================================

\-- STEP 8: Log Obrolan Riil di Lapangan (Chat Messages)

\-- \=========================================================================

INSERT INTO chat\_messages (id, order\_id, sender\_id, message, created\_at) VALUES

('msg\_001', 'ord\_001', 'usr\_pg\_001', 'Selamat siang PT Malang Sirkular, barang ready di gudang Blimbing siap dipantau.', '2026-06-22 10:01:00'),

('msg\_002', 'ord\_001', 'usr\_in\_001', 'Siap Pak Budi, tim logistik kami siap meluncur ke Blimbing jika harga sudah klop.', '2026-06-22 10:16:00');

## **3\. Integrasi Pengujian Query untuk Dashboard Dampak Lingkungan**

Untuk membuktikan fitur **Dashboard Publik Real-Time** (Kebutuhan Fitur Bonus PRD), jalankan query agregasi berikut untuk menghitung total akumulasi dampak lingkungan di Kota Malang secara dinamis dari data transaksi yang sukses:

SELECT 

    SUM(wl.weight) AS total\_sampah\_terdaur\_ulang\_kg,

    ROUND(SUM(wl.weight \* 1.75) / 1000, 3\) AS total\_co2\_offset\_ton,

    SUM(tx.amount) AS total\_gtv\_ekonomi\_malang

FROM transactions tx

JOIN orders o ON tx.order\_id \= o.id

JOIN material\_listings ml ON o.material\_id \= ml.id

JOIN pickup\_claims pc ON pc.collector\_id \= ml.collector\_id

JOIN waste\_listings wl ON pc.listing\_id \= wl.id

WHERE tx.status \= 'SUCCESS';

