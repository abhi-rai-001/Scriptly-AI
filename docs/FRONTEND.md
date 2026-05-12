# Frontend Documentation
## AI Reel Script & Thumbnail Generator

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | Latest stable features, Turbopack, and enhanced server components |
| Language | TypeScript | Full type safety across generation store and API contracts |
| Styling | Tailwind CSS 4 | Modern utility-first styling with high-performance builds |
| UI Components | shadcn/ui | Modern, accessible components integrated into the Obsidian Lux theme |
| State Management | Zustand | Centralized store for iterative generation and thumbnail state |
| Server State | TanStack Query | Optimized fetching for dashboard projects and script lists |
| Exports | jsPDF + docx | Robust client-side generation for PDF and Word documents |
| Forms | React Hook Form + Zod | Validation without pain |
| Auth | Supabase Auth (client SDK) | Hooks-ready, works with SSR |
| Animations | Framer Motion | Smooth transitions, streaming text feel |
| Icons | Lucide React | Consistent icon set |

---

## 2. Design System (Branding)

The visual identity of Scriptly AI is designed to feel premium, futuristic, and creator-focused.

| Token | Value | Description |
|---|---|---|
| **Primary (AI)** | `#8B5CF6` (Indigo/Violet) | Main CTA, active states, and AI indicators. |
| **Background** | `#0F172A` (Obsidian/Slate) | Deep dark mode background for a "studio" feel. |
| **Surface** | `#1E293B` | Card backgrounds and elevated surfaces. |
| **Accent** | `#22D3EE` (Cyan) | Secondary highlights and success states. |
| **Text (Primary)** | `#F8FAFC` | Headings and high-emphasis text. |
| **Text (Secondary)**| `#94A3B8` | Subtext and muted descriptions. |

**Visual Style:**
- **Glassmorphism:** Subtle blur effects on sidebars and dropdowns.
- **Micro-interactions:** Smooth Framer Motion transitions for streaming text.
- **Gradients:** Occasional Indigo-to-Cyan gradients for "AI-generated" content containers.

---

## 3. Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + topbar shell
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Script grid
│   │   ├── generate/
│   │   │   └── page.tsx            # Generation form + result
│   │   ├── script/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Individual script view/edit
│   │   └── projects/
│   │       └── page.tsx            # Project manager
│   ├── api/
│   │   ├── generate/
│   │   │   ├── script/route.ts     # Gemini text generation
│   │   │   └── thumbnail/route.ts  # Gemini image generation
│   │   ├── scripts/
│   │   │   ├── route.ts            # GET all, POST save
│   │   │   └── [id]/route.ts       # GET one, PATCH, DELETE
│   │   └── projects/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── layout.tsx                  # Root layout (fonts, providers)
│   └── page.tsx                    # Landing page
│
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobilNav.tsx
│   ├── dashboard/
│   │   ├── ScriptCard.tsx
│   │   ├── ScriptGrid.tsx
│   │   ├── FilterBar.tsx
│   │   └── EmptyState.tsx
│   ├── generate/
│   │   ├── GenerationForm.tsx      # The input form
│   │   ├── GenerationResult.tsx    # Streamed output display
│   │   ├── ScriptSection.tsx       # Individual section (hook, script etc.)
│   │   ├── ThumbnailPanel.tsx      # Image gen + display
│   │   └── RegenerateButton.tsx
│   ├── script/
│   │   ├── ScriptEditor.tsx        # Inline editing
│   │   ├── ExportMenu.tsx
│   │   └── ScriptMeta.tsx
│   └── shared/
│       ├── CopyButton.tsx
│       ├── LoadingSpinner.tsx
│       ├── StreamingText.tsx       # Animated text reveal
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client (for API routes)
│   ├── gemini/
│   │   ├── client.ts               # Gemini SDK init
│   │   ├── prompts.ts              # All prompt templates
│   │   └── parsers.ts              # Parse structured AI responses
│   ├── export/
│   │   ├── pdf.ts                  # PDF generation logic
│   │   └── markdown.ts             # Markdown export
│   └── utils.ts
│
├── stores/
│   ├── generationStore.ts          # In-progress generation state
│   └── uiStore.ts                  # Sidebar open, active project, etc.
│
├── hooks/
│   ├── useScripts.ts               # React Query hooks for scripts
│   ├── useProjects.ts
│   ├── useGenerate.ts              # Generation trigger + streaming state
│   └── useAuth.ts
│
├── types/
│   ├── script.ts
│   ├── project.ts
│   └── generation.ts
│
└── middleware.ts                   # Auth protection for /dashboard routes
```

---

## 3. Key Components

### 3.1 GenerationForm.tsx
```tsx
// Controlled page-level form state in /app/(dashboard)/generate/page.tsx
// Fields: topic, niche, platform, style, duration, additionalInstructions
// Includes suggestion chips for extra instructions (tone, audience, CTA goal, etc.)
// Submit triggers POST /api/generate/script and consumes NDJSON stream
// Submit button disabled until required inputs are valid
```

### 3.2 GenerationResult.tsx
```tsx
// Result state renders title, hook, script, CTA, scenes, and hashtags
// Data is assembled from streamed chunks: title_and_hook, full_script, scene_breakdown, hashtags
// "Generate Thumbnail" button calls /api/generate/thumbnail
// Thumbnail image renders from returned base64 data URL
```

### 3.3 ScriptEditor.tsx
```tsx
// Opens a saved script in edit mode
// Each field (title, hook, script, CTA, hashtags) is an editable textarea
// Auto-saves on blur (debounced PATCH to API)
// Dirty state tracked — shows "Unsaved changes" indicator
```

### 3.4 StreamingText.tsx
```tsx
// Accepts a string prop
// Uses useEffect to animate character-by-character reveal
// Gives the "AI typing" feel without actual streaming
// Can be upgraded to real streaming later
```

---

## 4. State Management

### Zustand — generationStore
```ts
interface GenerationStore {
  status: 'idle' | 'generating' | 'done' | 'error'
  currentStep: 'title' | 'hook' | 'script' | 'scenes' | 'cta' | 'hashtags' | null
  result: GeneratedScript | null
  thumbnail: string | null  // base64 or URL
  error: string | null

