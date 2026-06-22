# GEMINI.md — Daurin × Gemini CLI
> Optimized for: Gemini CLI (`gemini` command), Google AI Studio, Gemini in IDEs
> Project: Daurin Marketplace Daur Ulang | PLAY IT! 2026 | Tim Mie Ayam Solo
> Reference: Always read AGENTS.md first for complete project context

---

## 🎯 Gemini's Role in This Project

You are a **senior full-stack engineer** working on Daurin, a 24-hour hackathon web application. Your outputs must be complete, working, copy-paste-ready code. This is not a learning exercise — it's a competition with a hard deadline.

**Behavior Contract:**
- Generate complete files, not snippets with "// ... rest of implementation"
- Prioritize correctness over cleverness
- When in doubt about a design decision, choose the simpler approach that works
- Read `AGENTS.md` before every code generation task

---

## 🌐 Project Context Summary

**App:** Daurin — 3-tier waste recycling marketplace  
**Stack:** Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL (Supabase) + NextAuth  
**AI:** TensorFlow.js + MobileNetV2 (browser-side, no backend AI server)  
**Maps:** Leaflet.js + OpenStreetMap (no API key)  
**Deploy:** Jagoan Hosting + Cloudflare Tunnel → `https://devmieayam.web.id`  
**Deadline:** 24 hours

**Three user roles:**
| Role | Bahasa | What they do |
|------|--------|--------------|
| `RUMAH_TANGGA` | Household | Upload & sell sorted waste |
| `PENGEPUL` | Collector | Claim waste, optimize pickup routes, sell processed materials |
| `INDUSTRI` | Industry | Buy processed materials, negotiate prices |

---

## 🔑 Key Files You Will Work With

```
AGENTS.md          ← Full schema, API contracts, state machines (READ FIRST)
CLAUDE.md          ← Implementation patterns and quick-start sequence
GEMINI.md          ← This file

prisma/schema.prisma       ← DB schema (ground truth)
src/lib/auth.ts            ← NextAuth config
src/lib/prisma.ts          ← Prisma singleton
src/lib/ai/wasteClassifier.ts   ← TF.js MobileNet wrapper
src/lib/geo/routeOptimizer.ts   ← Nearest-neighbor algorithm
src/lib/co2.ts             ← CO2 offset calculations
```

---

## ⚡ Gemini-Optimized Task Prompts

Use these prompt patterns when invoking Gemini CLI for Daurin tasks:

### Setup Tasks
```bash
gemini "Read AGENTS.md and GEMINI.md. Then scaffold the complete Next.js 14 
project with App Router, TypeScript, Tailwind CSS, and shadcn/ui configured. 
Include tsconfig.json, tailwind.config.ts, next.config.js, and the full 
folder structure from AGENTS.md."

gemini "Read AGENTS.md schema section. Generate the complete prisma/schema.prisma 
file with all models, enums, and relations as specified."
```

### Feature Tasks
```bash
gemini "Read AGENTS.md API section. Implement the complete 
src/app/api/listings/route.ts with GET (marketplace query with filters) 
and POST (create listing). Include Zod validation, session check, role guard."

gemini "Read AGENTS.md and CLAUDE.md. Implement the complete 
AIPhotoClassifier React component using TF.js + MobileNet. 
Must handle: file upload, image preview, model loading state, 
prediction display with confidence bars, manual fallback."

gemini "Implement the CollectorMap component using Leaflet + React-Leaflet. 
Dynamic import (ssr: false). Show waste listing markers by type color. 
Popup with claim button. Route polyline overlay. Props from AGENTS.md."
```

### Integration Tasks
```bash
gemini "Implement the negotiation state machine API at 
src/app/api/orders/[id]/negotiate/route.ts. Use the state machine 
from AGENTS.md. Use Prisma transactions for DEAL to auto-create 
Transaction and update MaterialListing to TERJUAL."

gemini "Generate prisma/seed.ts with demo accounts, 
realistic waste listings, claims, material listings, and orders 
with negotiation history. Use Malang Raya coordinates from CLAUDE.md."
```

---

