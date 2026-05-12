"use client";

import { useRef, useEffect, useState } from "react";
import { Code2, Sparkles, Video, Layers, Zap, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "AI Script Generation",
    description: "Receive a fully structured script with hook, body, CTA, and scene directions — crafted to retain attention from the first second.",
    accent: "oklch(0.62 0.24 285)",
    size: "large",
  },
  {
    icon: Sparkles,
    title: "Thumbnail Creation",
    description: "Generate scroll-stopping AI thumbnails that match your script's energy and platform aesthetic.",
    accent: "oklch(0.80 0.18 85)",
    size: "small",
  },
  {
    icon: Video,
    title: "Multi-Platform Optimized",
    description: "Scripts tailored for Instagram Reels, YouTube Shorts, and TikTok — each with unique pacing and format.",
    accent: "oklch(0.68 0.20 220)",
    size: "small",
  },
  {
    icon: Layers,
    title: "Smart Organization",
    description: "Group scripts into projects by niche, client, or series. Your content library, beautifully structured.",
    accent: "oklch(0.72 0.16 160)",
    size: "small",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description: "Download your script as PDF, Markdown, or copy to clipboard. Ready to post in seconds.",
    accent: "oklch(0.65 0.22 340)",
    size: "small",
  },
  {
    icon: TrendingUp,
    title: "Viral Hook Engine",
    description: "Every script opens with a psychologically optimized hook designed to stop the scroll in the first 3 seconds.",
    accent: "oklch(0.62 0.24 285)",
    size: "large",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const Icon = feature.icon;
  const isLarge = feature.size === "large";

  return (
    <div
      ref={cardRef}
      className={`lux-card rounded-2xl p-6 group cursor-default transition-all duration-500 ${
        isLarge ? "md:col-span-2 md:row-span-1" : ""
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        transitionDelay: `${index * 80}ms`,
        transition: `opacity 600ms cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, transform 600ms cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, border-color 300ms, box-shadow 300ms`,
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}25` }}
      >
        <Icon className="w-5 h-5" style={{ color: feature.accent }} />
      </div>

      <h3
        className="text-base font-bold text-foreground mb-2"
        style={{ fontFamily: "var(--font-cabinet)" }}
      >
        {feature.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div
        className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, ${feature.accent}60, transparent)` }}
      />
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-28 relative">
      {/* Section fade from hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <div className="label-chip inline-flex mb-6">Features</div>
          <h2
            className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-4"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Everything you need to
            <span className="gradient-text block">dominate your niche.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From viral hooks to stunning thumbnails — generate all your video assets in under a minute, for any platform.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Large card — spans 2 cols */}
          <FeatureCard feature={features[0]} index={0} />
          {/* Small cards */}
          <FeatureCard feature={features[1]} index={1} />
          <FeatureCard feature={features[2]} index={2} />
          <FeatureCard feature={features[3]} index={3} />
          {/* Large card — spans 2 cols */}
          <FeatureCard feature={features[4]} index={4} />
          <FeatureCard feature={features[5]} index={5} />
        </div>
      </div>
    </section>
  );
}
