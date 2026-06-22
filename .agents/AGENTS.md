# AGENTS.md — Daurin Marketplace Daur Ulang
> Universal instruction file for AI coding agents (GitHub Copilot, Cursor, Windsurf, Codeium, etc.)
> Project: PLAY IT! 2026 Hackathon Web Application | Tim Mie Ayam Solo
> Live URL: https://devmieayam.web.id

---

## 🧠 Project Identity

**App Name:** Daurin  
**Tagline:** Marketplace Daur Ulang Terintegrasi — Rumah Tangga → Pengepul → Industri  
**Client:** PT Lestari Daur Nusantara (LDN)  
**Context:** 24-hour hackathon final. Every decision must optimize for speed, correctness, and demo-ability.  
**SDGs:** SDG 1, 9, 11, 12, 13, 17

---

## 🗂️ Tech Stack (Strict — Do Not Deviate)

```
Frontend:   Next.js 14 (App Router) + TypeScript
Styling:    Tailwind CSS + shadcn/ui
AI/ML:      TensorFlow.js + MobileNetV2 (client-side, browser inference)
Maps:       Leaflet.js + React-Leaflet + OpenStreetMap (no API key needed)
Charts:     Recharts
Backend:    Next.js API Routes (RESTful)
ORM:        Prisma ORM
Database:   PostgreSQL via Supabase
Auth:       NextAuth.js (credentials + role-based)
Storage:    Supabase Storage (waste photos)
Realtime:   Supabase Realtime (notifications, negotiation chat)
Deployment: Jagoan Hosting + Cloudflare Tunnel (cloudflared)
Domain:     devmieayam.web.id
Process:    PM2
```

---

## 📁 Folder Structure (Enforce This Layout)

```
daurin/
├── prisma/
│   ├── schema.prisma           # Single source of truth for DB schema
│   └── seed.ts                 # Demo data for all 3 roles
├── public/
│   └── models/                 # TF.js model files (model.json + shards)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── rumah-tangga/
│   │   │   │   ├── page.tsx            # RT dashboard
│   │   │   │   ├── listing/
│   │   │   │   │   ├── page.tsx        # My listings + status
│   │   │   │   │   └── new/page.tsx    # Create listing + AI photo upload
│   │   │   ├── pengepul/
│   │   │   │   ├── page.tsx            # Collector dashboard
│   │   │   │   ├── marketplace/page.tsx # Filtered waste listings
│   │   │   │   ├── peta/page.tsx       # Map + route optimization
│   │   │   │   └── bahan-baku/
│   │   │   │       ├── page.tsx        # My material listings
│   │   │   │       └── new/page.tsx    # Create material listing
│   │   │   ├── industri/
│   │   │   │   ├── page.tsx            # Industry dashboard
│   │   │   │   ├── marketplace/page.tsx # Material marketplace
│   │   │   │   ├── pesanan/page.tsx    # Orders + negotiation threads
│   │   │   │   └── transaksi/page.tsx  # Transaction history
│   │   ├── marketplace/page.tsx        # Public landing — 3-layer etalase
│   │   ├── dashboard/page.tsx          # Public impact dashboard (CO2, volume)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── listings/
│   │   │   │   ├── route.ts            # GET (marketplace), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts        # GET, PATCH, DELETE
│   │   │   │       └── claim/route.ts  # POST (collector claims listing)
│   │   │   ├── materials/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts            # POST (create order)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── negotiate/route.ts # POST (offer/counter/deal/cancel)
│   │   │   ├── upload/route.ts         # Supabase Storage upload handler
│   │   │   └── dashboard/route.ts      # Aggregated stats + CO2 calc
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Root → redirect to /marketplace
│   ├── components/
│   │   ├── ui/                         # shadcn/ui generated components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── listing/
│   │   │   ├── WasteListingCard.tsx
│   │   │   ├── WasteListingForm.tsx
│   │   │   └── AIPhotoClassifier.tsx   # TF.js MobileNet component
│   │   ├── map/
│   │   │   ├── CollectorMap.tsx        # Leaflet map wrapper
│   │   │   └── RouteOptimizer.tsx      # Nearest-neighbor algo UI
│   │   ├── marketplace/
│   │   │   ├── MarketplaceGrid.tsx
│   │   │   ├── MarketplaceFilters.tsx
│   │   │   └── ThreeLayerTabs.tsx
│   │   ├── negotiation/
│   │   │   ├── NegotiationThread.tsx
│   │   │   └── NegotiationActions.tsx  # Offer/Counter/Deal/Cancel buttons
│   │   ├── dashboard/
│   │   │   ├── ImpactStats.tsx         # CO2 offset, volume, value
│   │   │   ├── TransactionChart.tsx    # Recharts time series
│   │   │   └── PublicDashboard.tsx
│   │   └── shared/
│   │       ├── RoleGuard.tsx           # Client-side role protection
│   │       ├── StatusBadge.tsx         # Listing status pills
│   │       └── Navbar.tsx
│   ├── lib/
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   ├── supabase.ts                 # Supabase client (server + client)
│   │   ├── auth.ts                     # NextAuth config + callbacks
│   │   ├── ai/
│   │   │   └── wasteClassifier.ts      # TF.js model loader + predict()
│   │   ├── geo/
│   │   │   ├── haversine.ts            # Distance calculation
│   │   │   └── routeOptimizer.ts       # Nearest-neighbor algorithm
│   │   ├── co2.ts                      # CO2 offset calculation per waste type
│   │   └── validators.ts               # Zod schemas for API validation
│   ├── types/
│   │   └── index.ts                    # Shared TypeScript types
│   └── middleware.ts                   # NextAuth route protection
├── .env.local                          # Local env (never commit)
├── .env.example                        # Template (commit this)
├── AGENTS.md                           # This file
├── CLAUDE.md                           # Claude-specific context
├── README.md
└── package.json
```

