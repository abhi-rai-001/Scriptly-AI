import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[oklch(0.65_0.27_330)]/8 blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Join 2,000+ creators already using Scriptly</span>
        </div>

        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.05]"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Your next viral video
          <br />
          <span className="gradient-text">starts right now.</span>
        </h2>

        <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Stop staring at a blank page. Stop guessing at hooks. Start with a
          script that&apos;s designed to perform — in under 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold glow-primary transition-all hover:scale-105 group"
            )}
          >
            Generate Your First Script Free
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="mt-5 text-xs text-muted-foreground/50">
          No credit card · 3 free scripts per day · Cancel anytime
        </p>
      </div>
    </section>
  );
}
