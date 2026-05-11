# Data Flow Documentation
## AI Reel Script & Thumbnail Generator

---

## 1. Database Schema (Supabase / PostgreSQL)

### Table: `users`
Managed entirely by Supabase Auth. Extended via `profiles` table.

```sql
-- Auto-created by Supabase Auth
auth.users (id, email, created_at, ...)
```

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```
Auto-populated via Supabase Auth trigger on user signup.

---

### Table: `projects`
```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS Policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);
```

---

### Table: `scripts`
```sql
CREATE TABLE scripts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,

  -- Generation inputs (stored for regeneration)
  topic           TEXT NOT NULL,
  niche           TEXT NOT NULL,
  platform        TEXT NOT NULL,         -- 'instagram' | 'youtube_shorts' | 'tiktok'
  content_style   TEXT NOT NULL,         -- 'educational' | 'entertaining' | 'motivational' | 'controversial'
  duration        TEXT NOT NULL,         -- '15s' | '30s' | '60s'

  -- AI generated outputs
  title           TEXT,
  hook            TEXT,
  script          TEXT,
  scene_breakdown JSONB,                 -- array of scene objects
  cta             TEXT,
  hashtags        TEXT[],                -- postgres array

  -- Thumbnail
  thumbnail_url   TEXT,                  -- Supabase Storage URL

  -- Prompt tracking (for debugging/iterating)
  prompt_used     JSONB,                 -- stored prompt templates used

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS Policy
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own scripts"
  ON scripts FOR ALL
  USING (auth.uid() = user_id);
