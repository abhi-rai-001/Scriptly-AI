"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Plus,
  FileVideo,
  MoreHorizontal,
  Pencil,
  Trash2,
  ChevronRight,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  scriptCount: number;
  lastUpdated: string;
  color: string;
  accentColor: string;
}

// ─── Mock Data ────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Tech Reviews", scriptCount: 8, lastUpdated: "2 hours ago", color: "bg-[oklch(0.62_0.24_285_/_12%)]", accentColor: "oklch(0.62 0.24 285)" },
  { id: "2", name: "Personal Finance", scriptCount: 5, lastUpdated: "Yesterday", color: "bg-[oklch(0.72_0.16_160_/_12%)]", accentColor: "oklch(0.72 0.16 160)" },
  { id: "3", name: "Fitness Shorts", scriptCount: 12, lastUpdated: "3 days ago", color: "bg-[oklch(0.80_0.18_85_/_12%)]", accentColor: "oklch(0.80 0.18 85)" },
  { id: "4", name: "Motivational Vlogs", scriptCount: 3, lastUpdated: "5 days ago", color: "bg-[oklch(0.68_0.20_220_/_12%)]", accentColor: "oklch(0.68 0.20 220)" },
  { id: "5", name: "Product Unboxings", scriptCount: 6, lastUpdated: "1 week ago", color: "bg-[oklch(0.65_0.22_340_/_12%)]", accentColor: "oklch(0.65 0.22 340)" },
  { id: "6", name: "Travel Diaries", scriptCount: 2, lastUpdated: "2 weeks ago", color: "bg-[oklch(0.78_0.16_55_/_12%)]", accentColor: "oklch(0.78 0.16 55)" },
];

