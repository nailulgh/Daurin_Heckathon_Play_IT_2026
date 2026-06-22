---
trigger: always_on
---

 "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+62-xxx-xxxx-xxxx",
        "contactType": "customer service",
        "areaServed": "ID",
        "availableLanguage": "Indonesian"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com",
      "name": "Nama Website",
      "publisher": { "@id": "https://example.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://example.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
```

**Article / Blog Post:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Judul Artikel — Max 110 karakter",
  "description": "Deskripsi artikel 150-160 karakter",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/images/artikel.jpg",
    "width": 1200,
    "height": 630
  },
  "datePublished": "2025-01-15T08:00:00+07:00",
  "dateModified": "2025-06-01T10:00:00+07:00",
  "author": {
    "@type": "Person",
    "name": "Nama Penulis",
    "url": "https://example.com/author/nama-penulis"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nama Media",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/judul-artikel"
  },
  "wordCount": 1500,
  "inLanguage": "id-ID"
}
</script>
```

**BreadcrumbList:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog/" },
    { "@type": "ListItem", "position": 3, "name": "Judul Artikel" }
  ]
}
</script>
```

**FAQPage:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Apa itu SEO teknis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO teknis adalah proses optimasi infrastruktur website..."
      }
    }
  ]
}
</script>
```

### 5.3 Validasi Schema

Selalu validasi setelah implementasi:
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema Markup Validator**: https://validator.schema.org/
- Gunakan browser agent Antigravity untuk membuka URL validasi di atas secara otomatis.

---

## 6. Fase 5 — Core Web Vitals & Performa

### 6.1 Target Metrik (Ambang Batas Google 2025)

| Metrik | Baik | Perlu Perbaikan | Buruk |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4s | > 4s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |
| **TTFB** (Time to First Byte) | ≤ 800ms | 800ms–1.8s | > 1.8s |
| **FCP** (First Contentful Paint) | ≤ 1.8s | 1.8–3s | > 3s |

### 6.2 Optimasi LCP

```typescript
// Next.js — Prioritaskan gambar LCP
import Image from 'next/image'

// Hero image — HARUS priority={true}
<Image
  src="/hero-banner.webp"
  alt="Deskripsi hero"
  width={1920}
  height={1080}
  priority={true}          // Disable lazy loading, tambah preload link
  quality={85}
/>

// Preload font kritis
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeFonts: true,
  },
}
```

```html
<!-- Preload resource kritis di <head> -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
<link rel="preload" as="font" href="/fonts/inter.woff2" type="font/woff2" crossorigin="anonymous" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="//analytics.example.com" />
```

### 6.3 Menghindari CLS

```css
/* Selalu set dimensi eksplisit untuk media */
img, video, iframe {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* Atau rasio spesifik */
}

/* Font swap untuk mencegah FOIT/FOUT yang menyebabkan CLS */
@font-face {
  font-display: swap; /* atau 'optional' untuk non-critical fonts */
}

/* Hindari konten yang muncul mendadak di atas konten lain */
.banner-promo {
  min-height: 60px; /* Reserve space meski konten belum load */
}
```

### 6.4 Optimasi INP

```typescript
// Gunakan React Transitions untuk interaksi non-urgent
import { useTransition, startTransition } from 'react'

const [isPending, startTransition] = useTransition()

// Heavy state update — bungkus dengan startTransition
startTransition(() => {
  setFilteredResults(applyHeavyFilter(data))
})

// Code splitting untuk mengurangi bundle size
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
})
```

---

## 7. Fase 6 — Konten & Keyword Strategy

### 7.1 Framework Riset Keyword

```
1. SEED KEYWORDS → Brainstorm topik inti bisnis
2. EXPANSION    → Gunakan Google Suggest, "People Also Ask", "Related Searches"
3. CLUSTERING   → Kelompokkan berdasarkan intent (Informational/Commercial/Transactional/Navigational)
4. PRIORITASI   → Matrix: Volume × Difficulty × Business Value
5. MAPPING      → 1 URL = 1 Primary Keyword + 3-5 Secondary Keywords
```

### 7.2 Search Intent Matrix

| Intent | Contoh Query | Tipe Konten |
|---|---|---|
| Informational | "cara kerja SEO" | Blog, Panduan, Tutorial |
| Commercial | "tool SEO terbaik" | Comparison, Review, List |
| Transactional | "beli backlink murah" | Landing Page, Product Page |
| Navigational | "Google Search Console login" | Brand page |

### 7.3 Template Konten SEO-Optimal

```markdown
# [Keyword Utama]: [Proposi Nilai] (H1)

**TL;DR**: [Rangkuman 2-3 kalimat untuk featured snippet]

## Apa itu [Topik]? (H2 — Informational)
[Definisi jelas, 100-150 kata]

## Mengapa [Topik] Penting? (H2)
[3-5 poin dengan data/statistik]

## Cara [Melakukan Topik] Step-by-Step (H2 — How-To)
### Langkah 1: [Nama Langkah] (H3)
### Langkah 2: [Nama Langkah] (H3)

## [Topik] vs [Alternatif]: Perbandingan (H2 — Commercial)
[Tabel perbandingan]

## FAQ (H2) — Ambil dari "People Also Ask"
### [Pertanyaan 1]? (H3)
### [Pertanyaan 2]? (H3)

## Kesimpulan (H2)
[Ringkasan + CTA]
```

