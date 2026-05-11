"use client";

import { useState } from "react";
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
import { buttonVariants } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────
interface Project {
  id: string;
  name: string;
  scriptCount: number;
  lastUpdated: string;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Tech Reviews", scriptCount: 8, lastUpdated: "2 hours ago", color: "bg-cyan-500/20 text-cyan-400" },
  { id: "2", name: "Personal Finance", scriptCount: 5, lastUpdated: "Yesterday", color: "bg-green-500/20 text-green-400" },
  { id: "3", name: "Fitness Shorts", scriptCount: 12, lastUpdated: "3 days ago", color: "bg-orange-500/20 text-orange-400" },
  { id: "4", name: "Motivational Vlogs", scriptCount: 3, lastUpdated: "5 days ago", color: "bg-violet-500/20 text-violet-400" },
  { id: "5", name: "Product Unboxings", scriptCount: 6, lastUpdated: "1 week ago", color: "bg-pink-500/20 text-pink-400" },
  { id: "6", name: "Travel Diaries", scriptCount: 2, lastUpdated: "2 weeks ago", color: "bg-yellow-500/20 text-yellow-400" },
];

// ─── Create Project Modal ─────────────────────────────────
function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl border border-white/15 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-syne)" }}>New Project</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Project Name</label>
            <Input
              autoFocus
              placeholder="e.g. Tech Reviews, Fitness Shorts..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onCreate(name.trim()); }}
              className="h-11 bg-secondary/30 border-white/10 focus-visible:ring-primary/50"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 border-white/10 h-10" onClick={onClose}>Cancel</Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 glow-primary"
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
        className="h-8 flex-1 bg-secondary/40 border-primary/30 focus-visible:ring-primary/40 text-sm"
      />
      <button onClick={() => onSave(text)} className="w-7 h-7 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30 transition-colors">
        <Check className="w-3.5 h-3.5" />
      </button>
      <button onClick={onCancel} className="w-7 h-7 rounded-lg bg-secondary/50 text-muted-foreground flex items-center justify-center hover:bg-secondary transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────
function ProjectCard({ project, onRename, onDelete }: { project: Project; onRename: (id: string, name: string) => void; onDelete: (id: string) => void }) {
  const [renaming, setRenaming] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-white/18 transition-all duration-300 group hover:shadow-[0_0_30px_oklch(0.6_0.24_275_/_8%)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", project.color.split(" ")[0])}>
            <FolderOpen className={cn("w-5 h-5", project.color.split(" ")[1])} />
          </div>
          {renaming ? (
            <RenameInput
              value={project.name}
              onSave={(name) => { onRename(project.id, name); setRenaming(false); }}
              onCancel={() => setRenaming(false)}
            />
          ) : (
            <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          )}
        </div>

        {!renaming && (
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="bg-card border-white/10 w-36">
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={() => setRenaming(true)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-sm text-destructive cursor-pointer focus:text-destructive" onClick={() => onDelete(project.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
          <FileVideo className="w-3 h-3 mr-1" />
          {project.scriptCount} scripts
        </Badge>
        <span className="text-[11px] text-muted-foreground/60">Updated {project.lastUpdated}</span>
      </div>

      {/* CTA */}
      <Link
        href={`/dashboard?project=${project.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
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
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <FolderOpen className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>No projects yet</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-8">
        Organise your scripts into projects by niche, client, or content series.
      </p>
      <Button onClick={onNew} className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary">
        <Plus className="w-4 h-4 mr-2" />
        Create First Project
      </Button>
    </div>
  );
}

// ─── Main Projects Page ───────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showCreate, setShowCreate] = useState(false);

  const COLORS = [
    "bg-cyan-500/20 text-cyan-400",
    "bg-green-500/20 text-green-400",
    "bg-violet-500/20 text-violet-400",
    "bg-pink-500/20 text-pink-400",
    "bg-orange-500/20 text-orange-400",
    "bg-yellow-500/20 text-yellow-400",
  ];

  const handleCreate = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      scriptCount: 0,
      lastUpdated: "Just now",
      color: COLORS[projects.length % COLORS.length],
    };
    setProjects((prev) => [newProject, ...prev]);
    setShowCreate(false);
  };

  const handleRename = (id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const totalScripts = projects.reduce((s, p) => s + p.scriptCount, 0);

  return (
    <>
      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-syne)" }}>Projects</h1>
            <p className="text-sm text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · {totalScripts} total scripts
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-primary h-10 self-start"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Total Scripts", value: totalScripts },
            { label: "Avg Scripts/Project", value: projects.length ? Math.round(totalScripts / projects.length) : 0 },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card rounded-xl p-4 text-center border border-white/8">
              <p className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-syne)" }}>{value}</p>
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
          <div className="glass rounded-xl p-4 flex items-start gap-3 border border-white/8">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Tip:</span> When generating a new script, assign it to a project to keep your content organised by niche or client.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
