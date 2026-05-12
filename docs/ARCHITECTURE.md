# Architecture Documentation
## AI Reel Script & Thumbnail Generator

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│                                                      │
│   Next.js App Router — React + TypeScript            │
│   Zustand (gen state) + React Query (server state)   │
│   Tailwind CSS + shadcn/ui                           │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP / fetch
┌───────────────────▼─────────────────────────────────┐
│               NEXT.JS API ROUTES                     │
│               (Server — Vercel Edge/Node)            │
│                                                      │
│   /api/generate/script      → AI Service             │
│   /api/generate/thumbnail   → AI Service             │
│   /api/scripts              → DB Service             │
│   /api/projects             → DB Service             │
└──────┬───────────────────────────────┬───────────────┘
       │                               │
       ▼                               ▼
┌──────────────┐               ┌──────────────────────┐
│  AI SERVICES │               │      SUPABASE         │
│              │               │                      │
│  Gemini      │               │  PostgreSQL DB        │
│  HuggingFace │               │  Auth (JWT)           │
│  Pollinations│               │  Storage (thumbnails) │
└──────────────┘               └──────────────────────┘
```

---

## 2. Key Strategies

### Multi-Provider Thumbnail Engine
To ensure 99.9% uptime for image generation, the system employs a tiered fallback strategy:
1. **Hugging Face (Primary)**: Uses high-quality Stable Diffusion models.
2. **Gemini (Secondary)**: Fallback to Google's multimodal models.
3. **Pollinations AI (Tertiary)**: Rapid, public fallback for guaranteed generation.

### Iterative Generation Lifecycle
Unlike standard generators that reset on every run, Scriptly AI supports **Iterative Refining**:
- Starting a generation preserves the `savedScriptId`.
- Subsequent saves/updates perform a `PATCH` to the same record.
- Users can refine topic/style without creating duplicate entries.

---

## 3. Layer Responsibilities

### Layer 1 — Client (React)
**What it does:**
- Renders UI, handles user interaction
- Manages local generation state (Zustand)
- Fetches and caches DB data (React Query)
- Handles auth session via Supabase client SDK

**What it does NOT do:**
- Never calls Gemini directly (API key stays server-side)
- Never writes directly to DB (always goes through API routes)

---

### Layer 2 — Next.js API Routes (Backend)
Acts as a lightweight backend. Each route is a separate concern:

```
/api/
├── generate/
│   ├── script/route.ts      — Orchestrates multi-step Gemini calls
│   └── thumbnail/route.ts   — Calls Gemini image gen, returns base64
├── scripts/
│   ├── route.ts             — GET (list) / POST (save)
│   └── [id]/route.ts        — GET / PATCH / DELETE
└── projects/
    ├── route.ts             — GET / POST
    └── [id]/route.ts        — PATCH / DELETE
```

Every route:
1. Validates auth (Supabase server client)
2. Validates request body (Zod schema)
3. Executes business logic
4. Returns typed JSON response

---

### Layer 3 — AI Service (`src/lib/gemini/`)
Isolated module. API routes call this — never the client.

```ts
// gemini/client.ts
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
export const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
export const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

// gemini/prompts.ts
export function buildScriptPrompt(params: GenerationParams): string { ... }
export function buildThumbnailPrompt(params: ThumbnailParams): string { ... }

// gemini/parsers.ts
export function parseScriptResponse(raw: string): GeneratedScript { ... }
```

**Multi-step generation strategy:**

Instead of one massive prompt (bad: unpredictable output, hard to parse), the system uses 4 sequential Gemini calls:

```
Call 1: Generate title + hook
   ↓ (hook passed into next prompt)
Call 2: Generate script + CTA
   ↓ (script passed into next prompt)
Call 3: Generate scene breakdown
   ↓ (topic + niche passed)
Call 4: Generate hashtags
```

Each call returns clean JSON. Parsed individually. Errors isolated per step.

---

### Layer 4 — Database Service (`src/lib/supabase/`)

```ts
// server.ts — Used in API routes
import { createServerClient } from '@supabase/ssr'