### 7.4 Internal Linking Strategy

```
Aturan Internal Linking:
- Setiap halaman baru harus menerima minimal 3 internal link dari halaman yang relevan
- Gunakan anchor text deskriptif (bukan "klik di sini" atau "baca lebih lanjut")
- Buat "pillar page" untuk topik utama, dukung dengan "cluster pages"
- Halaman dengan authority tinggi (banyak backlink) → link ke halaman baru penting
```

```typescript
// Contoh komponen Related Posts dengan internal linking otomatis
const RelatedPosts = ({ currentPost, allPosts }) => {
  const related = allPosts
    .filter(p => 
      p.id !== currentPost.id &&
      p.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, 3)
  
  return (
    <nav aria-label="Artikel terkait">
      {related.map(post => (
        <a href={`/blog/${post.slug}`} key={post.id}>
          {post.title} {/* Anchor text = judul artikel = keyword */}
        </a>
      ))}
    </nav>
  )
}
```

---

## 8. Fase 7 — Monitoring & Iterasi

### 8.1 Checklist Sebelum Go-Live

```markdown
### Technical SEO
- [ ] robots.txt mengizinkan Googlebot mengakses semua halaman penting
- [ ] sitemap.xml terdaftar di Google Search Console
- [ ] Tidak ada link canonical yang broken atau loop
- [ ] Semua redirect menggunakan 301 (bukan 302 kecuali memang sementara)
- [ ] HTTPS aktif, tidak ada mixed content
- [ ] Tidak ada halaman penting yang ter-noindex secara tidak sengaja

### On-Page SEO  
- [ ] Setiap halaman punya title unik (50-60 karakter)
- [ ] Setiap halaman punya meta description unik (120-160 karakter)
- [ ] Satu H1 per halaman, berisi keyword utama
- [ ] Open Graph dan Twitter Card ter-implementasi
- [ ] Gambar punya alt text yang deskriptif

### Structured Data
- [ ] Schema.org valid (tidak ada error di Rich Results Test)
- [ ] BreadcrumbList ada di semua halaman dalam (bukan homepage)
- [ ] Article schema ada di semua halaman blog/artikel

### Performa
- [ ] LCP < 2.5s (uji di PageSpeed Insights)
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Gambar dalam format WebP/AVIF
```

### 8.2 Tools Monitoring

```
Wajib:
- Google Search Console (indexing, click-through rate, errors)
- Google Analytics 4 (traffic, perilaku pengguna)
- PageSpeed Insights (Core Web Vitals per URL)

Opsional tapi sangat direkomendasikan:
- Ahrefs / Semrush (keyword tracking, backlink)
- Screaming Frog (crawl audit mendalam)
- Lighthouse CI (otomatisasi audit CWV di pipeline)
```

### 8.3 Integrasi Lighthouse CI (GitHub Actions)

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://example.com/
            https://example.com/blog/
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

# lighthouse-budget.json
[
  {
    "path": "/*",
    "timings": [
      { "metric": "largest-contentful-paint", "budget": 2500 },
      { "metric": "cumulative-layout-shift", "budget": 0.1 },
      { "metric": "total-blocking-time", "budget": 200 }
    ]
  }
]
```

---

## 9. Template & Snippets Siap Pakai

Untuk template lengkap per framework, baca file berikut sesuai kebutuhan:
- `references/frameworks.md` — Panduan implementasi per framework (Next.js, Nuxt, Laravel, WordPress)
- `references/schema-templates.md` — Koleksi lengkap template schema.org
- `references/checklist-audit.md` — Checklist audit mendalam 100+ poin

---

## 10. Referensi Tambahan

Gunakan **Browser Agent Antigravity** untuk mengakses URL berikut saat dibutuhkan:

```
Dokumentasi Resmi:
- https://developers.google.com/search/docs          (Google Search Central)
- https://schema.org/                                 (Schema.org reference)
- https://web.dev/explore/learn-core-web-vitals       (Core Web Vitals)
- https://search.google.com/test/rich-results         (Validasi rich results)
- https://pagespeed.web.dev/                          (PageSpeed Insights)
- https://search.google.com/search-console            (Google Search Console)

Izinkan domain berikut di Browser URL Allowlist:
- developers.google.com
- schema.org
- web.dev
- search.google.com
- pagespeed.web.dev
```

---

> **Catatan Orkestrasi**: Skill ini menggunakan **Mode Perencanaan (Planning)** untuk tugas audit atau implementasi besar, dan **Mode Cepat (Fast)** untuk perbaikan terisolasi seperti menambahkan meta tag atau memperbarui satu schema. Selalu buat **Artefak Implementation Plan** sebelum membuat perubahan pada `robots.txt`, canonical, atau redirect.
