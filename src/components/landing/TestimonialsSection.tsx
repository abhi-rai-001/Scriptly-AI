import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    handle: "@priyacreates",
    avatar: "PS",
    avatarGradient: "from-pink-500 to-orange-400",
    role: "Lifestyle Creator · 240K followers",
    platform: "Instagram",
    quote:
      "I used to spend 2–3 hours writing scripts. With Scriptly, I'm done in under 10 minutes including the thumbnail. My posting frequency went from 3 reels a week to 10. The hooks it writes are genuinely better than what I was doing manually.",
    stats: { label: "Time saved", value: "2.5 hrs/script" },
  },
  {
    name: "Jordan Lee",
    handle: "@jordanfinance",
    avatar: "JL",
    avatarGradient: "from-blue-500 to-cyan-400",
    role: "Finance Creator · 89K followers",
    platform: "YouTube Shorts",
    quote:
      "The scene breakdowns are what sold me. I go into every shoot knowing exactly what to film, what to say, and when. No more winging it on camera. My average view duration went up 34% since I started using proper scripts.",
    stats: { label: "View duration", value: "+34%" },
  },
  {
    name: "Marcus Adeyemi",
    handle: "@marcusfitness",
    avatar: "MA",
    avatarGradient: "from-emerald-500 to-teal-400",
    role: "Fitness Creator · 512K followers",
    platform: "TikTok",
    quote:
      "Managing 4 client accounts as a solo social media manager was killing me. Scriptly cut my content production time in half. The project organization is perfect — each client has their own space and I'm never mixing up scripts.",
    stats: { label: "Clients managed", value: "4 → 8" },
  },
  {
    name: "Aisha Okafor",
    handle: "@aishastartups",
    avatar: "AO",
    avatarGradient: "from-purple-500 to-pink-400",
    role: "Tech Creator · 167K followers",
    platform: "Instagram",
    quote:
      "I tested 3 AI script tools before Scriptly. The others gave me generic output that sounded like every other tech creator. Scriptly actually understands my niche, matches my tone, and the hashtag strategy it uses is genuinely different — not just trending tags.",
    stats: { label: "Scripts generated", value: "200+" },
  },
  {
    name: "Tyler Kim",
    handle: "@tylerontravel",
    avatar: "TK",
    avatarGradient: "from-amber-500 to-orange-400",
    role: "Travel Creator · 390K followers",
    platform: "YouTube Shorts",
    quote:
      "I'm always traveling, often in places with spotty internet. Generating a full script in under 10 seconds and downloading it as PDF so I can review it offline — that's a game changer for how I plan content on the road.",
    stats: { label: "Videos/month", value: "40+" },
  },
  {
    name: "Camille Renard",
    handle: "@camillestyle",
    avatar: "CR",
    avatarGradient: "from-rose-500 to-pink-400",
    role: "Beauty Creator · 1.1M followers",
    platform: "TikTok",
    quote:
      "My editor told me my scripts were noticeably more structured after I started using Scriptly. The A/B duplication feature is something no other tool has — I can test two different hooks for the same video concept and pick the winner.",
    stats: { label: "Follower growth", value: "+180K in 3mo" },
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-28 px-6 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[oklch(0.65_0.27_330)]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[oklch(0.65_0.27_330)] mb-4">
            Creator Stories
          </p>
          <h2
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Creators who stopped
            <br />
            <span className="gradient-text-warm">winging it.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            From solo creators to agencies managing multiple accounts — here&apos;s
            what shipping with Scriptly looks like.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {testimonials.map((t) => (
            <div
              key={t.handle}
              className="break-inside-avoid glass-card rounded-2xl p-6 group hover:border-white/15 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.6_0.24_275_/_8%)]"
            >
              {/* Stars */}
              <StarRating />

              {/* Quote */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stat pill */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-[10px] text-muted-foreground/70">{t.stats.label}</span>
                <span className="text-xs font-bold text-primary">{t.stats.value}</span>
              </div>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-[11px] font-bold text-white">{t.avatar}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-none mb-0.5 truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.role}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-muted-foreground/60">
                    {t.platform}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
