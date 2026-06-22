# CLAUDE.md — Daurin × Claude Code
> Optimized for: Claude Code CLI (`claude` command), Claude in IDE extensions
> Project: Daurin Marketplace Daur Ulang | PLAY IT! 2026 | Tim Mie Ayam Solo

---

## 🎯 Claude's Role in This Project

You are the **lead full-stack engineer and technical architect** for Daurin — a 24-hour hackathon project. Your job is to generate production-quality, working code — not pseudocode, not stubs, not "you can implement this as..." comments.

**Constraints:**
- Team of 3, working in parallel — your code must be modular and non-blocking
- 24-hour deadline — every output must be directly usable, not requiring rewrites
- Judge will demo the live app — it must work end-to-end, not just look good
- Always read `AGENTS.md` first for full project context, schema, and contracts

---

## 🧠 How Claude Should Think

When asked to implement a feature, always follow this mental model:

```
1. Which DB models does this touch? → Check AGENTS.md schema
2. What's the API contract? → Check AGENTS.md API section  
3. What state transitions are involved? → Check state machines
4. What role permissions apply? → Check RBAC rules
5. Then write: Prisma query → API route → React component → done
```

**Never ask clarifying questions** unless a requirement is genuinely ambiguous and the decision would cause irreversible technical debt. In a hackathon, bias toward action.

---

## 📌 Project-Specific Conventions

### TypeScript
```typescript
// Always use these imports — they're already installed
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { NextResponse } from 'next/server'

// Standard API route pattern
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Role check
  if (session.user.role !== 'PENGEPUL') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Validate
  const body = await req.json()
  const parsed = MySchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 })
  
  // Execute
  const result = await prisma.model.create({ data: parsed.data })
  return NextResponse.json(result, { status: 201 })
}
```

### Prisma Patterns
```typescript
// Always use select to avoid over-fetching
const listing = await prisma.wasteListing.findMany({
  where: { status: 'TERSEDIA' },
  select: {
    id: true, wasteType: true, weightKg: true, pricePerKg: true,
    user: { select: { name: true, lat: true, lng: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 20
})

// Use transactions for state cascades
await prisma.$transaction([
  prisma.wasteListing.update({ where: { id }, data: { status: 'DIKLAIM' } }),
  prisma.pickupClaim.create({ data: { listingId: id, collectorId: session.user.id } })
])
```

### React Components
```typescript
// Client components that use Leaflet must be in a separate file
// and imported with dynamic() — never in a Server Component

// ✅ Correct
'use client'
import dynamic from 'next/dynamic'
const CollectorMap = dynamic(() => import('@/components/map/CollectorMap'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-green-50 animate-pulse rounded-lg" />
})

// ❌ Wrong — will crash with "window is not defined"
import { MapContainer } from 'react-leaflet'  // in a Server Component
```

### Tailwind Color Classes for Daurin
```
Primary backgrounds: bg-green-700, bg-green-600
Primary text: text-green-700, text-green-800
Accents: amber-500 (for prices/value), red-500 (danger)
Light tint: bg-green-50, bg-emerald-50
Role colors: blue-600 (RT) | green-600 (Pengepul) | orange-600 (Industri)
```

---

## 🤖 AI Classifier Implementation

When asked to implement the AI classifier, generate this exact implementation:

