"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for solo creators just getting started.",
    features: [
      "10 scripts per month",
      "3 thumbnail generations",
      "Instagram Reels + TikTok",
      "PDF export",
      "1 project",
    ],
    excluded: ["YouTube Shorts optimization", "Bulk generation", "Priority AI queue", "API access"],
    cta: "Start Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 19 },
    description: "For creators serious about growing their audience.",
    features: [
      "100 scripts per month",
      "Unlimited thumbnails",
      "All 3 platforms",
      "PDF + Markdown export",
      "Unlimited projects",
      "Priority AI queue",
      "YouTube Shorts optimization",
    ],
    excluded: ["API access"],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Agency",
    price: { monthly: 79, annual: 59 },
    description: "For teams, agencies, and high-volume producers.",
    features: [
      "Unlimited scripts",
      "Unlimited thumbnails",
      "All 3 platforms",
      "All export formats",
      "Unlimited projects",
      "Priority AI queue",
      "Bulk generation",
      "API access",
    ],
    excluded: [],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 relative" style={{ background: "oklch(0.14 0.007 285)" }}>
      <div className="absolute top-0 left-0 right-0 h-px section-divider pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px section-divider pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="label-chip inline-flex mb-6">Pricing</div>
          <h2
            className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-foreground mb-4"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Simple, honest pricing.
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
            No hidden fees. No surprise charges. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-secondary/40 border border-white/8 rounded-xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !annual ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                annual ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[oklch(0.72_0.16_160_/_15%)] text-[oklch(0.72_0.16_160)] border border-[oklch(0.72_0.16_160_/_25%)]">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                plan.highlight
                  ? "gradient-border glow-violet bg-[oklch(0.16_0.008_280)] md:-mt-4 md:-mb-4 md:py-10"
                  : "lux-card"
              }`}
            >
              {plan.highlight && (
                <div className="label-chip inline-flex self-start mb-4 text-[oklch(0.80_0.18_85)] bg-[oklch(0.80_0.18_85_/_10%)] border-[oklch(0.80_0.18_85_/_20%)]">
                  Most popular
                </div>
              )}

              <h3
                className="text-xl font-bold text-foreground mb-1"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span
                    className="text-5xl font-black text-foreground"
                    style={{ fontFamily: "var(--font-cabinet)" }}
                  >
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground text-sm mb-2">/mo</span>
                  )}
                </div>
                {plan.price.monthly > 0 && annual && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Billed annually · ${plan.price.annual * 12}/year
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-sm font-bold text-center transition-all duration-200 mb-8 ${
                  plan.highlight
                    ? "btn-amber shimmer"
                    : "glass border border-white/10 hover:border-white/20 text-foreground/80 hover:text-foreground"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[oklch(0.72_0.16_160_/_15%)] border border-[oklch(0.72_0.16_160_/_30%)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-[oklch(0.72_0.16_160)]" />
                    </div>
                    <span className="text-sm text-foreground/80">{f}</span>
                  </div>
                ))}
                {plan.excluded.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 opacity-35">
                    <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-px bg-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground line-through">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
