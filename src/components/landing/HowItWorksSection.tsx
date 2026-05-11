import { ClipboardList, Cpu, Film, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Describe Your Video",
    description:
      "Tell Scriptly your topic, niche, platform, content style, and target duration. The form takes under 30 seconds to fill.",
    detail: "Topic · Niche · Platform · Style · Duration",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Builds Your Script",
    description:
      "Gemini AI executes 4 sequential generation steps — each one informed by the last — producing a title, hook, full script, scene breakdown, CTA, and hashtags.",
    detail: "Title → Hook → Script → Scenes → CTA → Hashtags",
  },
  {
    number: "03",
    icon: Film,
    title: "Generate Your Thumbnail",
    description:
      "One click turns your title and hook into a bold, platform-optimized AI thumbnail image. Preview it inline, then download as PNG.",
    detail: "AI image generation via Gemini",
  },
  {
    number: "04",
    icon: Download,
    title: "Save, Edit & Export",
    description:
      "Save to a project, edit any field inline, duplicate for A/B testing, then export as PDF, Markdown, or copy to clipboard.",
    detail: "PDF · Markdown · Clipboard",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[oklch(0.82_0.14_195)] mb-4">
            Simple by Design
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            From blank page to
            <br />
            <span className="gradient-text">camera-ready in 4 steps.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            No prompting experience needed. No AI expertise required. Fill a
            form, hit generate, ship the video.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center text-center group">
                  {/* Number + Icon */}
                  <div className="relative mb-6">
                    {/* Outer ring */}
                    <div className="w-24 h-24 rounded-2xl glass-card border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-[0_0_30px_oklch(0.6_0.24_275_/_15%)]">
                      <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{String(idx + 1).padStart(2, "0")}</span>
                    </div>
                  </div>

                  <h3
                    className="text-base font-bold text-foreground mb-2.5 leading-tight"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <span className="text-[11px] px-3 py-1 rounded-full border border-white/8 text-muted-foreground/60 font-mono">
                    {step.detail}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