  startGeneration: () => void
  setStep: (step: string) => void
  setResult: (result: GeneratedScript) => void
  setThumbnail: (url: string) => void
  reset: () => void
}
```

### React Query — useScripts hook
```ts
// useQuery: fetch all scripts (with project filter)
// useMutation: save, update, delete script
// Automatic cache invalidation after mutations
// staleTime: 60s (scripts don't change that fast)
```

---

## 5. Page Breakdown

### `/` (Landing Page / Homepage)
- **Hero Section**: High-impact headline, subheadline, CTA ("Get Started for Free"), and an abstract product mockup or video snippet.
- **Features**: Visual breakdown of the script generation and thumbnail creation process.
- **Testimonials/Social Proof**: Cards showing creator reviews.
- **Pricing**: Subscription tiers (e.g., Starter, Pro, Agency).
- **Footer**: Branding, legal links, and secondary navigation.

### `/dashboard`
- Topbar with search + "New Script" CTA
- Sidebar with project list
- FilterBar (platform, niche, date)
- ScriptGrid — card per saved script
- EmptyState when no scripts exist

### `/generate`
- Single-page generation workspace with step indicator
- Inputs: topic, niche, platform, style, duration, extra instructions
- "Extra instructions" supports user-specific tone/constraints/goals
- Submits to `/api/generate/script` and streams NDJSON chunks into UI state
- Result view includes title, hook, full script, CTA, scenes, hashtags
- Inline thumbnail generation via `/api/generate/thumbnail`
- Progress steps indicator at top
- Mobile: stacked flow with same end-to-end generation support

### `/script/[id]`
- Full script view
- Inline editable fields
- Thumbnail displayed on right
- Export dropdown: PDF / Markdown / Copy
- Duplicate + Delete actions in top-right

### `/projects`
- List of all projects with script count
- Create, rename, delete project
- Click project to filter dashboard to that project

---

## 6. Auth & Route Protection

`middleware.ts` checks Supabase session cookie. Unauthenticated requests to `/dashboard/*`, `/generate`, `/script/*`, `/projects` are redirected to `/login`.

```ts
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/generate/:path*', '/script/:path*', '/projects/:path*']
}
```

---

## 7. Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (< 768px) | No sidebar — hamburger menu, stacked layouts |
| Tablet (768–1024px) | Collapsed icon sidebar |
| Desktop (> 1024px) | Full sidebar + content area |

---

## 8. Loading & Error States

Every async action has three states handled:

- **Loading** — Skeleton loaders on dashboard cards, spinner on generation button
- **Error** — Toast notification (top-right), inline error message with retry option
- **Empty** — Illustrated empty states with CTA ("Generate your first script")

Never show a blank white screen.
