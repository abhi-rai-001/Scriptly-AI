# Product Requirements Document
## AI Reel Script & Thumbnail Generator
**Version:** 1.0  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase · Gemini API  
**Assignment:** Scriptly AI — Option 3

---

## 1. Product Overview

A creator-focused SaaS platform that uses AI to generate short-form video scripts, viral hooks, scene breakdowns, captions, hashtags, and AI thumbnails — all in one workflow. Designed for content creators, social media managers, and agencies producing reels for Instagram, YouTube Shorts, and TikTok.

### 1.1 Problem Being Solved
Creators waste hours on scripting and ideation. Good hooks are hard. Thumbnails require design skills. This platform compresses the entire pre-production workflow into minutes.

### 1.2 Target Users
- Solo content creators
- Social media managers
- Small marketing agencies
- Freelancers producing video content for clients

### 1.3 Brand Identity
Scriptly AI positions itself as a premium, "studio-grade" tool for high-performing creators. The visual language uses a **Cyber-Obsidian & Electric Indigo** palette to signify the intersection of cutting-edge AI and creative expression.

---

## 2. Core Features

### F1 — Authentication
- Email/password signup and login via Supabase Auth
- Protected dashboard — unauthenticated users redirected to `/login`
- User session persisted across tabs

### F2 — Project/Folder System
- Users can create named **Projects** (e.g. "Tech Niche Q3", "Client — FitLife Brand")
- Scripts are organized inside projects
- Projects can be renamed or deleted
- Default "Uncategorized" project on signup

### F3 — AI Script Generation
User fills a generation form:

| Field | Type | Notes |
|---|---|---|
| Topic | Text input | e.g. "How AI is replacing jobs" |
| Niche / Category | Dropdown | Tech, Fitness, Finance, Beauty, etc. |
| Platform | Dropdown | Instagram Reels, YouTube Shorts, TikTok |
| Content Style | Dropdown | Educational, Entertaining, Motivational, Controversial |
| Script Duration | Dropdown | 15s / 30s / 60s |
| Extra Instructions | Textarea (optional) | Tone, audience, output format, CTA goal, constraints |

AI generates (in sequence, separate prompts):
1. **Video Title** — clickable, platform-optimized
2. **Viral Hook** — opening 3-5 seconds, pattern interrupt
3. **Full Script** — timed, spoken-word format
4. **Scene Breakdown** — shot-by-shot visual direction
5. **CTA** — end screen call to action
6. **Hashtags** — 15-20 platform-relevant tags

Prompting is optimized for professional, ad-grade output quality with strong retention and conversion-oriented structure.

### F4 — AI Thumbnail Generation
- After script is generated, user can trigger thumbnail generation
- Gemini generates a thumbnail/poster image based on the video title + hook
- Image displayed inline, downloadable as PNG

### F5 — Script Management
- Save scripts to a project
- Edit any generated field inline (title, hook, script, CTA, hashtags)
- Duplicate a script (for A/B variations)
- Delete scripts
- Regenerate individual sections without rerunning the full flow

### F6 — Content Dashboard
- Grid/list view of all saved scripts
- Filter by project, platform, niche, date
- Quick preview on hover/tap
- Search by title or topic

### F7 — Export
- Export individual script as **PDF** (formatted, print-ready)
- Export as **Markdown** file
- Copy to clipboard (one-click)

### F8 — Landing Page / Homepage
- High-converting landing page to introduce the product
- **Hero Section:** Value proposition, email capture or "Get Started" CTA, and product mockup
- **Features Section:** Breakdown of AI script and thumbnail generation
- **Social Proof/Testimonials:** Reviews from creators and agencies
- **Pricing:** Tiered pricing display (even if non-functional for v1)
- **Footer:** Links, legal, and branding

---

## 3. User Flows

### 3.1 New User Flow
```
Landing → Sign Up → Email Verify → Dashboard (empty state) → Create First Project → Generate First Script
```

### 3.2 Script Generation Flow
```
Dashboard → Select Project → "New Script" → Fill Form → Generate →
Stream Results (title → hook → script → scenes → CTA → hashtags) →
Generate Thumbnail → Review → Save / Edit → Back to Dashboard
```

### 3.3 Returning User Flow
```
Login → Dashboard → Browse saved scripts → Open script → Edit / Duplicate / Export
```

---

## 4. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Script generation time | < 15 seconds total |
| Thumbnail generation time | < 20 seconds |
| Page load (dashboard) | < 2 seconds |
| Mobile responsiveness | Full support |
| API error handling | Graceful fallback messages, retry option |
| Auth token expiry | Handled silently with auto-refresh |

---

## 5. Out of Scope (v1)
- Actual video generation
- Scheduling or publishing to platforms
- Team collaboration
- Payments / subscription billing
- Analytics / performance tracking

---

## 6. Success Metrics (for demo/evaluation)
- End-to-end script generation works without errors
- Thumbnail displays correctly after generation
- Saved scripts persist across sessions
- Dashboard renders correctly with 10+ scripts
- Export produces a correctly formatted PDF
