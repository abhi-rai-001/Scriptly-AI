"use client";

// Fonts:
// https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Star,
  Video,
  Zap,
} from "lucide-react";

const services = [
  {
    title: "AI Script Generation",
    description: "Create viral hooks, full scripts, and scene breakdowns in seconds.",
    icon: Code2,
  },
  {
    title: "Thumbnail Generation",
    description: "Generate eye-catching AI thumbnails that stop the scroll.",
    icon: Sparkles,
  },
  {
    title: "Multi-Platform Support",
    description: "Optimized scripts for Instagram Reels, YouTube Shorts, and TikTok.",
    icon: Video,
  },
  {
    title: "Smart Organization",
    description: "Organize scripts by projects, niches, and platforms with ease.",
    icon: Layers,
  },
];

const processSteps = [
  {
    title: "Input Topic",
    description: "Tell us your topic, niche, platform, and content style.",
  },
  {
    title: "Generate Content",
    description: "AI creates a viral hook, full script, and scene breakdown.",
  },
  {
    title: "Generate Thumbnail",
    description: "Get a custom AI-generated thumbnail that matches your vibe.",
  },
  {
    title: "Export & Post",
    description: "Download as PDF, Markdown, or copy to clipboard instantly.",
  },
];

const caseStudies = [
  {
    title: "Tech Creators",
    category: "Educational Reels",
    summary:
      "Solo creators now produce 10 high-quality AI-scripted videos per week instead of 2, saving hours on ideation and scripting.",
    tags: ["AI Scripts", "Multiple Platforms", "Batch Export"],
  },
  {
    title: "Marketing Agencies",
    category: "Client Delivery",
    summary:
      "Agencies deliver branded video content to clients 5x faster with AI-generated scripts, hooks, and custom thumbnails.",
    tags: ["Project Management", "Bulk Generation", "PDF Export"],
  },
];

const techStack = [
  "AI Script Writing",
  "Viral Hook Generation",
  "Scene Breakdown",
  "AI Thumbnail Creation",
  "Multi-Niche Support",
  "Platform Optimization",
  "PDF & Markdown Export",
  "Project Organization",
];

