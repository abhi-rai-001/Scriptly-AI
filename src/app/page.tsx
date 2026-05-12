import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Process from "@/components/landing/Process";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/layout/Footer";

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
      <Navbar isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
        <Features />
        <Process />
        <Testimonials />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