---

## 🗃️ Database Schema (Prisma — Exact Implementation)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  RUMAH_TANGGA
  PENGEPUL
  INDUSTRI
}

enum WasteType {
  PLASTIK_PET
  PLASTIK_HDPE
  KERTAS_KARDUS
  LOGAM_KALENG
  KACA
  ELEKTRONIK
}

enum ListingStatus {
  TERSEDIA
  DIKLAIM
  DIAMBIL
  SELESAI
}

enum MaterialStatus {
  TERSEDIA
  DIPESAN
  TERJUAL
}

enum OrderStatus {
  MENUNGGU
  NEGOSIASI
  DEAL
  SELESAI
  DIBATALKAN
}

enum NegotiationType {
  OFFER
  COUNTER_OFFER
  DEAL
  CANCEL
}

model User {
  id               String      @id @default(cuid())
  name             String
  email            String      @unique
  password         String      // bcrypt hashed
  role             Role
  lat              Float?
  lng              Float?
  address          String?
  phone            String?
  wasteTypesHandled WasteType[] // for PENGEPUL only
  createdAt        DateTime    @default(now())

  wasteListing     WasteListing[]
  pickupClaims     PickupClaim[]
  materialListing  MaterialListing[]
  buyerOrders      Order[]          @relation("BuyerOrders")
  negotiations     Negotiation[]
}

model WasteListing {
  id               String        @id @default(cuid())
  user             User          @relation(fields: [userId], references: [id])
  userId           String
  wasteType        WasteType
  weightKg         Float
  pricePerKg       Float
  description      String?
  photoUrl         String?
  aiClassification String?       // AI predicted label + confidence
  status           ListingStatus @default(TERSEDIA)
  earnedAmount     Float?        // filled when SELESAI
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  pickupClaim      PickupClaim?
}

model PickupClaim {
  id          String       @id @default(cuid())
  listing     WasteListing @relation(fields: [listingId], references: [id])
  listingId   String       @unique
  collector   User         @relation(fields: [collectorId], references: [id])
  collectorId String
  status      ListingStatus @default(DIKLAIM)
  claimedAt   DateTime     @default(now())
  pickedAt    DateTime?
}

model MaterialListing {
  id          String         @id @default(cuid())
  collector   User           @relation(fields: [collectorId], references: [id])
  collectorId String
  wasteType   WasteType
  purpose     String         // e.g. "Flake PET", "Pulp Kardus"
  weightKg    Float
  pricePerKg  Float
  photoUrl    String?
  status      MaterialStatus @default(TERSEDIA)
  lat         Float?
  lng         Float?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  orders      Order[]
}

