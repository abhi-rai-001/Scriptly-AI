import { ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Scriptly completely changed my workflow. What used to take 3 hours of staring at a blank page now takes 5 minutes. My retention rates have never been higher.",
    name: "Alex M.",
    role: "YouTube Creator · 1.2M subscribers",
    seed: "Alex",
  },
  {
    quote: "I was skeptical at first, but the hooks it generates are genuinely better than what I write myself. Went from 2% to 8% CTR on Shorts in a month.",
    name: "Jordan K.",
    role: "Content Strategist · Agency owner",
    seed: "Jordan",
  },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const testimonial = testimonials[0];

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Panel — Brand & Testimonial */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] relative flex-col justify-between p-12 overflow-hidden border-r border-white/6 flex-shrink-0">
        {/* Animated mesh background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 10%, oklch(0.62 0.24 285 / 14%) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 90%, oklch(0.80 0.18 85 / 8%) 0%, transparent 60%),
              oklch(0.14 0.007 285)
            `,
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center group">
            <span
              className="text-xl font-black tracking-[-0.02em] text-foreground"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Scriptly<span className="gradient-text-violet">AI</span>
            </span>
          </Link>
        </div>

        {/* Middle stats */}
        <div className="relative z-10 space-y-4">
          {[
            { value: "2,400+", label: "Active creators" },
            { value: "120K+", label: "Scripts generated" },
            { value: "8x", label: "Average CTR improvement" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl px-5 py-4 border border-white/7"
            >
              <p
                className="text-3xl font-black gradient-text mb-0.5"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="flex items-center gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[oklch(0.80_0.18_85)] text-[oklch(0.80_0.18_85)]" />
            ))}
          </div>
          <p className="text-lg font-medium leading-relaxed text-foreground/85 mb-5">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${testimonial.seed}&backgroundColor=8b5cf6`}
              alt={testimonial.name}
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <div>
              <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Mobile Brand */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="inline-flex items-center">
            <span
              className="text-base font-black tracking-[-0.02em] text-foreground"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Scriptly<span className="gradient-text-violet">AI</span>
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
