"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const platforms = ["Instagram Reels", "YouTube Shorts", "TikTok"];

const mockScript = {
  hook: "You're losing 3 hours every time you try to write a reel script. Here's how to get it done in 60 seconds.",
  title: "The Creator's Shortcut to Going Viral",
  hashtags: ["#ContentCreator", "#ReelStrategy", "#AITools", "#ViralHook"],
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[oklch(0.82_0.14_195)]/8 blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[oklch(0.65_0.27_330)]/6 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 100%) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 100%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left — Copy */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Powered by Gemini AI</span>
              <span className="w-1 h-1 rounded-full bg-primary/60" />
              <span className="text-primary font-medium">Now in Beta</span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Stop Scripting.
              <br />
              <span className="gradient-text">Start Creating.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mb-8">
              Scriptly AI generates viral hooks, full scripts, scene breakdowns,
              hashtags, and AI thumbnails for your reels — in under 60 seconds.
            </p>

            {/* Platform pills */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center lg:justify-start">
              {platforms.map((p) => (
                <Badge
                  key={p}
                  variant="secondary"
                  className="text-xs px-3 py-1 bg-secondary/80 text-muted-foreground border-white/8"
                >
                  {p}
                </Badge>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold glow-primary transition-all hover:scale-105 group"
                )}
              >
                Generate Your First Script
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base border-white/12 hover:border-primary/40 hover:bg-primary/5 group"
              >
                <Play className="mr-2 w-4 h-4 fill-current" />
                See It In Action
              </Button>
            </div>

            {/* Social proof micro-stat */}
            <p className="mt-6 text-xs text-muted-foreground/60">
              Free to start · No credit card required · 3 free scripts/day
            </p>
          </div>

          {/* Right — Floating UI Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="relative">
              {/* Main card */}
              <div className="glass-card rounded-2xl p-6 indigo-gradient-border shadow-2xl">
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.22_25)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Generating script…</span>
                  </div>
                </div>

                {/* Typing indicator row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>

                {/* Generated content preview */}
                <div className="space-y-4">
                  {/* Step: Title */}
                  <div className="p-3.5 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-widest mb-1.5">
                      Video Title
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {mockScript.title}
                    </p>
                  </div>

                  {/* Step: Hook */}
                  <div className="p-3.5 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-[10px] text-[oklch(0.82_0.14_195)] font-semibold uppercase tracking-widest mb-1.5">
                      Viral Hook
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mockScript.hook}
                    </p>
                  </div>

                  {/* Step: Hashtags */}
                  <div className="p-3.5 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-[10px] text-[oklch(0.65_0.27_330)] font-semibold uppercase tracking-widest mb-2">
                      Hashtags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockScript.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress steps */}
                <div className="mt-5 flex items-center gap-2">
                  {["Title", "Hook", "Script", "Scenes", "CTA", "Tags"].map(
                    (step, i) => (
                      <div key={step} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`h-1 w-full rounded-full transition-all ${
                            i < 2
                              ? "bg-primary"
                              : i === 2
                              ? "bg-primary/40 animate-pulse"
                              : "bg-white/10"
                          }`}
                        />
                        <span className="text-[9px] text-muted-foreground/60 hidden sm:block">
                          {step}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Floating accent card — platform badge */}
              <div className="absolute -top-4 -right-4 glass rounded-xl px-3.5 py-2.5 border border-white/10 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">IG</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">Instagram Reels</p>
                    <p className="text-[9px] text-muted-foreground">60s · Educational</p>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-4 -left-4 glass rounded-xl px-3.5 py-2.5 border border-white/10 shadow-xl">
                <p className="text-[10px] text-muted-foreground mb-0.5">Generated in</p>
                <p className="text-lg font-bold gradient-text leading-none">8.3s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