model Order {
  id          String        @id @default(cuid())
  buyer       User          @relation("BuyerOrders", fields: [buyerId], references: [id])
  buyerId     String
  material    MaterialListing @relation(fields: [materialId], references: [id])
  materialId  String
  volumeKg    Float
  status      OrderStatus   @default(MENUNGGU)
  finalPrice  Float?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  negotiations Negotiation[]
  transaction  Transaction?
}

model Negotiation {
  id        String          @id @default(cuid())
  order     Order           @relation(fields: [orderId], references: [id])
  orderId   String
  actor     User            @relation(fields: [actorId], references: [id])
  actorId   String
  type      NegotiationType
  amount    Float?
  message   String?
  createdAt DateTime        @default(now())
}

model Transaction {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String   @unique
  amount    Float
  status    String   @default("SIMULATED")
  createdAt DateTime @default(now())
}
```

---

## 🔐 Environment Variables

```bash
# .env.example — copy to .env.local and fill in values

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://devmieayam.web.id"

# App
NEXT_PUBLIC_APP_URL="https://devmieayam.web.id"
NEXT_PUBLIC_MAPBOX_TOKEN=""   # Leave empty, using OpenStreetMap
```

---

## 🤖 AI Module — Waste Image Classifier

**File:** `src/lib/ai/wasteClassifier.ts`

```typescript
// Implementation contract — agent must follow this interface exactly

export type WasteClass = 
  | 'PLASTIK_PET' | 'PLASTIK_HDPE' | 'KERTAS_KARDUS' 
  | 'LOGAM_KALENG' | 'KACA' | 'ELEKTRONIK';

export interface ClassificationResult {
  topClass: WasteClass;
  confidence: number;           // 0-1
  allPredictions: Array<{
    class: WasteClass;
    confidence: number;
  }>;
  needsManualReview: boolean;   // true if confidence < 0.5
}

// Must use MobileNetV2 via @tensorflow/tfjs + @tensorflow-models/mobilenet
// Load model once, cache in module scope (not per-call)
// Input: HTMLImageElement | File
// Output: ClassificationResult

export async function classifyWasteImage(
  input: File | HTMLImageElement
): Promise<ClassificationResult>

export async function loadModel(): Promise<void>
export function isModelLoaded(): boolean
```

**Component:** `src/components/listing/AIPhotoClassifier.tsx`
- Show loading spinner while model loads (first time ~2-3s)
- Show confidence bar per prediction
- If confidence < 50%: show "Hasil tidak yakin, pilih manual" warning
- Auto-fill the `wasteType` form field with `topClass`
- Accept `.jpg`, `.jpeg`, `.png`, `.webp` only

---

## 🗺️ Geo Module — Route Optimizer

**File:** `src/lib/geo/haversine.ts`
```typescript
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number  // returns distance in kilometers
```

**File:** `src/lib/geo/routeOptimizer.ts`
```typescript
export interface RoutePoint {
  id: string;
  lat: number;
  lng: number;
  label: string;       // listing address/description
  wasteType: string;
}

export interface OptimizedRoute {
  orderedPoints: RoutePoint[];
  totalDistanceKm: number;
  estimatedCostRp: number;    // based on 40km/liter, Rp10000/liter
  estimatedDurationMin: number; // based on 30km/h avg urban speed
}

// Nearest-neighbor greedy algorithm
// Start from collector's current position
// Iteratively pick closest unvisited claimed listing
export function optimizeRoute(
  startLat: number,
  startLng: number,
  points: RoutePoint[]
): OptimizedRoute
```

---

## 🌿 CO2 Module

**File:** `src/lib/co2.ts`
```typescript
// CO2 offset per kg by waste type (kg CO2e saved vs landfill)
export const CO2_FACTORS: Record<string, number> = {
  PLASTIK_PET:    1.75,   // EPA WARM midpoint
  PLASTIK_HDPE:   1.80,
  KERTAS_KARDUS:  0.90,
  LOGAM_KALENG:   8.75,   // Aluminum recycling
  KACA:           0.40,
  ELEKTRONIK:     20.0,   // StEP Initiative estimate
};

