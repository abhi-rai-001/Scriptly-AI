# Deployment Guide — Zebvo AI

This guide will walk you through deploying Zebvo AI for free using **Vercel** and **Supabase**.

---

## 1. Prerequisites

Before you begin, ensure you have accounts with:
*   [GitHub](https://github.com)
*   [Supabase](https://supabase.com)
*   [Vercel](https://vercel.com)
*   [Google AI Studio](https://aistudio.google.com/) (for Gemini API Key)
*   [Hugging Face](https://huggingface.co/) (for Thumbnail generation API Key)

---

## 2. Supabase Setup (Database & Auth)

1.  **Create a Project**: Go to Supabase and create a new project named `Zebvo AI`.
2.  **Database Schema**: Go to the **SQL Editor** in Supabase and run the following migrations in order:
    *   Find them in your local `supabase/migrations` folder:
        1.  `20260512185000_add_status_to_scripts.sql`
        2.  `20260512193000_add_viral_score_to_scripts.sql`
    *   **IMPORTANT**: Also run the Security Hardening SQL:
        ```sql
        -- Enable RLS on Profiles
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

        -- Enable RLS on Scripts & Projects (if not already enabled)
        ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users see own scripts" ON public.scripts FOR ALL USING (auth.uid() = user_id);
        
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users see own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
        ```
3.  **Storage Setup**:
    *   Go to **Storage** in the Supabase dashboard.
    *   Create a new **Public** bucket named `thumbnails`.
    *   Add the following RLS Policies for the `thumbnails` bucket:
        *   **Select**: Allow `public` access (for everyone to see images).
        *   **Insert/Update/Delete**: Allow `authenticated` users, but restrict to their own folder: `(storage.foldername(name))[1] = auth.uid()::text`.

---

## 3. External API Keys

1.  **Gemini API**:
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Create an API Key and save it as `GEMINI_API_KEY`.
2.  **Hugging Face API**:
    *   Go to [Hugging Face Settings](https://huggingface.co/settings/tokens).
    *   Create a new "Read" token and save it as `HUGGINGFACE_API_KEY`.

---

## 4. Vercel Deployment

1.  **Push to GitHub**: Make sure your code is pushed to your GitHub repository.
2.  **Import Project**: In Vercel, click **Add New > Project** and import your GitHub repo.
3.  **Environment Variables**: Add the following variables in the Vercel "Environment Variables" section:

| Variable | Source |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API |
| `GEMINI_API_KEY` | Google AI Studio |
| `HUGGINGFACE_API_KEY` | Hugging Face |
| `SUPABASE_THUMBNAIL_BUCKET` | `thumbnails` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL (e.g., `https://zebvo-ai.vercel.app`) |

4.  **Deploy**: Click **Deploy**. Vercel will build your Next.js app and provide you with a production URL.

---

## 5. Auth Configuration

1.  In the Supabase dashboard, go to **Auth > URL Configuration**.
2.  Set **Site URL** to your Vercel URL (e.g., `https://zebvo-ai.vercel.app`).
3.  Add `http://localhost:3000` and your Vercel URL to **Redirect URLs**.

---

## 6. Troubleshooting

*   **Hydration Errors**: If you see hydration errors in production, ensure your local `node_modules` are up to date and you've run a clean build.
*   **Thumbnail Fails**: Check that the `thumbnails` bucket in Supabase is set to "Public" and that your `HUGGINGFACE_API_KEY` has permission to access the `black-forest-labs/FLUX.1-schnell` model (usually free).
*   **Database Errors**: Ensure all migrations were run in the correct order. If a table like `profiles` is missing, you may need to create it manually with an `id (uuid)` primary key linked to `auth.users`.

---

**Congratulations! Your Zebvo AI dashboard is now live.**
