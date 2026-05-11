import { ReactNode } from "react";
import Link from "next/link";
import { Zap, Quote } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Panel - Branding & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/8">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[oklch(0.65_0.27_330)]/10 rounded-full blur-[100px]" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Scriptly<span className="gradient-text">AI</span>
            </span>
          </Link>
        </div>

        {/* Testimonial / Value Prop */}
        <div className="relative z-10 max-w-lg">
          <Quote className="w-10 h-10 text-primary/40 mb-6" />
          <p className="text-2xl font-medium leading-relaxed tracking-tight text-foreground/90 mb-6">
            "Scriptly completely changed my workflow. What used to take 3 hours of staring at a blank page now takes 5 minutes. My retention rates have never been higher."
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=8b5cf6"
              alt="Avatar"
              className="w-12 h-12 rounded-full border border-white/10"
            />
            <div>
              <p className="font-semibold text-foreground">Alex M.</p>
              <p className="text-sm text-muted-foreground">YouTube Creator (1.2M Subs)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Mobile Brand Header */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Scriptly
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