export function calculateCO2Offset(wasteType: string, weightKg: number): number
export function formatCO2(kg: number): string  // e.g. "1.75 kg" or "1.2 ton"
```

---

## 🔗 API Contract (All Endpoints)

### Auth
```
POST /api/auth/register    body: { name, email, password, role, lat?, lng?, wasteTypesHandled? }
POST /api/auth/[...nextauth]  NextAuth handlers
```

### Waste Listings (Rumah Tangga → Pengepul)
```
GET  /api/listings          ?wasteType=&status=&lat=&lng=&radius=
POST /api/listings          body: { wasteType, weightKg, pricePerKg, description, photoUrl, aiClassification }
GET  /api/listings/[id]
PATCH /api/listings/[id]    body: partial listing fields
DELETE /api/listings/[id]   (only by owner, only if TERSEDIA)
POST /api/listings/[id]/claim  (collector claims listing → status: DIKLAIM)
PATCH /api/listings/[id]/pickup  (collector marks picked up → status: DIAMBIL)
```

### Material Listings (Pengepul → Industri)
```
GET  /api/materials         ?wasteType=&status=&lat=&lng=&minPrice=&maxPrice=
POST /api/materials         body: { wasteType, purpose, weightKg, pricePerKg, photoUrl, lat?, lng? }
GET  /api/materials/[id]
PATCH /api/materials/[id]
DELETE /api/materials/[id]  (only if TERSEDIA)
```

### Orders & Negotiation (Industri ↔ Pengepul)
```
GET  /api/orders            ?status= (filtered by user role)
POST /api/orders            body: { materialId, volumeKg }
GET  /api/orders/[id]
POST /api/orders/[id]/negotiate  
     body: { type: 'OFFER'|'COUNTER_OFFER'|'DEAL'|'CANCEL', amount?, message? }
     State machine: MENUNGGU→NEGOSIASI (first offer), NEGOSIASI→DEAL, any→DIBATALKAN
```

### Upload
```
POST /api/upload            multipart/form-data: file
     Returns: { url: string }  (Supabase Storage public URL)
```

### Dashboard
```
GET  /api/dashboard         Returns aggregated public stats:
     { totalListings, totalTransactions, totalWeightKg, totalValueRp, co2OffsetKg, byWasteType[] }
```

---

## ⚙️ State Machines (Must Enforce in API Layer)

### WasteListing Status
```
TERSEDIA → DIKLAIM   (via POST /api/listings/[id]/claim — only PENGEPUL)
DIKLAIM  → DIAMBIL   (via PATCH — only the claiming collector)
DIAMBIL  → SELESAI   (auto when related MaterialListing gets TERJUAL transaction)
```

### Order Status
```
MENUNGGU → NEGOSIASI    (first OFFER submitted by INDUSTRI)
NEGOSIASI → DEAL        (either party sends DEAL type)
NEGOSIASI → DIBATALKAN  (either party sends CANCEL)
DEAL → SELESAI          (transaction created — auto)
```

### MaterialListing Status
```
TERSEDIA → DIPESAN  (when Order created)
DIPESAN  → TERJUAL  (when Order reaches SELESAI)
DIPESAN  → TERSEDIA (if Order DIBATALKAN)
```

---

## 🎨 UI/UX Conventions

- **Color palette:**
  - Primary: `#2D7D46` (green — sustainability)
  - Secondary: `#F59E0B` (amber — energy/value)
  - Danger: `#EF4444`
  - Background: `#F0F7F2` (light green tint)
- **Role-based accent colors:**
  - Rumah Tangga: `blue-600`
  - Pengepul: `green-600`
  - Industri: `orange-600`
- **Waste type badge colors:**
  - Plastik: `sky-500` | Kertas: `yellow-500` | Logam: `gray-500`
  - Kaca: `teal-500` | Elektronik: `purple-500`
- **Mobile-first:** All layouts must work at 375px width minimum
- **Loading states:** Every async action must show a loading indicator
- **Error states:** Every form must show field-level validation errors (Zod)
- **Status badges:** Use `<StatusBadge>` component — never raw text for status
- **Toast notifications:** Use shadcn/ui `useToast` for success/error feedback

---

## 🌱 Seed Data Requirements

`prisma/seed.ts` must create:

| Role | Accounts | Data |
|------|----------|------|
| Rumah Tangga | 3 users | 5 waste listings each (mix of statuses) |
| Pengepul | 2 users | Different wasteTypesHandled; 3 claimed listings; 4 material listings |
| Industri | 2 users | 2 active orders with negotiation history |