```typescript
// src/lib/ai/wasteClassifier.ts
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'

// Mapping MobileNet ImageNet labels → our 6 waste categories
const LABEL_MAP: Record<string, string> = {
  'plastic bag': 'PLASTIK_PET',
  'water bottle': 'PLASTIK_PET',
  'pop bottle': 'PLASTIK_PET',
  'milk can': 'PLASTIK_HDPE',
  'carton': 'KERTAS_KARDUS',
  'paper towel': 'KERTAS_KARDUS',
  'envelope': 'KERTAS_KARDUS',
  'can opener': 'LOGAM_KALENG',
  'beer bottle': 'KACA',
  'wine bottle': 'KACA',
  'laptop': 'ELEKTRONIK',
  'computer keyboard': 'ELEKTRONIK',
  'cellular telephone': 'ELEKTRONIK',
  'remote control': 'ELEKTRONIK',
}

// Default fallback mapping by top-level category
const FALLBACK_MAP: Record<string, string> = {
  'bottle': 'KACA',
  'can': 'LOGAM_KALENG',
  'bag': 'PLASTIK_PET',
  'paper': 'KERTAS_KARDUS',
  'electronic': 'ELEKTRONIK',
}

let model: mobilenet.MobileNet | null = null

export async function loadModel() {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 1.0 })
  }
}

export function isModelLoaded() {
  return model !== null
}

export async function classifyWasteImage(file: File) {
  if (!model) await loadModel()
  
  const img = await createImageElement(file)
  const predictions = await model!.classify(img, 5)
  
  // Map to our categories
  const mapped = predictions.map(p => ({
    label: p.className.toLowerCase(),
    confidence: p.probability,
    wasteClass: mapToWasteClass(p.className.toLowerCase())
  }))

  const topPrediction = mapped[0]
  
  return {
    topClass: topPrediction.wasteClass,
    confidence: topPrediction.confidence,
    allPredictions: mapped.map(m => ({ class: m.wasteClass, confidence: m.confidence })),
    needsManualReview: topPrediction.confidence < 0.5
  }
}

function mapToWasteClass(label: string): string {
  // Direct match
  for (const [key, val] of Object.entries(LABEL_MAP)) {
    if (label.includes(key)) return val
  }
  // Fallback
  for (const [key, val] of Object.entries(FALLBACK_MAP)) {
    if (label.includes(key)) return val
  }
  return 'PLASTIK_PET' // safe default
}

async function createImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = url
  })
}
```

---

## 🗺️ Route Optimizer Implementation

```typescript
// src/lib/geo/routeOptimizer.ts
import { haversineDistance } from './haversine'

export function optimizeRoute(
  startLat: number, startLng: number,
  points: Array<{ id: string; lat: number; lng: number; label: string; wasteType: string }>
) {
  const unvisited = [...points]
  const ordered = []
  let currentLat = startLat
  let currentLng = startLng
  let totalKm = 0

  while (unvisited.length > 0) {
    let nearest = unvisited[0]
    let minDist = haversineDistance(currentLat, currentLng, nearest.lat, nearest.lng)
    
    for (const point of unvisited.slice(1)) {
      const dist = haversineDistance(currentLat, currentLng, point.lat, point.lng)
      if (dist < minDist) { minDist = dist; nearest = point }
    }
    
    ordered.push({ ...nearest, distanceFromPrevKm: minDist })
    totalKm += minDist
    currentLat = nearest.lat
    currentLng = nearest.lng
    unvisited.splice(unvisited.indexOf(nearest), 1)
  }

  const fuelCostPerKm = 10000 / 40  // Rp 10.000/liter, 40km/liter
  return {
    orderedPoints: ordered,
    totalDistanceKm: Math.round(totalKm * 10) / 10,
    estimatedCostRp: Math.round(totalKm * fuelCostPerKm),
    estimatedDurationMin: Math.round((totalKm / 30) * 60)  // 30km/h avg
  }
}
```

---

## 📦 Package Installation Commands

```bash
# Core
npm install next@14 react react-dom typescript @types/node @types/react

# Auth
npm install next-auth bcryptjs @types/bcryptjs

# DB
npm install @prisma/client prisma
npx prisma init

# UI
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init

# shadcn components needed
npx shadcn-ui@latest add button card badge input label select tabs toast dialog

# AI/ML
npm install @tensorflow/tfjs @tensorflow-models/mobilenet

# Maps
npm install leaflet react-leaflet @types/leaflet

# Charts
npm install recharts

# Supabase
npm install @supabase/supabase-js

# Validation
npm install zod

# Utils
npm install clsx lucide-react date-fns
```

---

## 🔒 Auth Configuration

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) return null
        
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,   // ← critical: include role in session
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: { strategy: 'jwt' }
}
```

---

## 🎭 Negotiation State Machine

When implementing the negotiation endpoint, enforce this exact state machine:

```typescript
// src/app/api/orders/[id]/negotiate/route.ts

const VALID_TRANSITIONS: Record<string, string[]> = {
  'MENUNGGU':    ['NEGOSIASI'],       // first offer starts negotiation
  'NEGOSIASI':   ['NEGOSIASI', 'DEAL', 'DIBATALKAN'],
  'DEAL':        [],                  // terminal — no more transitions
  'DIBATALKAN':  [],                  // terminal
}

// Type → next status mapping
const TYPE_TO_STATUS: Record<string, string> = {
  'OFFER':         'NEGOSIASI',
  'COUNTER_OFFER': 'NEGOSIASI',
  'DEAL':          'DEAL',
  'CANCEL':        'DIBATALKAN',
}