const highlights = [
  "Scripts generated in seconds",
  "Works for all content creators",
  "Multiple export formats",
];

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const syncAuthState = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted) {
        setIsAuthenticated(Boolean(user));
      }
    };

    void syncAuthState();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(Boolean(session?.user));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);

    const elements = document.querySelectorAll<HTMLElement>("[data-animate]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const primaryAuthHref = isAuthenticated ? "/generate" : "/signup";
  const secondaryAuthHref = isAuthenticated ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-[#EDEAF7] font-(--font-ui)">
      <style jsx global>{`
        :root {
          --font-display: "Playfair Display", serif;
          --font-ui: "Manrope", system-ui, -apple-system, sans-serif;
          --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, SFMono-Regular, monospace;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
        }

        body {
          background: #0b0a0f;
        }

        .hero-item {
          opacity: 0;
          transform: translateY(20px);
          animation: hero-in 700ms var(--ease) forwards;
        }

        .hero-item.delay-1 {
          animation-delay: 120ms;
        }

        .hero-item.delay-2 {
          animation-delay: 240ms;
        }

        .hero-item.delay-3 {
          animation-delay: 360ms;
        }

        @keyframes hero-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 700ms var(--ease), transform 700ms var(--ease);
        }

        .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .grain::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
          opacity: 0.05;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        .shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: translateX(-120%);
          transition: transform 700ms var(--ease);
        }

        .shimmer:hover::after {
          transform: translateX(120%);
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0B0A0F]/70">
        <div className="mx-auto flex w-full max-w-300 items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#7C3AED] shadow-[0_0_16px_rgba(124,58,237,0.8)]" />
            Scriptly AI
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            {[
              "Services",
              "Process",
              "Work",
              "Stack",
              "Proof",
              "About",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={isAuthenticated ? "/generate" : "/login"} className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white md:inline-flex">
              {isAuthenticated ? "Generate" : "Login"}
            </Link>
            <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="relative overflow-hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0B0A0F] transition hover:scale-[1.02] inline-flex">
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <section className="relative grain">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.35),rgba(11,10,15,0.2)_55%,rgba(11,10,15,0.9))]" />
          <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.24),transparent_65%)] blur-3xl" />
          <div className="relative mx-auto flex w-full max-w-300 flex-col gap-16 px-6 pb-32 pt-40 md:flex-row md:items-center md:pt-44">
            <div className="flex-1">
              <div className="hero-item flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/60">
                <Sparkles className="h-4 w-4 text-[#7C3AED]" />
                AI reel workflow platform
              </div>
              <h1 className="hero-item delay-1 mt-6 text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
                <span className="font-(--font-display)">
                  Scriptly AI
                </span>{" "}
                <span className="bg-linear-to-r from-[#7C3AED] to-[#22D3EE] bg-clip-text text-transparent">
                  turns ideas into
                </span>{" "}
                <span className="font-(--font-display)">
                  viral videos.
                </span>
              </h1>
              <p className="hero-item delay-2 mt-6 max-w-[60ch] text-lg text-white/70">
                Generate AI-powered video scripts, hooks, scene breakdowns, and thumbnails for Instagram Reels, YouTube Shorts, and TikTok—all in one place.
              </p>
              <div className="hero-item delay-3 mt-8 flex flex-wrap items-center gap-4">
                <Link href={primaryAuthHref} className="relative overflow-hidden rounded-full bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,0.35)] transition hover:scale-[1.02] shimmer inline-flex">
                  {isAuthenticated ? "Open Generator" : "Generate Your First Script"}
                </Link>
                <Link href={secondaryAuthHref} className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white inline-flex">
                  {isAuthenticated ? "Go to Dashboard" : "Login"}
                </Link>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                  Free to start
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.22),transparent_55%)]" />
                <div className="relative space-y-8">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                    <span>Scriptly AI Core</span>
                    <span className="rounded-full border border-white/10 px-3 py-1">Active</span>
                  </div>
                  <div className="space-y-4">
                    {["AI Script Generation", "Viral Hook Creation", "Thumbnail Generation"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0F0D17]/80 px-5 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{item}</p>
                          <p className="text-xs text-white/50">Instant delivery</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                          <Zap className="h-5 w-5 text-[#22D3EE]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-linear-to-r from-white/5 to-transparent p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED]/20">
                        <Sparkles className="h-5 w-5 text-[#7C3AED]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Multi-Platform Optimization</p>
                        <p className="text-xs text-white/50">
                          Tailored scripts for Reels, Shorts, and TikTok.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-28">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Services</p>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                <h2 className="text-4xl font-semibold text-white md:text-5xl">
                  Everything creators need, in one place.
                </h2>
                <p className="max-w-[48ch] text-white/60">
                  From viral hooks to stunning thumbnails—generate all your video assets in minutes.
                </p>
              </div>
            </div>
            <div className="mt-14 space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#11101A] p-8 transition duration-500 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                        <service.icon className="h-6 w-6 text-[#7C3AED]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                        <p className="mt-2 max-w-[48ch] text-white/60">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                      <span>Module 0{index + 1}</span>
                      <ArrowRight className="h-4 w-4 text-[#22D3EE]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-28 bg-[#0F0D17]">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">How it works</p>
              <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
                Generate viral content in 4 simple steps.
              </h2>
            </div>
            <div className="mt-12 space-y-6">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="reveal flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#11101A] p-8 md:flex-row md:items-center md:justify-between"
                  data-animate
                >
                  <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-white/70">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm text-white/60">{step.description}</p>
                    </div>
                  </div>
                  <div className="h-1 w-28 rounded-full bg-linear-to-r from-[#7C3AED] to-[#22D3EE]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="py-28">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Selected work</p>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                <h2 className="text-4xl font-semibold text-white md:text-5xl">
                  Loved by creators and agencies.
                </h2>
                <p className="max-w-[48ch] text-white/60">
                  See how content creators and marketing teams are producing videos 5x faster with Scriptly AI.
                </p>
              </div>
            </div>
            <div className="mt-12 space-y-8">
              {caseStudies.map((study, index) => (
                <div
                  key={study.title}
                  className={`reveal flex flex-col gap-8 rounded-[32px] border border-white/10 bg-[#11101A] p-8 transition duration-500 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:flex-row md:items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  data-animate
                >
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                      {study.category}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{study.title}</h3>
                    <p className="mt-3 text-white/60">{study.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 via-transparent to-white/5 p-10">
                      <div className="space-y-4 text-sm text-white/70">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                          Unified AI workstreams
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#22D3EE]" />
                          Automated ops reporting
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-white/60" />
                          Revenue telemetry built-in
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack" className="py-28 bg-[#0F0D17]">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Tech stack</p>
              <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
                Powerful features for creators.
              </h2>
            </div>
            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-[#11101A]">
              <div className="flex flex-wrap">
                {techStack.map((tech) => (
                  <div
                    key={tech}
                    className="reveal flex w-1/2 items-center justify-center border-b border-white/5 px-4 py-6 text-sm text-white/70 md:w-1/3 lg:w-1/4"
                    data-animate
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
              {highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-4 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="py-28">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Social proof</p>
              <div className="mt-4 grid gap-8 md:grid-cols-[1.2fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-[#11101A] p-8">
                  <div className="flex items-center gap-2 text-[#FCD34D]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-6 text-2xl font-semibold text-white">
                    “Scriptly AI gave our team a single control plane for AI workflows. We cut
                    delivery time in half and finally got reliable automation.”
                  </p>
                  <p className="mt-4 text-sm text-white/60">
                    — Head of Product, B2B SaaS (placeholder)
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-[#11101A] p-6">
                    <p className="text-sm text-white/60">Enterprise outcomes</p>
                    <div className="mt-4 space-y-3 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> 42% faster workflow execution
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> 3x more AI adoption
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> Full audit trail
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#11101A] p-6">
                    <p className="text-sm text-white/60">Impact signals</p>
                    <div className="mt-4 space-y-3 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> MVP shipped in 10-14 days
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> AI automation baked-in
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#22D3EE]" /> Senior-level execution
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#11101A] p-6">
                    <p className="text-sm text-white/60">Security posture</p>
                    <p className="mt-3 text-sm text-white/70">
                      “Role-based access, audit logs, and AI guardrails are standard.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-28 bg-[#0F0D17]">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal" data-animate>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">About</p>
              <div className="mt-4 flex flex-col gap-10 md:flex-row md:items-center">
                <div>
                  <h2 className="text-4xl font-semibold text-white md:text-5xl">
                    Scriptly AI is built for modern SaaS operators.
                  </h2>
                  <p className="mt-6 text-white/60">
                    Centralize product intelligence, workflow automation, and AI execution in one
                    platform engineered for scale and reliability.
                  </p>
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      title: "Unified control plane",
                      description: "Monitor AI workflows, approvals, and output quality.",
                      icon: Sparkles,
                    },
                    {
                      title: "Operational visibility",
                      description: "Track impact, cost, and reliability in real time.",
                      icon: Code2,
                    },
                    {
                      title: "Automation at scale",
                      description: "Ship AI experiences with guardrails and governance.",
                      icon: Cpu,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-[#11101A] p-6"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-[#7C3AED]" />
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                      </div>
                      <p className="mt-3 text-sm text-white/60">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="py-32">
          <div className="mx-auto w-full max-w-300 px-6">
            <div className="reveal relative overflow-hidden rounded-[32px] border border-white/10 bg-linear-to-br from-[#11101A] via-[#0F0D17] to-[#0B0A0F] p-12" data-animate>
              <div className="absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle,rgba(124,58,237,0.4),transparent_70%)] blur-2xl" />
              <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Let’s build</p>
                  <h2 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
                    Stop wasting time on scripts. Start posting viral content.
                  </h2>
                  <p className="mt-4 text-white/60">
                    Join thousands of creators already generating videos with Scriptly AI.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Link href={primaryAuthHref} className="relative overflow-hidden rounded-full bg-[#7C3AED] px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(124,58,237,0.35)] transition hover:scale-[1.02] shimmer inline-flex justify-center">
                    {isAuthenticated ? "Open Generator" : "Start Free"}
                  </Link>
                  <Link href={secondaryAuthHref} className="rounded-full border border-white/15 px-6 py-4 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white inline-flex justify-center">
                    {isAuthenticated ? "View Dashboard" : "Login"}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <Check className="h-4 w-4 text-[#22D3EE]" />
                    No credit card required · Free forever plan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#0B0A0F]">
        <div className="mx-auto grid w-full max-w-300 gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Scriptly AI</p>
            <p className="mt-4 max-w-[40ch] text-sm text-white/60">
              The AI video script and thumbnail generator for content creators, social media managers, and agencies.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Studio</p>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>Platform</p>
              <p>Security</p>
              <p>Resources</p>
              <p>Roadmap</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p>hello@scriptly.ai</p>
              <p>LinkedIn · X</p>
              <p>Request demo</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
