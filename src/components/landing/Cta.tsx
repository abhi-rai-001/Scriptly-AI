"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Cta() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Mesh gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, oklch(0.62 0.24 285 / 15%) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 mesh-bg opacity-50" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <div className="label-chip inline-flex mb-8">
          <Sparkles className="w-3 h-3" />
          Start for free · No credit card required
        </div>

        {/* Headline */}
        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-foreground mb-6 leading-[1.02]"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          Your first viral script
          <span className="gradient-text block">is one click away.</span>
        </h2>

        <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto mb-12 leading-relaxed">
          Join thousands of creators who stopped struggling with blank pages and started publishing content that actually performs.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="btn-amber shimmer px-10 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4" />
            Generate My First Script — Free
          </Link>
          <Link
            href="#features"
            className="glass px-8 py-4 rounded-xl text-base font-semibold text-foreground/70 hover:text-foreground transition-colors border border-white/8 hover:border-white/14"
          >
            See all features
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
          {[
            { label: "No credit card needed", icon: "🔒" },
            { label: "Cancel anytime", icon: "✦" },
            { label: "10 free scripts included", icon: "🎁" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
