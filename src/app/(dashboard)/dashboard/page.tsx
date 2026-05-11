"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileVideo,
  TrendingUp,
  Sparkles,
  FolderOpen,
  Clock,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

// Brand icons not available in lucide-react v1.14.0
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type Platform = "instagram" | "youtube" | "tiktok";
type Status = "draft" | "ready" | "published";

interface ScriptCard {
  id: string;
  title: string;
  niche: string;
  platform: Platform;
  status: Status;
  createdAt: string;
  duration: string;
  thumbnail?: string;
}

// ─── Mock data ───────────────────────────────────────────
const MOCK_SCRIPTS: ScriptCard[] = [
  { id: "1", title: "5 AI Tools That Will Replace Your Job by 2026", niche: "Tech", platform: "youtube", status: "ready", createdAt: "2 hours ago", duration: "60s" },
  { id: "2", title: "Morning Routine That Made Me $10K/Month", niche: "Finance", platform: "instagram", status: "published", createdAt: "Yesterday", duration: "30s" },
  { id: "3", title: "I Tried 30 Days of Cold Showers — Here's What Happened", niche: "Wellness", platform: "tiktok", status: "draft", createdAt: "3 days ago", duration: "45s" },
  { id: "4", title: "The Dark Truth About Influencer Marketing", niche: "Marketing", platform: "youtube", status: "ready", createdAt: "4 days ago", duration: "60s" },
  { id: "5", title: "Why Your TikToks Are Flopping (Fix This Now)", niche: "Social Media", platform: "tiktok", status: "ready", createdAt: "5 days ago", duration: "30s" },
  { id: "6", title: "I Automated My Entire Content Business", niche: "Business", platform: "instagram", status: "draft", createdAt: "1 week ago", duration: "45s" },
];

const STATS = [
  { label: "Total Scripts", value: "24", icon: FileVideo, delta: "+3 this week", color: "text-primary" },
  { label: "Published", value: "18", icon: TrendingUp, delta: "+2 this week", color: "text-green-400" },
  { label: "AI Credits Left", value: "88", icon: Sparkles, delta: "of 100 monthly", color: "text-cyan-400" },
  { label: "Projects", value: "6", icon: FolderOpen, delta: "Across 3 niches", color: "text-violet-400" },
];

// ─── Platform helpers ─────────────────────────────────────
const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
  youtube: { label: "YouTube", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  tiktok: { label: "TikTok", icon: () => <span className="text-xs font-bold">TT</span>, color: "text-white", bg: "bg-white/10" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  ready: { label: "Ready", class: "bg-primary/10 text-primary border-primary/20" },
  published: { label: "Published", class: "bg-green-500/10 text-green-400 border-green-500/20" },
};

// ─── Sub-components ───────────────────────────────────────
function StatCard({ label, value, icon: Icon, delta, color }: typeof STATS[0]) {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:border-white/15 transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-white/5", color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className={cn("text-4xl font-bold tracking-tight", color)} style={{ fontFamily: "var(--font-syne)" }}>{value}</p>
      <p className="text-xs text-muted-foreground">{delta}</p>
    </div>
  );
}

function ScriptCardComponent({ script }: { script: ScriptCard }) {
  const platform = PLATFORM_CONFIG[script.platform];
  const status = STATUS_CONFIG[script.status];
  const PlatformIcon = platform.icon;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-white/15 transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.6_0.24_275_/_10%)]">
      {/* Thumbnail / Preview Header */}
      <div className="relative h-36 bg-gradient-to-br from-secondary to-background flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <Sparkles className="w-10 h-10 text-primary/30" />
        {/* Platform Badge */}
        <div className={cn("absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", platform.bg, platform.color)}>
          <PlatformIcon className="w-3 h-3" />
          {platform.label}
        </div>
        {/* Duration */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 text-xs text-white/70">
          <Clock className="w-3 h-3" />
          {script.duration}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2 flex-1">
            {script.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="w-7 h-7 flex-shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-40 bg-card border-white/10">
              <DropdownMenuItem className="text-sm cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                View Script
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">
                <Copy className="w-3.5 h-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-sm text-destructive cursor-pointer focus:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 border font-medium", status.class)}>
              {status.label}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border border-white/10 text-muted-foreground">
              {script.niche}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground/60">{script.createdAt}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <FileVideo className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
        No scripts yet
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
        Generate your first AI-powered script and start building your content library.
      </p>
      <Link href="/generate" className={cn(buttonVariants(), "bg-primary hover:bg-primary/90 text-primary-foreground glow-primary")}>
        <Plus className="w-4 h-4 mr-2" />
        Generate Your First Script
      </Link>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────
export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");

  const filtered = MOCK_SCRIPTS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = platform === "all" || s.platform === platform;
    return matchSearch && matchPlatform;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-syne)" }}>
          Welcome back 👋
        </h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your content today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* Scripts Section */}
      <div>
        {/* Section Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-syne)" }}>Recent Scripts</h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search scripts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-44 sm:w-56 bg-secondary/30 border-white/10 text-sm"
              />
            </div>
            {/* Platform Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="h-9 border-white/10 bg-secondary/30 text-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                  {platform === "all" ? "All Platforms" : PLATFORM_CONFIG[platform].label}
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-card border-white/10 w-36">
                {(["all", "instagram", "youtube", "tiktok"] as const).map((p) => (
                  <DropdownMenuItem key={p} className="text-sm cursor-pointer capitalize" onClick={() => setPlatform(p)}>
                    {p === "all" ? "All Platforms" : PLATFORM_CONFIG[p].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((script) => <ScriptCardComponent key={script.id} script={script} />)
          )}
        </div>
      </div>
    </div>
  );
}
