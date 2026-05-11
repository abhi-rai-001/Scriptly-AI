import { createClient } from "@/lib/supabase/server";
import LuxNavbar from "@/components/landing/LuxNavbar";
import LuxHero from "@/components/landing/LuxHero";
import LuxFeatures from "@/components/landing/LuxFeatures";
import LuxProcess from "@/components/landing/LuxProcess";
import LuxTestimonials from "@/components/landing/LuxTestimonials";
import LuxPricing from "@/components/landing/LuxPricing";
import LuxCta from "@/components/landing/LuxCta";
import LuxFooter from "@/components/landing/LuxFooter";

export const metadata = {
  title: "Scriptly AI — AI Script & Thumbnail Generator for Creators",
  description:
    "Generate viral short-form video scripts, hooks, scene breakdowns, captions, hashtags, and AI thumbnails in minutes. Built for Instagram Reels, YouTube Shorts, and TikTok creators.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-background">
      <LuxNavbar isAuthenticated={isAuthenticated} />
      <main>
        <LuxHero isAuthenticated={isAuthenticated} />
        <LuxFeatures />
        <LuxProcess />
        <LuxTestimonials />
        <LuxPricing />
        <LuxCta />
      </main>
      <LuxFooter />
    </div>
  );
}
