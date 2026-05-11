"use client";

import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Describe your idea",
    description: "Enter your topic, niche, target platform, and preferred content style. The more specific, the better the output.",
    detail: "Takes 30 seconds",
  },
  {
    number: "02",
    title: "AI writes your script",
    description: "Our model crafts a psychologically-optimized hook, full body script, scene breakdown, CTA, and 20+ hashtags — all in one go.",
    detail: "Generated in ~10 seconds",
  },
  {
    number: "03",
    title: "Generate the thumbnail",
    description: "One click produces a platform-native AI thumbnail that's tuned for click-through rate and matches your script's energy.",
    detail: "AI visual in seconds",
  },
  {
    number: "04",
    title: "Export and post",
    description: "Download as PDF or Markdown, copy to clipboard, or save to a project. Your content is ready to publish immediately.",
    detail: "Multiple export formats",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex items-start gap-8 md:gap-16 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Step number */}
      <div className="flex-shrink-0 relative">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl lux-card flex items-center justify-center relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.24_285_/_10%),transparent_70%)]" />
          <span
            className="text-2xl md:text-3xl font-black gradient-text-violet relative z-10"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            {step.number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-2 md:pt-4">
        <div className="flex items-center gap-3 mb-3">
          <h3
            className="text-xl md:text-2xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            {step.title}
          </h3>
          <span className="label-chip text-[10px] shrink-0">{step.detail}</span>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed max-w-[52ch]">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function LuxProcess() {
  return (
    <section id="process" className="py-28 relative" style={{ background: "oklch(0.14 0.007 285)" }}>
      {/* Fade borders */}
      <div className="absolute top-0 left-0 right-0 h-px section-divider pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px section-divider pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-20 max-w-xl">
          <div className="label-chip inline-flex mb-6">How it works</div>
          <h2
            className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-4"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Viral content in{" "}
            <span className="gradient-text-amber">4 simple steps.</span>
          </h2>
          <p className="text-base text-muted-foreground">
            No learning curve. No setup. From topic to publish-ready content in under two minutes.
          </p>
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 md:left-10 top-10 bottom-10 w-px"
            style={{ background: "linear-gradient(to bottom, oklch(0.62 0.24 285 / 40%), oklch(0.80 0.18 85 / 20%), transparent)" }} />

          <div className="relative flex flex-col gap-20">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