Demo accounts (for juri):
```
rt@daurin.id       / demo123  (Rumah Tangga)
pengepul@daurin.id / demo123  (Pengepul)
industri@daurin.id / demo123  (Industri)
```

All seed coordinates must be within Malang Raya area:
- Center: `-7.9825, 112.6308` (Kota Malang)
- Radius: ~15km

---

## 🚀 Deployment Checklist (Jam 20–22)

```bash
# 1. Build
npm run build

# 2. Start with PM2
pm2 start npm --name daurin -- start
pm2 save && pm2 startup

# 3. Setup Cloudflare Tunnel
cloudflared tunnel login
cloudflared tunnel create daurin
# Edit ~/.cloudflared/config.yml:
# tunnel: <UUID>
# credentials-file: /root/.cloudflared/<UUID>.json
# ingress:
#   - hostname: devmieayam.web.id
#     service: http://localhost:3000
#   - service: http_status:404

# 4. Add DNS in Cloudflare Dashboard
# Type: CNAME | Name: devmieayam | Target: <UUID>.cfargotunnel.com | Proxied: ON

# 5. Start tunnel via PM2
pm2 start cloudflared -- tunnel run daurin
pm2 save

# 6. Verify
curl -I https://devmieayam.web.id
# Expected: HTTP 200, server: cloudflare
```

---

## ⚡ Agent Execution Rules

1. **Always read this file first** before generating any code
2. **Never deviate from the tech stack** — no Express, no Vite, no Vue, no MongoDB
3. **TypeScript strict mode** — no `any` types unless absolutely necessary
4. **Prisma is the only DB access layer** — never write raw SQL unless via `prisma.$queryRaw`
5. **API routes must validate input** with Zod before touching the database
6. **State machine transitions must be atomic** — use Prisma transactions where status changes cascade
7. **Map component must be dynamically imported** (Leaflet breaks SSR)
   ```typescript
   const CollectorMap = dynamic(() => import('@/components/map/CollectorMap'), { ssr: false })
   ```
8. **AI model loads once** — use module-level cache, never reload per request
9. **All monetary values in IDR (Rupiah)** — store as `Float` in DB (no currency conversion)
10. **Photo uploads go to Supabase Storage** — never store base64 in database
11. **Every API endpoint must check session role** before executing business logic
12. **Seed data must be idempotent** — `prisma/seed.ts` safe to run multiple times

---

## 📋 Feature Priority Queue (Execute in This Order)

```
P0 — Must complete before hour 18:
  [ ] Auth (register/login/RBAC/middleware)
  [ ] WasteListing CRUD + photo upload
  [ ] AI photo classifier (TF.js + MobileNet)
  [ ] Marketplace listing (3-layer tabs + filters)
  [ ] Collector map (Leaflet + markers)
  [ ] PickupClaim flow (claim → diambil status cascade)
  [ ] MaterialListing CRUD (pengepul input hasil pilahan)
  [ ] Order creation + negotiation state machine
  [ ] Dashboard (CO2 stats + volume)
  [ ] Seed data + demo accounts

P1 — Complete hours 18–20:
  [ ] Route optimizer (nearest-neighbor + haversine)
  [ ] Supabase Realtime notifications
  [ ] Mobile responsiveness audit
  [ ] Error boundary + loading states

P2 — Bonus if time allows:
  [ ] Real-time negotiation chat
  [ ] Material traceability tracker
  [ ] Rating system
  [ ] PDF/Excel export
  [ ] CO2 chart time series
```

---

## 🧪 Test Scenarios for Demo

1. **AI Classification:** Upload photo of plastic bottle → expect `PLASTIK_PET` ≥60% confidence
2. **Claim flow:** RT lists waste → Pengepul sees it on map → Pengepul claims → RT sees status change
3. **Route optimize:** Pengepul with 3 claimed listings → click "Optimalkan Rute" → sees ordered stops + km
4. **Negotiation:** Industri orders material → offers price → Pengepul counters → Industri accepts (DEAL)
5. **CO2 dashboard:** After transaction, public dashboard shows increased CO2 offset value

---

*Last updated: PLAY IT! 2026 Final — Tim Mie Ayam Solo*