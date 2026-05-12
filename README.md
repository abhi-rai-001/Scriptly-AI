# 🎬 Scriptly AI — Premium Short-Form Content Engine

Scriptly AI is a professional, studio-grade SaaS platform designed for high-performing creators to generate viral short-form content (Reels, Shorts, TikToks) in seconds. It compresses the entire pre-production workflow—from ideation and scripting to scene breakdown and thumbnail design—into a single, AI-powered experience.

![Hero Preview](https://github.com/abhi-rai-001/Scriptly-AI/blob/main/public/og-image.png?raw=true)

## ⚡ Key Features

### 📝 AI Script Generation
- **Viral Hook Engine**: Generates 3-5 second pattern-interrupt hooks designed for maximum retention.
- **Platform Optimized**: Custom logic for Instagram Reels, YouTube Shorts, and TikTok.
- **Scene-by-Scene Breakdowns**: Shot-by-shot visual and audio directions for easier filming.
- **Dynamic Streaming**: Real-time script generation using NDJSON streaming for zero-wait UX.

### 🖼️ AI Thumbnail Studio
- **Social-Ready Visuals**: Generate eye-catching thumbnails optimized for the "scroll-stop" effect.
- **Iterative Refinement**: Regenerate thumbnails with custom prompts until you find the perfect match.
- **Save as Preview**: Instantly set any generated thumbnail as the primary preview for your script.

### 📂 Pro Management & Export
- **Project Hierarchy**: Organize your content into folders/projects for different clients or niches.
- **Multi-Format Export**: Download your scripts as **PDF**, **Markdown**, **JSON**, or **DOCX**.
- **Auto-Saving Drafts**: Never lose work with persistent draft states and debounced auto-saves.

## 🛠️ Tech Stack

- **Core**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion (Cyber-Obsidian & Electric Indigo Theme)
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **AI Models**: 
  - **Gemini 2.5 Flash**: Script generation and strategy analysis.
  - **FLUX.1-schnell (via Hugging Face)**: High-fidelity image generation.
  - **Pollinations AI**: Resilient fallback for image generation.
- **Components**: Base UI + custom Shadcn/ui implementation.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Supabase Project
- API Keys for Gemini and Hugging Face

### 2. Environment Setup
Create a `.env.local` file in the root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_key
HUGGINGFACE_API_KEY=your_hf_key
```

### 3. Installation
```bash
npm install
npm run dev
```

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Dashboard, Auth, API)
├── components/           # UI components (Base UI, custom landing, layout)
├── features/             # Core business logic (Scripts, Projects)
├── lib/                  # Shared utilities (Supabase, Gemini, formatting)
├── schemas/              # Zod validation schemas
├── store/                # Zustand state management
└── tasks/                # Development tracking and lessons
docs/                     # Comprehensive technical documentation
```

## 📖 Documentation

For deep dives into the system, check out our docs:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Frontend Design System](docs/FRONTEND.md)
- [Data Flow & API](docs/DATA_FLOW.md)
- [Product Requirements (PRD)](docs/PRD.md)

---

Developed by the Scriptly AI Team. Turn ideas into viral content in seconds.
