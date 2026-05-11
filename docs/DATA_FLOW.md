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
  "duration": "60s"
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

## 3. Gemini Prompt Templates

All prompts live in `src/lib/gemini/prompts.ts`. They are template strings, not hardcoded.

### 3.1 Title + Hook Prompt
```
You are a viral short-form video strategist.

Generate a video title and hook for the following:
- Topic: {{topic}}
- Niche: {{niche}}
- Platform: {{platform}} (optimized for algorithm)
- Style: {{style}}
- Duration: {{duration}}

Return ONLY valid JSON:
{
  "title": "...",
  "hook": "..."
}

Rules:
- Hook must be the first 5 seconds of spoken content
- Hook must create curiosity or urgency
- Title must be click-worthy but not clickbait
```

### 3.2 Full Script Prompt
```
You are a professional short-form video scriptwriter.

Write a {{duration}} script for:
- Topic: {{topic}}
- Hook already written: "{{hook}}"
- Style: {{style}}
- Platform: {{platform}}

Return ONLY valid JSON:
{
  "script": "Full spoken script here, written for voiceover, no stage directions",
  "cta": "End screen CTA — one sentence max"
}

Rules:
- Write for spoken delivery, not reading
- Match the platform's pacing (TikTok = faster, YouTube = slightly slower)
- CTA should feel natural, not salesy
```

### 3.3 Scene Breakdown Prompt
```
Based on this script, generate a shot-by-shot scene breakdown for a {{platform}} reel:

Script: {{script}}
Duration: {{duration}}

Return ONLY a JSON array:
[
  {
    "scene": 1,
    "duration": "0-5s",
    "visual": "What the camera shows",
    "audio": "What is being said",
    "text_overlay": "On-screen text if any"
  }
]
```

### 3.4 Hashtags Prompt
```
Generate 15-20 hashtags for a {{platform}} video about "{{topic}}" in the {{niche}} niche.

Mix of:
- 3-4 very broad hashtags (1M+ posts)
- 6-8 medium hashtags (100K-1M posts)
- 5-6 niche-specific hashtags (<100K posts)

Return ONLY a JSON array of strings: ["#Tag1", "#Tag2", ...]
```

### 3.5 Thumbnail Prompt
```
Create a bold, eye-catching YouTube Shorts / Instagram Reel thumbnail image.

Video title: {{title}}
Hook: {{hook}}
Niche: {{niche}}

Style: High contrast, bold text overlay, emotional face or dramatic visual,
professional graphic design quality. No watermarks.
```

---

## 4. Full Data Flow Diagrams

### 4.1 Script Generation Flow

```
User (Browser)
│
├─ Fills GenerationForm
│   └─ topic, niche, platform, style, duration
│
├─ Clicks "Generate Script"
│   └─ generationStore.status = 'generating'
│
├─ POST /api/generate/script
│   │
│   └─ API Route (Next.js server)
│       ├─ Validates request body (Zod)
│       ├─ Checks Supabase session (auth guard)
│       │
│       ├─ Step 1: Gemini call → title + hook
│       │   └─ parse JSON response
│       ├─ Step 2: Gemini call → script + CTA
│       │   └─ uses hook from Step 1 in prompt
│       ├─ Step 3: Gemini call → scene breakdown
│       │   └─ uses script from Step 2 in prompt
│       ├─ Step 4: Gemini call → hashtags
│       │
│       └─ Returns combined JSON response
│
├─ GenerationResult renders each section as data arrives
│   └─ StreamingText animation on each field
│
└─ User clicks "Save Script"
    └─ POST /api/scripts
        ├─ Upload thumbnail to Supabase Storage (if generated)
        ├─ INSERT into scripts table
        └─ React Query cache invalidated → dashboard refreshes
```

---

### 4.2 Thumbnail Generation Flow

```
User clicks "Generate Thumbnail"
│
├─ POST /api/generate/thumbnail
│   ├─ Builds image prompt from title + hook + niche
│   ├─ Calls Gemini image generation API
│   ├─ Returns base64 image string
│
├─ ThumbnailPanel displays image
│   ├─ User can download immediately (even before saving)
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
| Gemini returns invalid JSON | Retry once with stricter prompt, fallback to raw text |
| Image generation fails | Show placeholder, allow script save without thumbnail |
| DB write fails | Show error toast, keep result in Zustand so user doesn't lose generated content |
| Auth session expired | Supabase SDK auto-refreshes; if it fails, redirect to /login |
| Network timeout | Abort controller on fetch, show "Request timed out — try again" |
