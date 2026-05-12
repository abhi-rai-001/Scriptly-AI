# Scriptly AI — Master Task Board

---

## ✅ Phase 0: Foundation (Done by previous agent)
- [x] Initialize Next.js 16 project
- [x] Setup Supabase connection (client + server)
- [x] Initialize Database Schema
- [x] Organize documentation into `docs/` folder
- [x] Setup Gemini SDK
- [x] Install shadcn/ui (base-nova style, button component)

---

## 🎨 Phase 1: Design System & Foundation
- [x] Install missing frontend dependencies (framer-motion, tanstack-query, react-hook-form, @hookform/resolvers)
- [x] Update fonts — Space Grotesk (body) + Syne (headings)
- [x] Wire design tokens in globals.css (Cyber-Obsidian palette)
- [x] Update root layout.tsx (metadata, font variables, dark class, production SEO)
- [/] Implement Backend API routes
    - [x] Create Zod schemas (Input & Gemini Output)
    - [x] Implement Gemini Prompts & Parsers
    - [x] Create /api/generate/script (Streaming)
    - [x] Create /api/generate/thumbnail
    - [x] Create CRUD routes for scripts & projects
- [x] Scaffold route groups — (auth), (dashboard)
- [x] Create middleware.ts for auth-protected routes
- [x] Install remaining shadcn/ui components (card, input, badge, dialog, dropdown, skeleton, separator, avatar)

---

## 🏠 Phase 2: Landing Page (/) ✅
- [x] Navbar — logo, nav links, CTA buttons (Login / Get Started), scroll-aware glassmorphism, mobile menu
- [x] Hero Section — headline, subheadline, animated CTA, floating UI mockup with live step progress
- [x] Features Section — 6-card grid with icons and production-quality copy
- [x] How It Works — 4-step numbered flow with connector line
- [x] Social Proof / Testimonials — 6 masonry cards with creator stats
- [x] Pricing Section — 3-tier cards (Starter / Pro / Agency) with highlighted Pro
- [x] CTA Section — Closing conversion section with strong copy
- [x] Footer — brand block, 4 link columns, legal bar
- [x] Page-level SEO metadata (title, description, OG, Twitter cards)

---

## 🔐 Phase 3: Auth Pages
- [x] /login — email + password form (PREMIUM DESIGN COMPLETE)
- [x] /signup — email + password + name (PREMIUM DESIGN COMPLETE)
- [x] Auth middleware protection
- [x] Supabase auth actions (logic ready)
- [ ] Supabase auth hooks (useAuth)

---

## 🗂 Phase 4: Dashboard Shell & Layout ✅
- [x] Sidebar component — project list, nav links, collapsible
- [x] Topbar component — search, new script CTA, user avatar/menu
- [x] Dashboard layout.tsx — shell with sidebar + content
- [x] Mobile nav (hamburger + drawer)

---

## 📋 Phase 5: Dashboard Page (/dashboard) ✅
- [x] Backend logic (Server actions & Fetching ready)
- [x] ScriptGrid — responsive card grid
- [x] ScriptCard — thumbnail, title, badge metadata, actions menu
- [x] FilterBar — platform, niche, date dropdowns
- [x] Search functionality
- [x] EmptyState — illustrated with CTA
- [x] Skeleton loaders for loading state

---

## ⚡ Phase 6: Script Generation Page (/generate) ✅
- [x] GenerationForm — topic, niche, platform, style, duration, extra instructions
- [x] Progress step indicator
- [x] GenerationResult — sections reveal in sequence
- [x] StreamingText animation component
- [x] Wire generate page to live `/api/generate/script` NDJSON streaming flow
- [x] ThumbnailPanel — generate + display + download
- [x] Enable real thumbnail generation via `/api/generate/thumbnail` (inline image payload extraction)
- [x] RegenerateButton per section
- [x] Save Script flow
- [ ] Zustand generationStore wiring (Phase 8)

---

## 📄 Phase 7: Script View & Editor (/script/[id]) ✅
- [x] Full script display layout
- [x] Inline editable fields (textarea on click)
- [x] Auto-save on blur (debounced PATCH)
- [x] Unsaved changes indicator
- [x] ExportMenu — PDF, Markdown, Copy
- [x] Duplicate + Delete actions
- [x] Thumbnail display panel

---

## 📁 Phase 8: Projects Page (/projects) ✅
- [x] Backend logic (Server actions & Fetching ready)
- [x] UI: Project list with script count
- [x] UI: Create project modal
- [x] UI: Rename + Delete with confirmation
- [x] Click to filter dashboard

---

## 🔗 Phase 9: API Routes (Backend)
- [x] POST /api/generate/script
- [x] POST /api/generate/thumbnail
- [x] GET+POST /api/scripts
- [x] GET+PATCH+DELETE /api/scripts/[id]
- [x] GET+POST /api/projects
- [x] PATCH+DELETE /api/projects/[id]
- [x] Add strict JSON extraction + Zod parser validation for Gemini outputs
- [x] Add `additionalInstructions` support in generation schema + prompts
- [x] Re-enable auth guard checks on generation endpoints

---

## 🚀 Phase 10: Polish & Production Readiness
- [x] Error boundaries on all async routes (Global + Dashboard)
- [x] Toast notifications (sonner)
- [x] Mobile responsiveness audit (Topbar, Hero, Navbar)
- [x] Accessibility (a11y) audit — keyboard nav, aria labels
- [x] SEO — metadata per page, OG tags
- [x] Performance — optimized with next/image, dynamic imports
- [x] Build passes without errors (Verified locally with npm run build)
- [ ] Environment variables verified for production

---

## 🟢 Stabilization & Fixes (In Progress)
- [x] Fix "Cannot find middleware" runtime error (Relocated to root)
- [x] Fix brand icons missing in Lucide 1.14.0 (Github, Instagram, Youtube replaced with SVGs)
- [x] Upgrade generation prompts to professional ad-grade script strategy
- [x] Update PRD/DATA_FLOW/FRONTEND docs for extra instructions + real thumbnail flow
- [x] Final Build & Lint verification (Passed locally)
- [x] Feature: Save as Preview in Thumbnail Generator (Auto-cleanup old storage)
- [ ] Production Deployment & Test
