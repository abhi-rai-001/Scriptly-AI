"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Scriptly completely changed my workflow. What used to take 3 hours of staring at a blank page now takes 5 minutes. My retention rates have never been higher.",
    name: "Alex M.",
    role: "YouTube Creator",
    stats: "1.2M subscribers",
    seed: "Alex",
    stars: 5,
  },
  {
    quote: "I was skeptical at first, but the hooks it generates are genuinely better than what I write myself. Went from 2% to 8% CTR on Shorts in a month.",
    name: "Jordan K.",
    role: "Content Strategist",
    stats: "Agency owner",
    seed: "Jordan",
    stars: 5,
  },
  {
    quote: "As a solo creator juggling 3 channels, Scriptly is the only tool that actually saves me meaningful time. The scene breakdowns alone are worth it.",
    name: "Priya S.",
    role: "TikTok Creator",
    stats: "890K followers",
    seed: "Priya",
    stars: 5,
  },
  {
    quote: "I use it for all my clients now. The quality of the scripts is consistent every single time — something I could never guarantee when writing manually.",
    name: "Marcus T.",
    role: "Social Media Manager",
    stats: "14 brand clients",
    seed: "Marcus",
    stars: 5,
  },
  {
    quote: "The thumbnail generator paired with the script is a game changer. My design team used to spend hours on thumbnails. Now I generate them in 30 seconds.",
    name: "Chloe W.",
    role: "Brand Founder",
    stats: "Lifestyle & wellness",
    seed: "Chloe",
    stars: 5,
  },
  {
    quote: "Scriptly's hooks are different — they feel human. Not like other AI tools that generate robotic filler. This actually sounds like how I talk.",
    name: "Devon R.",
    role: "Finance Creator",
    stats: "2.4M on TikTok",
    seed: "Devon",
    stars: 5,
  },
  {
    quote: "For our agency, this replaced an entire content writing role. We now produce 5x more scripts per week at a fraction of the previous cost.",
    name: "Neha P.",
    role: "Creative Director",
    stats: "B2B SaaS agency",
    seed: "Neha",
    stars: 5,
  },
  {
    quote: "I've tried every AI tool out there. Scriptly is the first one that actually understands content — not just text generation.",
    name: "Sam O.",
    role: "Growth Consultant",
    stats: "Ex-Meta",
    seed: "Sam",
    stars: 5,
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="lux-card rounded-2xl p-5 w-72 flex-shrink-0 group hover:scale-[1.02] transition-transform duration-300">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[oklch(0.80_0.18_85)] text-[oklch(0.80_0.18_85)]" />
        ))}
      </div>
      {/* Quote */}
      <p className="text-sm text-foreground/80 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{t.quote}&rdquo;
      </p>
      {/* Author */}
      <div className="flex items-center gap-3 mt-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${t.seed}&backgroundColor=8b5cf6`}
          alt={t.name}
          className="w-9 h-9 rounded-full border border-white/10"
        />
        <div>
          <p className="text-sm font-semibold text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role} · {t.stats}</p>
        </div>
      </div>
    </div>
  );
}

export default function LuxTestimonials() {
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section id="testimonials" className="py-28 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 mb-14">
        <div className="label-chip inline-flex mb-6">Social proof</div>
        <h2
          className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground max-w-xl"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          Loved by creators{" "}
          <span className="gradient-text">who move fast.</span>
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 w-max animate-marquee-left hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex gap-4 w-max animate-marquee-right hover:[animation-play-state:paused]">
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