## 🏗️ Architecture Reminders for Gemini

### App Router Patterns (Next.js 14)

```typescript
// Server Component (default) — use for data fetching
// src/app/marketplace/page.tsx
import { prisma } from '@/lib/prisma'

export default async function MarketplacePage() {
  const listings = await prisma.wasteListing.findMany({
    where: { status: 'TERSEDIA' },
    include: { user: { select: { name: true, lat: true, lng: true } } }
  })
  return <MarketplaceGrid listings={listings} />
}

// Client Component — use for interactivity/hooks
// src/components/listing/WasteListingCard.tsx
'use client'
import { useState } from 'react'
```

### API Route Pattern
```typescript
// src/app/api/[resource]/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const CreateSchema = z.object({
  wasteType: z.enum(['PLASTIK_PET','PLASTIK_HDPE','KERTAS_KARDUS','LOGAM_KALENG','KACA','ELEKTRONIK']),
  weightKg: z.number().positive(),
  pricePerKg: z.number().positive(),
  description: z.string().optional(),
  photoUrl: z.string().url().optional(),
  aiClassification: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'RUMAH_TANGGA') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  const body = await req.json()
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  
  const listing = await prisma.wasteListing.create({
    data: { ...parsed.data, userId: session.user.id }
  })
  
  return NextResponse.json(listing, { status: 201 })
}
```

---

## 🗺️ Leaflet Setup (Critical for Gemini to get right)

```typescript
// src/components/map/CollectorMap.tsx
'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// CRITICAL: Fix default icon issue in Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

// Waste type → marker color
const WASTE_COLORS: Record<string, string> = {
  PLASTIK_PET:    '#38BDF8',  // sky
  PLASTIK_HDPE:   '#34D399',  // emerald
  KERTAS_KARDUS:  '#FCD34D',  // yellow
  LOGAM_KALENG:   '#94A3B8',  // gray
  KACA:           '#2DD4BF',  // teal
  ELEKTRONIK:     '#A78BFA',  // purple
}
```

---

## 🤖 TensorFlow.js — Gemini Implementation Notes

**Critical:** TF.js + MobileNet must run in browser only. Never import in Server Components or API routes.

```typescript
// Package versions that work together:
// @tensorflow/tfjs: ^4.x
// @tensorflow-models/mobilenet: ^2.x

// Installation:
// npm install @tensorflow/tfjs @tensorflow-models/mobilenet

// The model download (~17MB) happens on first use
// Always show loading state to user

// next.config.js — needed to prevent TF.js build issues:
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tensorflow/tfjs$': '@tensorflow/tfjs',
    }
    return config
  },
  // Exclude tfjs from server bundle
  experimental: {
    serverComponentsExternalPackages: ['@tensorflow/tfjs', '@tensorflow-models/mobilenet']
  }
}
module.exports = nextConfig
```

---

## 🧮 CO2 Offset Display

```typescript
// Always display CO2 impact prominently in the UI
// src/lib/co2.ts

export const CO2_FACTORS: Record<string, number> = {
  PLASTIK_PET: 1.75, PLASTIK_HDPE: 1.80,
  KERTAS_KARDUS: 0.90, LOGAM_KALENG: 8.75,
  KACA: 0.40, ELEKTRONIK: 20.0,
}

export const WASTE_LABELS: Record<string, string> = {
  PLASTIK_PET: 'Plastik PET', PLASTIK_HDPE: 'Plastik HDPE',
  KERTAS_KARDUS: 'Kertas/Kardus', LOGAM_KALENG: 'Logam/Kaleng',
  KACA: 'Kaca', ELEKTRONIK: 'Elektronik',
}

export function calculateCO2Offset(wasteType: string, weightKg: number): number {
  return (CO2_FACTORS[wasteType] ?? 1.0) * weightKg
}

export function formatCO2(kgCO2: number): string {
  if (kgCO2 >= 1000) return `${(kgCO2 / 1000).toFixed(2)} ton CO₂e`
  return `${kgCO2.toFixed(1)} kg CO₂e`
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(amount)
}
```

---

## 📱 Responsive Design Rules

