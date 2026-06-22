---
trigger: always_on
---

---
name: seo-expert
description: >
  Panduan komprehensif untuk implementasi SEO teknis, on-page, dan off-page pada proyek web berbasis apapun (Next.js, Nuxt, React, Vue, Laravel, WordPress, dsb). Gunakan skill ini setiap kali ada tugas yang berkaitan dengan: optimasi metadata HTML, structured data / schema.org, Core Web Vitals, sitemap & robots.txt, canonical URL, Open Graph / Twitter Card, audit SEO, strategi konten, internal linking, performa halaman, aksesibilitas SEO, atau ketika pengguna menyebut kata kunci seperti "SEO", "peringkat Google", "SERP", "meta tag", "schema", "sitemap", "page speed", "backlink", "keyword research", "crawlability", atau "indexability". Jangan tunggu pengguna menyebut "gunakan skill SEO" — aktifkan secara proaktif setiap kali konteks pekerjaan menyentuh visibilitas mesin pencari atau performa web dari sisi organik.
---

# SEO Expert Skill

Kamu adalah **Agentic SEO Orchestrator** — kombinasi Full-Stack Developer dan SEO Specialist senior. Tugasmu adalah mengaudit, merencanakan, dan mengimplementasikan SEO secara menyeluruh pada proyek web, dengan pendekatan berbasis data dan best practices terkini (Google Search Central, 2024–2025).

---

## Daftar Isi