// ─── Create Project Modal ─────────────────────────────────
function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md lux-card rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-black tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            New Project
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-foreground/80">Project Name</label>
            <Input
              autoFocus
              placeholder="e.g. Tech Reviews, Fitness Shorts..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onCreate(name.trim()); }}
              className="h-11 bg-secondary/40 border-white/8 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 border-white/10 h-10 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button
              className="flex-1 btn-amber border-0 h-10 rounded-xl font-bold"
              disabled={!name.trim()}
              onClick={() => onCreate(name.trim())}
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Rename Inline ────────────────────────────────────────
function RenameInput({ value, onSave, onCancel }: { value: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [text, setText] = useState(value);
  return (
    <div className="flex items-center gap-2 flex-1">
      <Input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(text);
          if (e.key === "Escape") onCancel();
        }}
        className="h-8 flex-1 bg-secondary/40 border-[oklch(0.62_0.24_285_/_30%)] focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] text-sm rounded-lg"
      />
      <button onClick={() => onSave(text)} className="w-7 h-7 rounded-lg bg-[oklch(0.72_0.16_160_/_15%)] text-[oklch(0.72_0.16_160)] flex items-center justify-center hover:bg-[oklch(0.72_0.16_160_/_25%)] transition-colors">
        <Check className="w-3.5 h-3.5" />
      </button>
      <button onClick={onCancel} className="w-7 h-7 rounded-lg bg-white/5 text-muted-foreground flex items-center justify-center hover:bg-white/10 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────
function ProjectCard({ project, onRename, onDelete }: { project: Project; onRename: (id: string, name: string) => void; onDelete: (id: string) => void }) {
  const [renaming, setRenaming] = useState(false);

  return (
    <div
      className="lux-card rounded-2xl p-5 group"
      style={{ borderTop: `2px solid ${project.accentColor}30` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", project.color)}
          >
            <FolderOpen className="w-5 h-5" style={{ color: project.accentColor }} />
          </div>
          {renaming ? (
            <RenameInput
              value={project.name}
              onSave={(name) => { onRename(project.id, name); setRenaming(false); }}
              onCancel={() => setRenaming(false)}
            />
          ) : (
            <h3
              className="font-bold text-foreground truncate"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {project.name}
            </h3>
          )}
        </div>

        {!renaming && (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 rounded-lg">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="bg-card border-white/10 w-36">
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => setRenaming(true)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/8" />
              <DropdownMenuItem className="text-sm text-destructive cursor-pointer focus:text-destructive" onClick={() => onDelete(project.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs border-white/8 text-muted-foreground">
          <FileVideo className="w-3 h-3 mr-1" />
          {project.scriptCount} scripts
        </Badge>
        <span className="text-[11px] text-muted-foreground/50">Updated {project.lastUpdated}</span>
      </div>

      <Link
        href={`/dashboard?project=${project.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        style={{ color: project.accentColor }}
      >
        View Scripts
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 col-span-full">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden"
        style={{ background: "oklch(0.62 0.24 285 / 8%)", border: "1px solid oklch(0.62 0.24 285 / 20%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.24_285_/_15%),transparent_70%)]" />
        <FolderOpen className="w-9 h-9 relative z-10" style={{ color: "oklch(0.62 0.24 285 / 50%)" }} />
      </div>
      <h3
        className="text-xl font-black mb-2 tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-cabinet)" }}
      >
        Organize your content empire.
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-8 leading-relaxed">
        Group scripts by niche, client, or series to build a structured content library.
      </p>
      <Button
        onClick={onNew}
        className="btn-amber border-0 px-6 py-3 rounded-xl font-bold text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create First Project
      </Button>
    </div>
  );
}

// ─── Main Projects Page ───────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const ACCENT_COLORS = [
    { color: "bg-[oklch(0.62_0.24_285_/_12%)]", accentColor: "oklch(0.62 0.24 285)" },
    { color: "bg-[oklch(0.72_0.16_160_/_12%)]", accentColor: "oklch(0.72 0.16 160)" },
    { color: "bg-[oklch(0.80_0.18_85_/_12%)]", accentColor: "oklch(0.80 0.18 85)" },
    { color: "bg-[oklch(0.68_0.20_220_/_12%)]", accentColor: "oklch(0.68 0.20 220)" },
    { color: "bg-[oklch(0.65_0.22_340_/_12%)]", accentColor: "oklch(0.65 0.22 340)" },
    { color: "bg-[oklch(0.78_0.16_55_/_12%)]", accentColor: "oklch(0.78 0.16 55)" },
  ];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      
      const mapped = (data || []).map((p: any, i: number) => {
        const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
        const scriptCount = p.scripts?.[0]?.count || 0;
        return {
          id: p.id,
          name: p.name,
          scriptCount,
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "Just now",
          ...accent
        };
      });
      setProjects(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (name: string) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      await fetchProjects();
      setShowCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? All scripts will remain but will be uncategorized.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const totalScripts = projects.reduce((s, p) => s + p.scriptCount, 0);

  return (
    <>
      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}

      <div className="space-y-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground animate-pulse">Loading projects...</div>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-black tracking-[-0.03em] mb-1"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Projects
            </h1>
            <p className="text-sm text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · {totalScripts} total scripts
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="btn-amber border-0 font-bold h-10 px-5 rounded-xl text-sm self-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Total Scripts", value: totalScripts },
            { label: "Avg Scripts/Project", value: projects.length ? Math.round(totalScripts / projects.length) : 0 },
          ].map(({ label, value }) => (
            <div key={label} className="lux-card rounded-xl p-4 text-center">
              <p
                className="text-2xl font-black gradient-text"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.length === 0 ? (
            <EmptyState onNew={() => setShowCreate(true)} />
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRename={handleRename}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Tip */}
        {projects.length > 0 && (
          <div className="lux-card rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[oklch(0.72_0.20_285)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-semibold">Pro tip:</span> When generating a new script, assign it to a project to keep your content organized by niche or client.
            </p>
          </div>
        )}
          </>
        )}
      </div>
    </>
  );
}