// After DEAL → auto-create Transaction + mark MaterialListing as TERJUAL
// Use prisma.$transaction() for atomicity
```

---

## 🖼️ Key Page Templates

### AIPhotoClassifier Component
```typescript
// src/components/listing/AIPhotoClassifier.tsx
'use client'
// Must show:
// 1. File input (drag & drop + click)
// 2. Preview of uploaded image
// 3. Loading state: "Memuat model AI..." (first load) / "Menganalisis foto..."
// 4. Result card: top prediction + confidence bar
// 5. Warning if needsManualReview: "Hasil tidak yakin — pilih kategori manual"
// 6. onChange callback to parent form with { wasteType, confidence }
```

### CollectorMap Component  
```typescript
// src/components/map/CollectorMap.tsx
'use client'
// Must show:
// 1. MapContainer centered on collector's lat/lng
// 2. Markers for each active waste listing (color by wasteType)
// 3. Popup on marker click: listing details + "Klaim" button
// 4. Route polyline when route is optimized (blue dashed line)
// 5. Route panel: ordered stops + total km + estimated cost
// Props: listings, collectorPosition, onClaim(listingId), optimizedRoute?
```

### NegotiationThread Component
```typescript
// src/components/negotiation/NegotiationThread.tsx
// Must show:
// 1. Thread of negotiation events (chronological)
// 2. Each event: actor name, type badge, amount, message, timestamp
// 3. Current order status badge at top
// 4. Action panel (only shown to relevant party):
//    - If MENUNGGU + INDUSTRI: "Ajukan Penawaran" (OFFER)
//    - If NEGOSIASI + other party's last move: "Counter Offer" | "Terima (DEAL)" | "Batalkan"
//    - If DEAL/DIBATALKAN: show final result, no actions
```

---

## 🐛 Common Pitfalls — Claude Must Avoid

| Pitfall | Fix |
|---------|-----|
| `import { MapContainer } from 'react-leaflet'` in Server Component | Use `dynamic(() => import(...), { ssr: false })` |
| TF.js model loaded inside component render | Load once at module level or in `useEffect` on app init |
| Missing Leaflet CSS | Add `import 'leaflet/dist/leaflet.css'` in layout or map component |
| Default marker icon broken in Next.js | Override `L.Icon.Default` with custom icon URLs |
| `session.user.role` undefined in client | Ensure `callbacks.session` in authOptions extends session |
| Prisma client instantiated per-request | Use singleton in `src/lib/prisma.ts` with `global.prisma` |
| Float precision for Rp amounts | Store as `Float`; display with `toLocaleString('id-ID')` |
| Status update without checking current state | Always fetch current status before transition, use DB constraint or transaction |

---

## 🏃 Quick Start Sequence (For Claude Code CLI)

```bash
# Tell Claude Code to execute these in order:

1. "Create the full Next.js project structure as defined in AGENTS.md"
2. "Generate prisma/schema.prisma from the schema in AGENTS.md"
3. "Implement src/lib/auth.ts with NextAuth credentials provider"
4. "Implement src/lib/prisma.ts singleton"
5. "Create all API routes for /api/listings (CRUD + claim + pickup)"
6. "Implement AIPhotoClassifier component with TF.js MobileNet"
7. "Implement CollectorMap with Leaflet + OpenStreetMap"
8. "Implement negotiation state machine at /api/orders/[id]/negotiate"
9. "Create public marketplace page with 3-layer tabs"
10. "Create public dashboard with CO2 stats from /api/dashboard"
11. "Generate prisma/seed.ts with demo accounts and realistic Malang Raya coordinates"
12. "Run: npx prisma migrate dev && npx prisma db seed"
```

---

## 📊 Demo Data — Malang Area Coordinates

Use these real coordinates for seed data:

```typescript
const LOCATIONS = [
  { name: "Lowokwaru", lat: -7.9396, lng: 112.6147 },
  { name: "Klojen", lat: -7.9799, lng: 112.6248 },
  { name: "Blimbing", lat: -7.9375, lng: 112.6503 },
  { name: "Sukun", lat: -8.0100, lng: 112.5975 },
  { name: "Kedungkandang", lat: -8.0031, lng: 112.6658 },
  { name: "Singosari", lat: -7.9072, lng: 112.6667 },
  { name: "Malang Kota Center", lat: -7.9825, lng: 112.6308 },
]
```

---

*Claude.md v1.0 — Daurin | Tim Mie Ayam Solo | PLAY IT! 2026*