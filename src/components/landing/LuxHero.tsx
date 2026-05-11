"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface LuxHeroProps {
  isAuthenticated: boolean;
}

// Animated floating script card preview
function ScriptPreviewCard({ delay = 0, title, tag }: { delay?: number; title: string; tag: string }) {
  return (
    <div
      className="lux-card rounded-2xl p-4 animate-float"
      style={{ animationDelay: `${delay}ms`, animationDuration: `${3.5 + delay * 0.001}s` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.24_285)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{tag}</span>
      </div>
      <p className="text-sm font-medium text-foreground/90 leading-snug line-clamp-2">{title}</p>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="h-1 rounded-full bg-[oklch(0.62_0.24_285)] w-16" />
        <div className="h-1 rounded-full bg-white/10 flex-1" />
      </div>
    </div>
  );
}

// Typewriter effect hook
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, displayText.length + 1));
        if (displayText.length === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayText(current.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setWordIndex((i) => i + 1);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex, words, speed, pause]);

  return displayText;
}

const ROTATING_WORDS = ["Reels", "Shorts", "TikToks", "Hooks"];

export default function LuxHero({ isAuthenticated }: LuxHeroProps) {
  const primaryHref = isAuthenticated ? "/generate" : "/signup";
  const secondaryHref = isAuthenticated ? "/dashboard" : "/login";
  const word = useTypewriter(ROTATING_WORDS);
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 mesh-bg" />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }} />

      {/* Radial spotlight top-left */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.24 285 / 20%) 0%, transparent 70%)" }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 pb-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

          {/* Left — Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Eyebrow chip */}
            <div
              className="label-chip inline-flex mb-8 animate-fade-blur"
              style={{ animationDuration: "600ms" }}
            >
              <Sparkles className="w-3 h-3" />
              AI-powered content creation
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.02] tracking-[-0.04em] text-foreground mb-6"
              style={{ fontFamily: "var(--font-cabinet)", animationFillMode: "both" }}
            >
              <span
                className="block animate-reveal-up"
                style={{ animationDelay: "100ms", animationFillMode: "both" }}
              >
                Turn ideas into
              </span>
              <span
                className="block animate-reveal-up"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}
              >
                viral{" "}
                <span className="gradient-text inline-block">
                  {word}
                  <span className="animate-pulse text-[oklch(0.80_0.18_85)]">|</span>
                </span>
              </span>
              <span
                className="block animate-reveal-up"
                style={{ animationDelay: "300ms", animationFillMode: "both" }}
              >
                in seconds.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[52ch] mx-auto lg:mx-0 mb-10 animate-reveal-up"
              style={{ animationDelay: "400ms", animationFillMode: "both" }}
            >
              AI-generated scripts, viral hooks, scene breakdowns, and eye-catching thumbnails — tailored for Instagram Reels, YouTube Shorts, and TikTok.
            </p>

            {/* CTA Group */}
            <div
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 animate-reveal-up"
              style={{ animationDelay: "500ms", animationFillMode: "both" }}
            >
              <Link
                href={primaryHref}
                className="btn-amber shimmer px-8 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Sparkles className="w-4 h-4" />
                {isAuthenticated ? "Open Generator" : "Generate Free Script"}
              </Link>
              <Link
                href={secondaryHref}
                className="glass px-8 py-4 rounded-xl text-base font-semibold text-foreground/80 hover:text-foreground hover:border-white/15 transition-all duration-200 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                {isAuthenticated ? "Go to Dashboard" : "Sign In"}
                <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Social proof strip */}
            <div
              className="flex items-center gap-3 mt-8 justify-center lg:justify-start animate-reveal-up"
              style={{ animationDelay: "600ms", animationFillMode: "both" }}
            >
              <div className="flex -space-x-2">
                {["Alex", "Jordan", "Sam", "Casey", "River"].map((name, i) => (
                  <div
                    key={name}
                    className="w-7 h-7 rounded-full border-2 border-background overflow-hidden"
                    style={{ zIndex: 5 - i }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=8b5cf6`}
                      alt={name}
                      className="w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">2,400+</span> creators generating content daily
              </div>
            </div>
          </div>

          {/* Right — Animated product preview */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
            {/* Main card */}
            <div className="glass-elevated rounded-3xl p-6 gradient-border relative overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.62_0.24_285_/_12%),transparent_60%)] pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Status header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.16_160)] animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">AI Script Engine</span>
                  </div>
                  <span className="label-chip text-[10px]">Live</span>
                </div>

                {/* Progress steps */}
                <div className="space-y-2">
                  {[
                    { label: "Viral hook generated", done: true },
                    { label: "Scene breakdown complete", done: true },
                    { label: "Hashtags optimized", done: true },
                    { label: "Thumbnail creating...", done: false, active: true },
                  ].map((step) => (
                    <div key={step.label} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/3 border border-white/5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done
                          ? "bg-[oklch(0.72_0.16_160_/_20%)] border border-[oklch(0.72_0.16_160_/_30%)]"
                          : step.active
                          ? "border border-[oklch(0.62_0.24_285_/_40%)] bg-[oklch(0.62_0.24_285_/_10%)]"
                          : "bg-white/5 border border-white/10"
                      }`}>
                        {step.done ? (
                          <svg className="w-3 h-3 text-[oklch(0.72_0.16_160)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : step.active ? (
                          <div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.24_285)] animate-pulse" />
                        ) : null}
                      </div>
                      <span className={`text-sm font-medium ${step.done ? "text-foreground/70" : step.active ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Script preview snippet */}
                <div className="rounded-xl bg-background/60 border border-white/7 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[oklch(0.62_0.24_285)] mb-2">🪝 Hook Generated</p>
                  <p className="text-sm text-foreground/85 leading-relaxed font-mono">
                    &quot;What if I told you the skills you&apos;re ignoring today will cost you your career tomorrow?&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -right-12 -top-4 w-52 hidden xl:block z-20">
              <ScriptPreviewCard
                delay={0}
                title="5 AI Tools That Will Replace Your Job"
                tag="YouTube Shorts"
              />
            </div>
            <div className="absolute -left-12 -bottom-4 w-52 hidden xl:block z-20">
              <ScriptPreviewCard
                delay={500}
                title="Morning Routine That Made Me $10K/Month"
                tag="Instagram Reels"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