// client.ts — Used in React components
import { createBrowserClient } from '@supabase/ssr'
```

Row Level Security (RLS) enforced at DB level — users can only ever read/write their own rows. Even if an API route has a bug, the DB won't return another user's data.

---

## 4. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Only used server-side (API routes)

# Gemini
GEMINI_API_KEY=                  # Never exposed to client

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`GEMINI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only. Never prefixed with `NEXT_PUBLIC_`.

## 5. Security Architecture

| Threat | Mitigation |
|---|---|
| API key exposure | Gemini key server-only, never in client bundle |
| Unauthorized data access | Supabase RLS — enforced at DB, not just app layer |
| Unauthenticated API calls | Every API route checks `supabase.auth.getUser()` |
| Prompt injection via user input | Inputs sanitized before injected into prompt templates |
| Cross-user data access | user_id from server-side session, never from request body |
| react-hooks/set-state-in-effect | Handled by wrapping async calls in useEffect with mounting guards |

**Never trust the client for identity.** The user_id used in DB writes always comes from the server-side Supabase session, not from the request body.

```ts
// ✅ Correct
const { data: { user } } = await supabase.auth.getUser()
await db.insert({ user_id: user.id, ... })

// ❌ Never do this
const { user_id } = await req.json()
await db.insert({ user_id, ... })
```

---

## 6. State Management (Zustand)

The application uses **Zustand** for lightweight, transient state management:

- **useGenerationStore**: Manages the multi-step generation lifecycle, preserving data across steps and handling partial state updates.
- **useUsageStore**: Synchronizes real-time consumption data (scripts/thumbnails) across the dashboard and sidebar to update progress bars and enforce usage quotas.

---

## 7. Scalability Considerations

This is a v1 demo, but the architecture is designed to scale:

### Why this scales:
- **Stateless API routes** — Each request is independent. Works with Vercel's serverless/edge model. Can handle spikes without session stickiness issues.
- **Supabase connection pooling** — Supabase handles Postgres connections via PgBouncer. No connection exhaustion at scale.
- **RLS at DB level** — Security doesn't rely on application code alone. Safe even as the codebase grows.
- **Isolated AI service layer** — Swapping Gemini for another model (GPT-4o, Claude) only requires changing `src/lib/gemini/`. No changes to routes or components.
- **Prompt templates are data** — Prompts stored as template functions, not hardcoded strings. Can be moved to DB later for non-code editing.

### What would change at scale:
- Add a **job queue** (e.g. BullMQ + Redis) for thumbnail generation — move it out of the request cycle
- Add **Redis caching** for frequently accessed scripts
- Move to **Supabase Edge Functions** for AI calls to reduce cold starts
- Add **rate limiting** per user on generation endpoints

---

## 8. Deployment Architecture

```
GitHub Repo
    │
    ▼
Vercel (auto-deploy on push to main)
    │
    ├── Next.js frontend → Vercel CDN
    ├── API Routes → Vercel Serverless Functions
    │
    └── Env vars set in Vercel dashboard
            │
            ├── Supabase (managed Postgres + Auth + Storage)
            └── Gemini API (Google AI Studio)
```

**Zero infrastructure to manage.** Fully serverless. Free tier covers demo/evaluation load.

---

## 8. Tech Decision Rationale

| Decision | Why |
|---|---|
| Next.js App Router | Collocated frontend + API, no separate Express server, easier deployment |
| Supabase over Firebase | SQL > NoSQL for relational data (users → projects → scripts). RLS is more powerful than Firestore rules. |
| Zustand over Redux | Generation state is local/transient. Redux is overkill. Zustand is 1 file. |
| React Query over SWR | Better cache control, devtools, and mutation handling for CRUD operations |
| Multi-step Gemini calls over single prompt | Better output quality, isolated error handling, easier to debug and iterate per section |
| Gemini 2.0 Flash | Free tier available via Google AI Studio, fast, supports image gen in experimental mode |
| shadcn/ui | Components owned by the project (not a dependency), easy to customize for unique UI |