1. [Prinsip Dasar Kerja](#1-prinsip-dasar-kerja)
2. [Fase 1 — Audit & Discovery](#2-fase-1--audit--discovery)
3. [Fase 2 — SEO Teknis](#3-fase-2--seo-teknis)
4. [Fase 3 — On-Page SEO](#4-fase-3--on-page-seo)
5. [Fase 4 — Structured Data & Schema](#5-fase-4--structured-data--schema)
6. [Fase 5 — Core Web Vitals & Performa](#6-fase-5--core-web-vitals--performa)
7. [Fase 6 — Konten & Keyword Strategy](#7-fase-6--konten--keyword-strategy)
8. [Fase 7 — Monitoring & Iterasi](#8-fase-7--monitoring--iterasi)
9. [Template & Snippets Siap Pakai](#9-template--snippets-siap-pakai)
10. [Referensi Tambahan](#10-referensi-tambahan)

---

## 1. Prinsip Dasar Kerja

Sebelum memulai tugas apapun, ikuti urutan ini:

```
AUDIT → PLAN (Artefak) → IMPLEMENT → VALIDATE → ITERATE
```

- **Selalu buat Implementation Plan** sebelum menyentuh kode.
- **Prioritaskan berdasarkan dampak**: Technical SEO > On-Page > Off-Page.
- **Gunakan data nyata**: cek `robots.txt`, `sitemap.xml`, dan response header sebelum membuat asumsi.
- **Jangan breaking changes tanpa konfirmasi**: redirect, canonical, dan noindex bersifat destruktif jika salah.
- **Framework-agnostic**: adaptasikan solusi ke stack yang digunakan (lihat `references/frameworks.md`).

---

## 2. Fase 1 — Audit & Discovery

### Langkah Wajib di Awal Proyek

```bash
# 1. Periksa file konfigurasi yang ada
find . -name "robots.txt" -o -name "sitemap.xml" -o -name "sitemap*.xml"
find . -name "_document.tsx" -o -name "layout.tsx" -o -name "app.html" \
       -o -name "nuxt.config.*" -o -name "next.config.*"

# 2. Cari implementasi meta tag yang sudah ada
grep -r "og:title\|twitter:card\|canonical\|noindex" --include="*.html" \
     --include="*.tsx" --include="*.vue" --include="*.php" -l .

# 3. Periksa struktur heading
grep -r "<h[1-6]" --include="*.html" --include="*.tsx" --include="*.vue" . | head -50
```

### Checklist Audit Awal

Buat laporan audit dengan struktur ini:

```markdown
## Laporan Audit SEO — [Nama Proyek]

### ✅ Sudah Ada
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] Canonical tag
- [ ] Meta title & description
- [ ] Open Graph tags
- [ ] Structured data

### ❌ Belum Ada / Bermasalah
- [Daftar temuan]

### ⚠️ Perlu Ditinjau
- [Daftar item yang butuh konfirmasi]

### Prioritas Perbaikan
1. [HIGH] ...
2. [MEDIUM] ...
3. [LOW] ...
```

---

## 3. Fase 2 — SEO Teknis

### 3.1 robots.txt

**Prinsip**: Jangan blokir resource yang dibutuhkan untuk rendering (CSS, JS).

```
# robots.txt — Template Produksi
User-agent: *
Allow: /

# Blokir halaman non-indexable
Disallow: /admin/
Disallow: /api/
Disallow: /?*           # query strings tanpa value semantik
Disallow: /search?*     # internal search results

# Khusus untuk bot tertentu
User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml
```

> ⚠️ **Peringatan**: Jangan `Disallow: /` di environment staging jika menggunakan domain yang sama. Gunakan `X-Robots-Tag: noindex` di header HTTP.

### 3.2 Sitemap XML

**Untuk proyek statis / CMS:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Untuk proyek dinamis (Next.js App Router):**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  
  // Fetch dynamic routes
  const posts = await fetchAllPosts() // replace with actual data source
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
  
  const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
  
  return [...staticRoutes, ...dynamicRoutes]
}
```

**Untuk Nuxt 3:**
```typescript
// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml')
  const pages = await $fetch('/api/pages')
  // gunakan @nuxtjs/sitemap untuk solusi otomatis
})
```

### 3.3 Canonical URL

**Aturan Canonical:**
- Setiap halaman HARUS memiliki satu canonical yang menunjuk ke dirinya sendiri (self-referencing).
- Gunakan URL absolut, bukan relatif.
- Canonical harus konsisten dengan `og:url`.

```html
<!-- Self-referencing canonical -->
<link rel="canonical" href="https://example.com/halaman-ini/" />
```

**Masalah umum yang harus dihindari:**
- Canonical ke halaman yang di-redirect
- Canonical yang berbeda antara desktop dan mobile
- Canonical dengan dan tanpa trailing slash (`/blog/post` vs `/blog/post/`) — pilih satu, konsisten

### 3.4 HTTP Headers Penting

```nginx
# nginx.conf — Header SEO-kritis
add_header X-Robots-Tag "index, follow" always;

# Untuk halaman yang tidak ingin diindex (alternatif noindex di HTML)
location /admin {
    add_header X-Robots-Tag "noindex, nofollow" always;
}

# Redirect www ke non-www (atau sebaliknya) — PILIH SATU
server {
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}
```

---

## 4. Fase 3 — On-Page SEO

### 4.1 Formula Meta Title & Description

```
Title   : [Keyword Utama] - [Proposi Nilai] | [Brand]
Length  : 50–60 karakter (max 600px rendered width)

Description : [Hook] + [Manfaat] + [CTA implisit]
Length      : 120–160 karakter
```

**Contoh baik:**
```
Title       : Jasa SEO Jakarta - Audit & Strategi Organik | Klien Anda
Description : Tingkatkan traffic organik 300% dalam 6 bulan. Audit teknis gratis, 
              strategi berbasis data, tim berpengalaman 10+ tahun.
```

### 4.2 Implementasi Meta di Berbagai Framework

**Next.js 14+ App Router:**
```typescript
// app/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await fetchPage(params.slug)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    alternates: {
      canonical: `${baseUrl}/${params.slug}`,
    },
    openGraph: {
      title: page.ogTitle || page.seoTitle,
      description: page.ogDescription || page.seoDescription,
      url: `${baseUrl}/${params.slug}`,
      siteName: 'Nama Website',
      images: [{ url: page.ogImage || `${baseUrl}/og-default.jpg`, width: 1200, height: 630 }],
      type: 'website',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.ogTitle || page.seoTitle,
      description: page.ogDescription || page.seoDescription,
      images: [page.ogImage || `${baseUrl}/og-default.jpg`],
    },
    robots: {
      index: page.noindex ? false : true,
      follow: true,
    },
  }
}
```

**Nuxt 3:**
```typescript
// pages/[slug].vue
<script setup>
const { data: page } = await useAsyncData(() => fetchPage(route.params.slug))

useSeoMeta({
  title: page.value?.seoTitle,
  description: page.value?.seoDescription,
  ogTitle: page.value?.ogTitle,
  ogDescription: page.value?.ogDescription,
  ogImage: page.value?.ogImage,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: `https://example.com/${route.params.slug}` }]
})
</script>
```

**Laravel + Blade:**
```php
// resources/views/layouts/app.blade.php
<title>{{ $seo['title'] ?? config('app.name') }}</title>
<meta name="description" content="{{ $seo['description'] ?? '' }}">
<link rel="canonical" href="{{ $seo['canonical'] ?? url()->current() }}">
<meta property="og:title" content="{{ $seo['og_title'] ?? $seo['title'] }}">
<meta property="og:description" content="{{ $seo['og_description'] ?? $seo['description'] }}">
<meta property="og:image" content="{{ $seo['og_image'] ?? asset('images/og-default.jpg') }}">
<meta property="og:url" content="{{ $seo['canonical'] ?? url()->current() }}">
<meta name="twitter:card" content="summary_large_image">
```

### 4.3 Struktur Heading

**Aturan Ketat:**
- Satu `<h1>` per halaman — berisi keyword utama.
- `<h2>` untuk topik utama, `<h3>` untuk subtopik.
- Jangan skip level (h1 → h3 tanpa h2).
- Heading harus deskriptif, bukan dekoratif.

```html
<!-- ✅ Benar -->
<h1>Panduan SEO Teknis untuk Pemula 2025</h1>
  <h2>Apa itu SEO Teknis?</h2>
  <h2>Cara Audit SEO Teknis</h2>
    <h3>Menggunakan Google Search Console</h3>
    <h3>Menggunakan Screaming Frog</h3>

<!-- ❌ Salah -->
<h1>Selamat Datang</h1>  <!-- Tidak ada keyword -->
<h3>Tentang Kami</h3>    <!-- Skip h2 -->
```

### 4.4 Optimasi Gambar

```html
<!-- Template gambar SEO-optimal -->
<img
  src="/images/panduan-seo-teknis.webp"
  alt="Diagram alur audit SEO teknis dari crawling hingga indexing"
  width="1200"
  height="630"
  loading="lazy"          <!-- "eager" untuk gambar above-the-fold -->
  decoding="async"
  fetchpriority="low"     <!-- "high" untuk LCP image -->
/>
```

**Checklist Gambar:**
- [ ] Format WebP/AVIF (fallback JPEG/PNG)
- [ ] Dimensi eksplisit (cegah layout shift / CLS)
- [ ] Alt text deskriptif dengan keyword alami
- [ ] Nama file deskriptif: `seo-audit-2025.webp` bukan `IMG_001.jpg`
- [ ] Lazy loading untuk gambar di bawah fold

---

## 5. Fase 4 — Structured Data & Schema

### 5.1 Jenis Schema Berdasarkan Tipe Halaman

| Tipe Halaman | Schema Wajib | Schema Tambahan |
|---|---|---|
| Homepage | `WebSite`, `Organization` | `SiteNavigationElement` |
| Blog/Artikel | `Article`, `BreadcrumbList` | `FAQPage`, `HowTo` |
| Produk | `Product`, `Offer` | `Review`, `AggregateRating` |
| Local Business | `LocalBusiness` | `OpeningHoursSpecification` |
| FAQ | `FAQPage` | — |
| Resep | `Recipe` | `HowToStep` |
| Event | `Event` | `Offer` |

### 5.2 Template Schema JSON-LD

**Organization + WebSite (wajib di homepage):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Nama Perusahaan",
      "url": "https://example.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png",
        "width": 200,
        "height": 60
      },
      "sameAs": [
        "https://www.instagram.com/namaakun",
        "https://www.linkedin.com/company/namaakun"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-xxx-xxxx-xxxx",
        "contactType": "customer service",
        "areaServed": "ID",
        "av