```

---

### JSONB Shape: `scene_breakdown`
```json
[
  {
    "scene": 1,
    "duration": "0-5s",
    "visual": "Close-up of phone screen showing notifications",
    "audio": "Hook voiceover",
    "text_overlay": "You're about to lose your job..."
  },
  {
    "scene": 2,
    "duration": "5-15s",
    "visual": "Split screen: AI robot vs human at desk",
    "audio": "Main script begins",
    "text_overlay": "Here's what AI can already do"
  }
]
```

---

### Supabase Storage Bucket: `thumbnails`
```
bucket: thumbnails (public)
path:   {user_id}/{script_id}.png
```

---

## 2. API Routes & Data Contract

### `POST /api/generate/script`

**Request:**
```json
{
  "topic": "How AI is replacing jobs",
  "niche": "tech",
  "platform": "instagram",
  "style": "educational",
  "duration": "60s",
  "additionalInstructions": "Use an authoritative tone and end with a strong CTA for comments."
}
```

**Response:**
```json
{
  "title": "AI Is Coming For Your Job (Here's What You Need To Know)",
  "hook": "In 3 years, 40% of entry-level jobs will be done by AI. Here's which ones are first.",
  "script": "Let's talk about the elephant in the room...",
  "scene_breakdown": [ ...scene objects ],
  "cta": "Follow for more tech breakdowns that actually matter.",
  "hashtags": ["#AI", "#ArtificialIntelligence", "#FutureOfWork", ...]
}
```

**Error:**
```json
{ "error": "Generation failed", "details": "Gemini API quota exceeded" }
```

---

### `POST /api/generate/thumbnail`

**Request:**
```json
{
  "title": "AI Is Coming For Your Job",
  "hook": "In 3 years, 40% of entry-level jobs...",
  "niche": "tech",
  "platform": "instagram"
}
```

**Response:**
```json
{
  "imageBase64": "data:image/png;base64,iVBORw...",
  "storagePath": null   // null until user saves script
}
```

---

### `POST /api/scripts` — Save Script

**Request:**
```json
{
  "project_id": "uuid",
  "topic": "...",
  "niche": "tech",
  "platform": "instagram",
  "style": "educational",
  "duration": "60s",
  "title": "...",
  "hook": "...",
  "script": "...",
  "scene_breakdown": [...],
  "cta": "...",
  "hashtags": [...],
  "thumbnail_base64": "data:image/png;base64,..."  // optional
}
```

Server uploads thumbnail to Supabase Storage, stores URL in DB.

**Response:** Full saved script object with `id`.

---

### `PATCH /api/scripts/[id]` — Update Script

**Request:** Partial script object (any editable fields).

```json
{
  "hook": "Updated hook text",
  "hashtags": ["#NewTag1", "#NewTag2"]
}
```

**Response:** Updated script object.

---

### `GET /api/scripts` — Fetch All Scripts

**Query params:** `?project_id=uuid&platform=instagram&niche=tech&search=AI`

**Response:**
```json
{
  "scripts": [ ...script objects ],
  "total": 24
}
```

---

## 3. Gemini Prompt Strategy

All prompts live in `src/lib/gemini/prompts.ts`.

### 3.1 Professional Ad-Grade Prompting
- Prompts now use a **Creative Brief** block with:
  - topic
  - niche
  - platform
  - style
  - duration
  - `additionalInstructions`
- Title/Hook prompt is tuned for high-retention opening.
- Full script prompt uses a direct-response structure:
  1. Hook
  2. Problem/tension
  3. Value delivery
  4. Mini payoff
  5. Conversion CTA
- Scene prompt enforces shootable visuals and concise overlays.
- Hashtag prompt enforces relevance + no duplicates.
- Thumbnail prompt enforces premium, scroll-stopping ad creative direction.

### 3.2 Output Safety and Parsing
- All text-generation steps request `application/json`.
- API extracts and parses JSON defensively (handles fenced/non-fenced model output).
- Responses are validated with Zod parsers before streaming to the client.

---

## 4. Full Data Flow Diagrams

### 4.1 Script Generation Flow

```
User (Browser)
│
├─ Fills GenerationForm
│   └─ topic, niche, platform, style, duration, additionalInstructions
│
├─ Clicks "Generate Script"
│   └─ UI enters generating state
│
├─ POST /api/generate/script
│   │
│   └─ API Route (Next.js server)
│       ├─ Validates request body (Zod)
│       ├─ Checks Supabase session (auth guard)
│       │
│       ├─ Step 1: Gemini call → title + hook
│       │   └─ parse + validate JSON
│       ├─ Step 2: Gemini call → script + CTA
│       │   └─ uses hook from Step 1 in prompt
│       ├─ Step 3: Gemini call → scene breakdown
│       │   └─ uses script from Step 2 in prompt
│       ├─ Step 4: Gemini call → hashtags
│       │
│       └─ Streams NDJSON chunks:
│           title_and_hook → full_script → scene_breakdown → hashtags
│
├─ Generate page consumes stream and assembles final result state
│
└─ User can trigger "Generate Thumbnail" from result panel
│
└─ (optional) User clicks "Save Script"
    └─ POST /api/scripts
        ├─ Upload thumbnail to Supabase Storage (if generated)
        ├─ INSERT into scripts table
        └─ Dashboard reload/fetch flow refreshes data
```

---

### 4.2 Thumbnail Generation Flow

```
User clicks "Generate Thumbnail"
│
├─ POST /api/generate/thumbnail
│   ├─ Builds image prompt from title + hook + niche
│   ├─ Calls Gemini model
│   ├─ Extracts inline image payload from candidate content
│   └─ Returns data URL base64 image string
│
├─ Generate page displays image inline
│
└─ On "Save Script":
    ├─ base64 thumbnail sent with save request
    ├─ Server decodes and uploads to Supabase Storage
    └─ thumbnail_url stored in scripts table
```

---

### 4.3 Auth Flow

```
User visits /dashboard
│
├─ middleware.ts checks Supabase session cookie
│   ├─ No session → redirect to /login
│   └─ Valid session → allow through
│
├─ Supabase client SDK manages token refresh automatically
│
└─ API routes validate session server-side:
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 401
```

---

## 5. Error Handling Strategy

| Scenario | Handling |
|---|---|
| Gemini API fails | Catch error, return 500 with message, show toast + retry button |
| Gemini returns invalid JSON | Return generation error chunk; client surfaces error state |
| Image generation returns no image payload | Return 502 with model details; UI shows thumbnail error |
| DB write fails | Show error toast and keep generated result in page state so user doesn't lose content |
| Auth session expired | Supabase SDK auto-refreshes; if it fails, redirect to /login |
| Network timeout | Abort controller on fetch, show "Request timed out — try again" |
