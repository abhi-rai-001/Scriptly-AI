import { Check, Zap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: { monthly: "Free", annual: "Free" },
    description: "For creators just getting started with AI-assisted scripting.",
    cta: "Get Started Free",
    ctaHref: "/signup",
    highlight: false,
    features: [
      "3 script generations per day",
      "All 6 script sections (hook, script, scenes, CTA, hashtags)",
      "AI thumbnail generation",
      "1 project folder",
      "Export as Markdown",
      "Copy to clipboard",
    ],
    limit: "Up to 90 scripts/month",
  },
  {
    name: "Pro",
    price: { monthly: "$19", annual: "$15" },
    description: "For serious creators publishing consistently across platforms.",
    cta: "Start Pro Trial",
    ctaHref: "/signup?plan=pro",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited script generations",
      "All 6 script sections",
      "Unlimited AI thumbnail generation",
      "Unlimited project folders",
      "Export as PDF, Markdown & clipboard",
      "Regenerate individual sections",
      "Script duplication for A/B testing",
      "Priority generation (faster)",
    ],
    limit: "Unlimited",
  },
  {
    name: "Agency",
    price: { monthly: "$59", annual: "$49" },
    description: "For agencies and managers running multiple client accounts.",
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlight: false,
    features: [
      "Everything in Pro",
      "Up to 10 team workspaces",
      "Client-segregated projects",
      "Bulk script generation",
      "Custom prompt templates",
      "API access (coming soon)",
      "Dedicated Slack support",
      "Monthly strategy calls",
    ],
    limit: "Multi-seat",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-28 px-6">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Pricing
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Invest once.
            <br />
            <span className="gradient-text">Scale indefinitely.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Start free. No credit card. Upgrade when Scriptly has earned its
            place in your workflow.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 ${
                tier.highlight
                  ? "bg-primary/10 border border-primary/40 shadow-[0_0_60px_oklch(0.6_0.24_275_/_20%)] scale-[1.02]"
                  : "glass-card hover:border-white/15"
              }`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-primary px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg glow-primary">
                    <Zap className="w-3 h-3 fill-white" />
                    {tier.badge}
                  </div>
                </div>
              )}

              {/* Tier name */}
              <p
                className={`text-xs font-bold uppercase tracking-[0.15em] mb-2 ${
                  tier.highlight ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tier.name}
              </p>

              {/* Price */}
              <div className="mb-3">
                <span
                  className="text-5xl font-extrabold tracking-tight"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {tier.price.monthly}
                </span>
                {tier.price.monthly !== "Free" && (
                  <span className="text-muted-foreground text-sm ml-1">/month</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {tier.description}
              </p>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                className={cn(
                  buttonVariants({ className: "w-full h-11 font-semibold mb-7" }),
                  tier.highlight
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-white/10"
                )}
              >
                {tier.cta}
              </Link>

              {/* Divider */}
              <div className="h-px bg-white/8 mb-6" />

              {/* Feature list */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        tier.highlight
                          ? "bg-primary/20 text-primary"
                          : "bg-white/8 text-muted-foreground"
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Limit tag */}
              <div className="mt-6 pt-5 border-t border-white/8">
                <p className="text-[11px] text-center text-muted-foreground/50">
                  {tier.limit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-muted-foreground/50 mt-8">
          All plans include a 7-day free trial of Pro features · Cancel anytime · Prices in USD
        </p>
      </div>
    </section>
  );
}
