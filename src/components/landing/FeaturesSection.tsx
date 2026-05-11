import {
  Zap,
  ImageIcon,
  Layers,
  Hash,
  FileText,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    title: "Viral Hook Generator",
    description:
      "Your opening 5 seconds determine everything. Scriptly writes pattern-interrupt hooks that stop the scroll and demand attention — tailored to your niche and platform algorithm.",
  },
  {
    icon: FileText,
    color: "text-[oklch(0.82_0.14_195)]",
    bg: "bg-[oklch(0.82_0.14_195)]/10 border-[oklch(0.82_0.14_195)]/20",
    title: "Full Script, Scene by Scene",
    description:
      "Not just a script — a complete production blueprint. Get timed spoken-word copy plus a shot-by-shot scene breakdown so you step in front of the camera fully prepared.",
  },
  {
    icon: ImageIcon,
    color: "text-[oklch(0.65_0.27_330)]",
    bg: "bg-[oklch(0.65_0.27_330)]/10 border-[oklch(0.65_0.27_330)]/20",
    title: "AI Thumbnail Generation",
    description:
      "High-contrast, click-worthy thumbnail images generated from your title and hook. Download as PNG instantly. No Photoshop. No Canva. No designer required.",
  },
  {
    icon: Hash,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Platform-Optimized Hashtags",
    description:
      "15–20 hashtags per video, intelligently mixed: broad reach, medium engagement, and niche-specific tags. Engineered per platform — not a generic list.",
  },
  {
    icon: Layers,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
    title: "Project Organization",
    description:
      "Keep client work, personal brand, and niche content separate. Create named projects, organize scripts by campaign, and never lose a piece of generated content.",
  },
  {
    icon: RefreshCw,
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    title: "Regenerate Any Section",
    description:
      "Hate the CTA? Regenerate just that. Love the script but want a punchier hook? Done. Every section is independently editable and regeneratable without starting over.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-6">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Everything You Need
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            The full pre-production
            <br />
            <span className="gradient-text">stack. Minus the grind.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            What used to take hours of research, writing, and designing is now a
            single form submission. Every feature is built around one goal: more
            videos, less friction.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_oklch(0.6_0.24_275_/_10%)]"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${feature.bg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3
                  className="text-base font-bold text-foreground mb-2.5 leading-snug"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
