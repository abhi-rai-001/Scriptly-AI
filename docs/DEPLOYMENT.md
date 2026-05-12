# Deployment Guide
## Scriptly AI — Vercel & Supabase

This guide outlines the steps to deploy Scriptly AI to production.

---

## 1. Supabase Setup

### 1.1 Database Schema
Run the SQL migration in `supabase/migrations/` (or copy from `docs/DATA_FLOW.md`) in the Supabase SQL Editor to create:
- `projects` table
- `scripts` table
- Profiles trigger logic

### 1.2 Storage
1. Go to **Storage** in Supabase dashboard.
2. Create a new bucket named `thumbnails`.
3. Set the bucket to **Public**.
4. (Optional) Add an RLS policy for the bucket if you want restricted uploads (though the API uses `service_role`).

### 1.3 Auth
1. Enable **Email/Password** provider.
2. Set up your **Site URL** in `Settings > Auth` (e.g., `https://your-app.vercel.app`).
3. Add `http://localhost:3000` and your production URL to the **Redirect URLs**.

---

## 2. Vercel Deployment

### 2.1 Connect Repository
1. Push your code to GitHub.
2. Import the project into Vercel.

### 2.2 Environment Variables
Add the following keys in the Vercel Dashboard:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings > API |
| `GEMINI_API_KEY` | Google AI Studio |
| `HUGGINGFACE_API_KEY` | Hugging Face Settings > Tokens |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL |

### 2.3 Build Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

---

## 3. Post-Deployment Checklist

1. **Auth Test**: Sign up with a real email and verify the session persists.
2. **Generation Test**:
   - Generate a script.
   - Generate a thumbnail (verifies Hugging Face / Gemini / Pollinations integration).
3. **Storage Test**: Save a script with a thumbnail and ensure it displays in the dashboard.
4. **Export Test**: Download a PDF and JSON to verify client-side libraries (`jsPDF`).

---

## 4. Troubleshooting

- **Image Generation Fails**: Check if `HUGGINGFACE_API_KEY` is valid and has access to `black-forest-labs/FLUX.1-schnell`.
- **Database Errors**: Ensure `SUPABASE_SERVICE_ROLE_KEY` is used in API routes for storage uploads.
- **Hydration Errors**: Ensure all `DropdownMenuTrigger` components use `asChild` correctly or have been refactored to `render`.
