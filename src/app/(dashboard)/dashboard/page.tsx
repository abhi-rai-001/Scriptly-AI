"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGenerationStore } from "@/store/generationStore";
import {
  FileVideo,
  TrendingUp,
  Sparkles,
  FolderOpen,
  Clock,
  MoreHorizontal,
  Trash2,
  Copy,
  Plus,
  Search,
  SlidersHorizontal,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
type Platform = "instagram" | "youtube" | "youtube_shorts" | "tiktok";
type Status = "draft" | "ready" | "published" | string;

interface ScriptCard {
  id: string;
  title: string;
  niche: string;
  platform: Platform;
  status: Status;
  createdAt: string;
  duration: string;
  thumbnailUrl: string | null;
  projectId?: string | null;
  projectName?: string;
  viralScore?: number;
}

interface ProjectRow {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface ScriptRow {
  id: string;
  title: string;
  niche: string;
  platform: Platform;
  status: Status;
  created_at?: string;
  duration: string;
  project_id?: string | null;
  thumbnail_url?: string | null;
  viral_score?: number;
}

// ─── Brand SVG icons ──────────────────────────────────────
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

// ─── Platform config ──────────────────────────────────────
const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
  youtube: { label: "YouTube", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  youtube_shorts: { label: "YouTube Shorts", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  tiktok: { label: "TikTok", icon: () => <span className="text-xs font-bold">TT</span>, color: "text-white", bg: "bg-white/10" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  ready: { label: "Ready", class: "bg-[oklch(0.62_0.24_285_/_10%)] text-[oklch(0.72_0.20_285)] border-[oklch(0.62_0.24_285_/_20%)]" },
  published: { label: "Published", class: "bg-green-500/10 text-green-400 border-green-500/20" },
};

function formatRelativeTime(value?: string) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let duration = diffSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [threshold, nextUnit] of units) {
    if (Math.abs(duration) < threshold) {
      unit = nextUnit;
      break;
    }
    duration = Math.round(duration / threshold);
    unit = nextUnit;
  }

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-duration, unit);
}

function normalizePlatform(platform: string): Platform {
  if (platform === "youtube_shorts") return "youtube_shorts";
  if (platform === "instagram" || platform === "youtube" || platform === "tiktok") return platform;
  return "instagram";
}

function normalizeStatus(status: string): keyof typeof STATUS_CONFIG {
  if (status === "draft" || status === "ready" || status === "published") return status;
  return "draft";
}

// ─── Stat Card ────────────────────────────────────────────
interface StatItem {
  label: string;
  value: string;
  icon: typeof FileVideo;
  delta: string;
  accent: string;
  onClick?: () => void;
  active?: boolean;
}

function StatCard({ label, value, icon: Icon, delta, accent, onClick, active }: StatItem) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "lux-card rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300",
        active ? "ring-2 ring-primary/40 border-primary/20" : "hover:border-white/15"
      )}
      style={{ borderTop: `2px solid ${accent}${active ? '80' : '30'}` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}12` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
      </div>
      <p
        className="text-4xl font-black tracking-[-0.04em]"
        style={{ color: accent, fontFamily: "var(--font-cabinet)" }}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{delta}</p>
    </div>
  );
}

// ─── Script Card ─────────────────────────────────────────
function ScriptCardComponent({ 
  script, 
  handleDuplicate,
  handleDelete,
  handleMoveToProject,
  isActionLoading,
  projects,
}: { 
  script: ScriptCard; 
  handleDuplicate: (id: string) => void;
  handleDelete: (id: string) => void;
  handleMoveToProject: (scriptId: string, projectId: string | null) => void;
  isActionLoading: string | null;
  projects: ProjectRow[];
}) {
  const router = useRouter();
  const platform = PLATFORM_CONFIG[script.platform];
  const status = STATUS_CONFIG[normalizeStatus(script.status)];
  const PlatformIcon = platform.icon;

  return (
    <div 
      onClick={() => router.push(`/script/${script.id}`)}
      className="lux-card rounded-2xl overflow-hidden group border border-white/5 hover:border-[oklch(0.62_0.24_285_/_30%)] transition-all duration-300 cursor-pointer active:scale-[0.98]"
    >
      {/* Thumbnail area */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden bg-secondary/30">
        {script.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={script.thumbnailUrl} 
            alt={script.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Grid pattern fallback */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <Sparkles className="w-8 h-8 text-[oklch(0.62_0.24_285)] opacity-30" />
          </>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Platform badge */}
        <div className={cn("absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md", platform.bg, platform.color)}>
          <PlatformIcon className="w-3 h-3" />
          {platform.label}
        </div>
        {/* Duration */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white/90 backdrop-blur-md">
          <Clock className="w-2.5 h-2.5" />
          {script.duration}
        </div>

        {/* Viral Score Badge */}
        {script.viralScore !== undefined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[oklch(0.62_0.24_285_/_60%)] text-[10px] font-bold text-white backdrop-blur-md border border-white/10">
            <TrendingUp className="w-3 h-3" />
            {script.viralScore}%
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-sm font-semibold leading-snug text-foreground/90 line-clamp-2">
              {script.title}
            </h3>
            {script.projectName && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                <FolderOpen className="w-2.5 h-2.5" />
                {script.projectName}
              </div>
            )}
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 flex-shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 bg-card border-white/10">
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); router.push(`/script/${script.id}`); }}>
                <ExternalLink className="w-3.5 h-3.5 mr-2" /> View Script
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-sm cursor-pointer" onClick={(e) => e.stopPropagation()}>
                  <FolderOpen className="w-3.5 h-3.5 mr-2" /> Move to Project
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-card border-white/10 w-48">
                  <DropdownMenuItem 
                    className="text-sm cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); handleMoveToProject(script.id, null); }}
                    disabled={!script.projectId}
                  >
                    No Project (General)
                  </DropdownMenuItem>
                  {projects.length > 0 && <DropdownMenuSeparator className="bg-white/8" />}
                  {projects.map((p) => (
                    <DropdownMenuItem 
                      key={p.id}
                      className="text-sm cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleMoveToProject(script.id, p.id); }}
                      disabled={script.projectId === p.id}
                    >
                      {p.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator className="bg-white/8" />
              
              <DropdownMenuItem 
                className="text-sm cursor-pointer" 
                onClick={(e) => { e.stopPropagation(); handleDuplicate(script.id); }}
                disabled={isActionLoading === script.id}
              >
                {isActionLoading === script.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                Duplicate
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="text-sm text-destructive cursor-pointer focus:text-destructive" 
                onClick={(e) => { e.stopPropagation(); handleDelete(script.id); }}
                disabled={isActionLoading === script.id}
              >
                {isActionLoading === script.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 border font-semibold", status.class)}>
              {status.label}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border border-white/8 text-muted-foreground">
              {script.niche}
            </Badge>
          </div>
          <p className="text-[11px] text-muted-foreground/50">{formatRelativeTime(script.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────
function EmptyState() {
  const resetAll = useGenerationStore((state) => state.resetAll);
  const router = useRouter();

  const handleNewScript = (e: React.MouseEvent) => {
    e.preventDefault();
    resetAll();
    router.push("/generate");
  };

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 px-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden"
        style={{ background: "oklch(0.62 0.24 285 / 8%)", border: "1px solid oklch(0.62 0.24 285 / 20%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.24_285_/_15%),transparent_70%)]" />
        <FileVideo className="w-9 h-9 relative z-10" style={{ color: "oklch(0.62 0.24 285 / 50%)" }} />
      </div>
      <h3
        className="text-xl font-black mb-2 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-cabinet)" }}
      >
        Your content empire starts here.
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-8 leading-relaxed">
        Generate your first AI-powered script and start building a library that works while you sleep.
      </p>
      <button
        onClick={handleNewScript}
        className={cn("btn-amber px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2")}
      >
        <Plus className="w-4 h-4" />
        Generate Your First Script
      </button>
    </div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const projectFilter = searchParams.get("project");
  const [scripts, setScripts] = useState<ScriptCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<Platform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<keyof typeof STATUS_CONFIG | "all">("all");
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [scriptsResponse, projectsResponse] = await Promise.all([
        fetch("/api/scripts"),
        fetch("/api/projects"),
      ]);

      const scriptsData = await scriptsResponse.json().catch(() => null);
      const projectsData = await projectsResponse.json().catch(() => null);

       const rows = (scriptsData?.scripts || []) as ScriptRow[];
      const pData = (projectsData || []) as ProjectRow[];
      setProjects(pData);
      const projectMap = new Map(pData.map(p => [p.id, p.name]));

      const mappedScripts: ScriptCard[] = rows.map((script) => ({
        id: script.id,
        title: script.title || "Untitled Script",
        niche: script.niche || "General",
        platform: normalizePlatform(script.platform),
        status: script.status || "draft",
        createdAt: script.created_at || "",
        duration: script.duration || "",
        thumbnailUrl: script.thumbnail_url || null,
        projectId: script.project_id,
        viralScore: script.viral_score,
        projectName: script.project_id ? projectMap.get(script.project_id) : undefined,
      }));

      setScripts(mappedScripts);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch dashboard data on mount
    const fetchData = async () => {
      await loadDashboardData();
    };
    fetchData();
  }, [loadDashboardData]);

  const handleDuplicate = async (id: string) => {
    setIsActionLoading(id);
    try {
      const res = await fetch(`/api/scripts/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate script");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleMoveToProject = async (scriptId: string, projectId: string | null) => {
    setIsActionLoading(scriptId);
    try {
      const res = await fetch(`/api/scripts/${scriptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId }),
      });
      if (!res.ok) throw new Error("Failed to move script");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to move script");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this script?")) return;
    setIsActionLoading(id);
    try {
      const res = await fetch(`/api/scripts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete script");
    } finally {
      setIsActionLoading(null);
    }
  };

  const stats = useMemo<StatItem[]>(() => {
    const totalScripts = scripts.length;
    const published = scripts.filter((s) => s.status === "published").length;
    const drafts = scripts.filter((s) => s.status === "draft").length;
    const ready = scripts.filter((s) => s.status === "ready").length;

    return [
      { 
        label: "Total Scripts", 
        value: String(totalScripts), 
        icon: FileVideo, 
        delta: "Saved in DB", 
        accent: "oklch(0.62 0.24 285)",
        onClick: () => { setStatusFilter("all"); setPlatform("all"); },
        active: statusFilter === "all" && platform === "all"
      },
      { 
        label: "Published", 
        value: String(published), 
        icon: TrendingUp, 
        delta: "Live in library", 
        accent: "oklch(0.72 0.16 160)",
        onClick: () => setStatusFilter("published"),
        active: statusFilter === "published"
      },
      { 
        label: "Drafts", 
        value: String(drafts), 
        icon: Sparkles, 
        delta: "Awaiting save", 
        accent: "oklch(0.80 0.18 85)",
        onClick: () => setStatusFilter("draft"),
        active: statusFilter === "draft"
      },
      { 
        label: "Ready", 
        value: String(ready), 
        icon: FolderOpen, 
        delta: "Ready to post", 
        accent: "oklch(0.68 0.20 220)",
        onClick: () => setStatusFilter("ready"),
        active: statusFilter === "ready"
      },
    ];
  }, [scripts, statusFilter, platform]);

  const filtered = useMemo(
    () =>
      scripts.filter((s) => {
        const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.niche.toLowerCase().includes(search.toLowerCase());
        const matchPlatform = platform === "all" || s.platform === platform;
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        const matchProject = !projectFilter || s.projectId === projectFilter;
        return matchSearch && matchPlatform && matchStatus && matchProject;
      }),
    [platform, scripts, search, statusFilter, projectFilter]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-black tracking-[-0.03em] mb-1"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          Good evening. 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your content today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Scripts Section */}
      <div>
        {/* Section Header + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2
            className="text-lg font-bold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Recent Scripts
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search scripts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-44 sm:w-56 bg-secondary/40 border-white/8 text-sm rounded-xl"
              />
            </div>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className={cn(
                  "h-9 border-white/10 bg-secondary/30 text-sm rounded-xl",
                  statusFilter !== "all" && "border-primary/40 text-primary"
                )}>
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  {statusFilter === "all" ? "Any Status" : STATUS_CONFIG[statusFilter].label}
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-card border-white/10 w-40">
                {(["all", "draft", "ready", "published"] as const).map((s) => (
                  <DropdownMenuItem key={s} className="text-sm cursor-pointer capitalize" onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "Any Status" : STATUS_CONFIG[s].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Platform filter */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className={cn(
                  "h-9 border-white/10 bg-secondary/30 text-sm rounded-xl",
                  platform !== "all" && "border-primary/40 text-primary"
                )}>
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
                  {platform === "all" ? "All Platforms" : PLATFORM_CONFIG[platform].label}
                </Button>
              } />
              <DropdownMenuContent align="end" className="bg-card border-white/10 w-40">
                {(["all", "instagram", "youtube_shorts", "youtube", "tiktok"] as const).map((p) => (
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
          {loading ? (
            <div className="col-span-full py-24 text-center text-sm text-muted-foreground">Loading dashboard data...</div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((script) => (
              <ScriptCardComponent 
                key={script.id} 
                script={script} 
                projects={projects}
                handleDuplicate={handleDuplicate}
                handleDelete={handleDelete}
                handleMoveToProject={handleMoveToProject}
                isActionLoading={isActionLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