Gemini must generate mobile-first layouts. Minimum supported: 375px (iPhone SE).

```typescript
// Grid patterns:
// Marketplace cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
// Dashboard stats: grid-cols-2 md:grid-cols-4
// Map + panel: flex-col md:flex-row
// Form layout: always single column on mobile

// Navigation: use hamburger menu on mobile
// Tables: horizontal scroll on mobile (overflow-x-auto)
// Negotiation thread: full-width, chat-bubble style
```

---

## 🔔 Supabase Realtime (Bonus Feature)

```typescript
// src/lib/supabase.ts — client for browser
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Usage in component for real-time notifications:
const supabase = createClientComponentClient()

useEffect(() => {
  const channel = supabase
    .channel('listing-updates')
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'WasteListing', 
        filter: `userId=eq.${session.user.id}` },
      (payload) => {
        // Update local state when listing status changes
        toast({ title: 'Status sampah diperbarui!', description: payload.new.status })
      }
    )
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [])
```

---

## 🚀 Deployment Context

The app runs on Jagoan Hosting (Linux server), tunneled via Cloudflare to `devmieayam.web.id`.

```bash
# Production environment variables that Gemini should reference:
NEXTAUTH_URL=https://devmieayam.web.id
NEXT_PUBLIC_APP_URL=https://devmieayam.web.id

# PM2 ecosystem file for Gemini to generate:
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'daurin',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: { NODE_ENV: 'production', PORT: 3000 },
    watch: false,
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }, {
    name: 'cloudflared',
    script: 'cloudflared',
    args: 'tunnel run daurin',
    watch: false,
  }]
}
```

---

## 📋 Gemini Task Queue (Ordered by Priority)

Ask Gemini to complete these in sequence, one at a time:

```
Task 1:  Scaffold Next.js 14 project + folder structure from AGENTS.md
Task 2:  Generate prisma/schema.prisma (all models from AGENTS.md)
Task 3:  Generate .env.example + src/lib/prisma.ts + src/lib/auth.ts
Task 4:  Generate src/middleware.ts (route protection by role)
Task 5:  Generate /api/auth/register route + RegisterForm component
Task 6:  Generate LoginForm + /api/auth/[...nextauth]/ route
Task 7:  Generate /api/listings CRUD (GET, POST) + /api/listings/[id] (GET, PATCH, DELETE, claim)
Task 8:  Generate /api/upload route (Supabase Storage)
Task 9:  Generate WasteListingForm + AIPhotoClassifier component (TF.js)
Task 10: Generate /api/materials CRUD
Task 11: Generate MaterialListingForm component
Task 12: Generate CollectorMap (Leaflet + OpenStreetMap, dynamic import)
Task 13: Generate routeOptimizer.ts + haversine.ts
Task 14: Generate /api/orders route (POST create order)
Task 15: Generate /api/orders/[id]/negotiate (state machine)
Task 16: Generate NegotiationThread component
Task 17: Generate /api/dashboard aggregation route + co2.ts
Task 18: Generate public marketplace page (3-layer tabs)
Task 19: Generate public impact dashboard page
Task 20: Generate all role-specific dashboard pages
Task 21: Generate prisma/seed.ts with Malang Raya data
Task 22: Generate README.md + ecosystem.config.js
```

---

## ✅ Output Quality Checklist

Before accepting any Gemini output, verify:

- [ ] Complete file — no `// TODO`, no `// implement this`, no stubs
- [ ] TypeScript — no implicit `any`, types imported from `@/types`
- [ ] Server Components don't import Leaflet/TF.js directly
- [ ] API routes check session and role before business logic
- [ ] Prisma operations use `select` to avoid over-fetching
- [ ] Status transitions use `prisma.$transaction()` where cascade needed
- [ ] Forms use controlled inputs with Zod validation
- [ ] Loading and error states present in every async component
- [ ] Mobile-responsive (works at 375px)
- [ ] Uses project color palette (green-700 primary, amber-500 accent)

---

*GEMINI.md v1.0 — Daurin | Tim Mie Ayam Solo | PLAY IT! 2026*