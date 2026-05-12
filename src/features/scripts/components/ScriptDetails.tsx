"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import {
  ArrowLeft,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  MoreHorizontal,
  Pencil,
  CloudCheck,
  Cloud,
  Loader2,
  FileText,
  Download,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

// ─── Platform & Status Config ────────────────────────────

const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
  youtube: { label: "YouTube", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  youtube_shorts: { label: "YouTube Shorts", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  tiktok: { label: "TikTok", icon: () => <span className="font-bold text-xs">TT</span>, color: "text-white", bg: "bg-white/10" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ready: { label: "Ready", class: "bg-[oklch(0.72_0.16_160_/_10%)] text-[oklch(0.72_0.16_160)] border-[oklch(0.72_0.16_160_/_25%)]" },
  published: { label: "Published", class: "bg-[oklch(0.62_0.24_285_/_10%)] text-[oklch(0.62_0.24_285)] border-[oklch(0.62_0.24_285_/_25%)]" },
};

type ScriptPlatform = keyof typeof PLATFORM_CONFIG;
type ScriptStatus = keyof typeof STATUS_CONFIG;

interface ScriptRecord {
  id: string;
  title: string;
  niche: string;
  platform: ScriptPlatform;
  status: ScriptStatus;
  duration: string;
  createdAt: string;
  hook: string;
  intro: string;
  mainScript: string[];
  cta: string;
  hashtags: string[];
  scenes: string[];
  thumbnail_url: string | null;
  thumbnail_base64: string | null;
  project_id: string | null;
  viralScore?: number;
  viralAnalysis?: string;
}

type Section = 'title' | 'hook' | 'intro' | 'mainScript' | 'cta' | 'scenes' | 'hashtags' | 'project_id';

const SCRIPT_SECTIONS: { key: Section; label: string; emoji: string; isArray?: boolean }[] = [
  { key: "title", label: "Title", emoji: "📝" },
  { key: "hook", label: "Hook", emoji: "🪝" },
  { key: "intro", label: "Intro", emoji: "📣" },
  { key: "mainScript", label: "Main Script", emoji: "📝", isArray: true },
  { key: "cta", label: "Call To Action", emoji: "💥" },
  { key: "scenes", label: "Scene Directions", emoji: "🎬", isArray: true },
  { key: "hashtags", label: "Hashtags", emoji: "#", isArray: true },
];

function normalizePlatform(value: unknown): ScriptPlatform {
  if (
    value === "instagram" ||
    value === "youtube" ||
    value === "youtube_shorts" ||
    value === "tiktok"
  ) {
    return value;
  }
  return "youtube";
}

function normalizeStatus(value: unknown): ScriptStatus {
  if (value === "draft" || value === "ready" || value === "published") {
    return value;
  }
  return "draft";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "script";
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildExportMarkdown(script: ScriptRecord) {
  return [
    `# ${script.title}`,
    "",
    `**Platform:** ${PLATFORM_CONFIG[script.platform].label}`,
    `**Duration:** ${script.duration}`,
    `**Niche:** ${script.niche}`,
    "",
    "## Hook",
    script.hook,
    "",
    "## Intro",
    script.intro,
    "",
    "## Main Script",
    ...script.mainScript.map((line) => `- ${line}`),
    "",
    "## CTA",
    script.cta,
    "",
    "## Hashtags",
    script.hashtags.join(" "),
    "",
    "## Scene Directions",
    ...script.scenes.map((scene) => `- ${scene}`),
    "",
  ].join("\n");
}

function buildExportDocx(script: ScriptRecord) {
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: script.title,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Platform: ", bold: true }),
              new TextRun(PLATFORM_CONFIG[script.platform].label),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Duration: ", bold: true }),
              new TextRun(script.duration),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Niche: ", bold: true }),
              new TextRun(script.niche),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Hook", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(script.hook),
          new Paragraph({ text: "Intro", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(script.intro),
          new Paragraph({ text: "Main Script", heading: HeadingLevel.HEADING_1 }),
          ...script.mainScript.map(
            (line) =>
              new Paragraph({
                text: line,
                bullet: { level: 0 },
              })
          ),
          new Paragraph({ text: "CTA", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(script.cta),
          new Paragraph({ text: "Hashtags", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(script.hashtags.join(" ")),
          new Paragraph({ text: "Scene Directions", heading: HeadingLevel.HEADING_1 }),
          ...script.scenes.map(
            (scene) =>
              new Paragraph({
                text: scene,
                bullet: { level: 0 },
              })
          ),
        ],
      },
    ],
  });
}

// ─── EditableTextarea ────────────────────────────────────
function EditableText({
  value,
  onChange,
  multiline = false,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={multiline ? 4 : 2}
        className={cn(
          "w-full bg-secondary/40 border border-primary/30 rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed",
          className
        )}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className={cn(
        "text-sm text-foreground/85 leading-relaxed cursor-text rounded-xl px-3 py-2 -mx-3 -my-2 hover:bg-white/5 group/text flex items-start gap-2 transition-colors",
        className
      )}
    >
      <span className="flex-1">{value}</span>
      <Pencil className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover/text:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
    </div>
  );
}

// ─── ScriptSectionBlock ──────────────────────────────────
function SectionBlock({
  label,
  emoji,
  content,
  isArray,
  onChange,
}: {
  label: string;
  emoji: string;
  content: string | string[];
  isArray?: boolean;
  onChange: (v: string | string[]) => void;
}) {
  const [copied, setCopied] = useState(false);

  const text = Array.isArray(content) ? content.join("\n\n") : content;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lux-card rounded-2xl p-6 group">
      <div className="flex items-center justify-between mb-5">
        <h3
          className="text-xs font-black uppercase tracking-[0.15em] text-[oklch(0.62_0.24_285)]"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          {emoji} {label}
        </h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Copy section"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[oklch(0.72_0.16_160)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Regenerate section"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isArray && Array.isArray(content) ? (
        <ul className="space-y-3">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-primary/50 mt-0.5 text-xs flex-shrink-0 font-bold">{String(i + 1).padStart(2, "0")}.</span>
              <EditableText
                value={item}
                onChange={(v) => {
                  const updated = [...content] as string[];
                  updated[i] = v;
                  onChange(updated);
                }}
                multiline
                className="flex-1"
              />
            </li>
          ))}
        </ul>
      ) : (
        <EditableText
          value={typeof content === "string" ? content : content.join("  ")}
          onChange={(v) => onChange(v as string)}
          multiline
        />
      )}
    </div>
  );
}

function normalizeScriptResponse(data: Record<string, unknown>, fallbackId: string): ScriptRecord {
  const rawMainScript = typeof data.script === "string" ? data.script : "";
  const rawSceneBreakdown = Array.isArray(data.scene_breakdown) ? data.scene_breakdown : [];
  const rawHashtags = Array.isArray(data.hashtags) ? data.hashtags : [];

  return {
    id: typeof data.id === "string" ? data.id : fallbackId,
    title:
      typeof data.title === "string"
        ? data.title
        : typeof data.topic === "string"
          ? data.topic
          : "Untitled",
    niche: typeof data.niche === "string" ? data.niche : "",
    platform: normalizePlatform(data.platform),
    status: normalizeStatus(data.status),
    duration: typeof data.duration === "string" ? data.duration : "60s",
    createdAt:
      typeof data.created_at === "string"
        ? data.created_at
        : typeof data.createdAt === "string"
          ? data.createdAt
          : "",
    hook: typeof data.hook === "string" ? data.hook : "",
    intro: typeof data.intro === "string" ? data.intro : "",
    mainScript: rawMainScript.split("\n").filter((line) => line.trim().length > 0),
    cta: typeof data.cta === "string" ? data.cta : "",
    hashtags: rawHashtags.filter((tag): tag is string => typeof tag === "string"),
    scenes: rawSceneBreakdown
      .map((scene) => {
        if (typeof scene === "string") return scene;
        if (scene && typeof scene === "object" && "visual" in scene && typeof scene.visual === "string") {
          return scene.visual;
        }
        return "";
      })
      .filter((scene) => scene.length > 0),
    thumbnail_url: typeof data.thumbnail_url === "string" ? data.thumbnail_url : null,
    thumbnail_base64: typeof data.thumbnail_base64 === "string" ? data.thumbnail_base64 : null,
    project_id: typeof data.project_id === "string" ? data.project_id : null,
    viralScore: typeof data.viral_score === "number" ? data.viral_score : undefined,
    viralAnalysis: typeof data.viral_analysis === "string" ? data.viral_analysis : undefined,
  };
}

// ─── Main Component ──────────────────────────────────────
export default function ScriptDetails({ scriptId }: { scriptId: string }) {
  const router = useRouter();
  const [script, setScript] = useState<ScriptRecord | null>(null);
  const [loadingScript, setLoadingScript] = useState(true);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved">("saved");
  const [editingTitle, setEditingTitle] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSavingScript, setIsSavingScript] = useState(false);
  const [isDeletingScript, setIsDeletingScript] = useState(false);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadScript = async () => {
      if (!cancelled) {
        setLoadingScript(true);
        setActionError(null);
      }

      try {
        const response = await fetch(`/api/scripts/${scriptId}`);
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(data?.error || data?.message || "Failed to load script");
        }
        if (cancelled) return;
        setScript(normalizeScriptResponse((data || {}) as Record<string, unknown>, scriptId));
        setSaveState("saved");
      } catch (loadError: unknown) {
        if (cancelled) return;
        setScript(null);
        setActionError(loadError instanceof Error ? loadError.message : "Failed to load script");
      } finally {
        if (!cancelled) {
          setLoadingScript(false);
        }
      }
    };

    void loadScript();

    return () => {
      cancelled = true;
    };
  }, [scriptId]);

  const markUnsaved = useCallback(() => {
    setSaveState("unsaved");
  }, []);

  const updateField = (key: Section, value: string | string[]) => {
    setScript((prev) => (prev ? { ...prev, [key]: value } : prev));
    markUnsaved();
  };

  const handleSaveScript = useCallback(async (targetStatus?: ScriptStatus) => {
    if (!script || isSavingScript) return;

    setIsSavingScript(true);
    setActionError(null);
    setSaveState("saving");

    const payload = {
      title: script.title.trim() || "Untitled",
      niche: script.niche.trim(),
      platform: script.platform,
      duration: script.duration,
      hook: script.hook,
      script: script.mainScript.join("\n"),
      cta: script.cta,
      hashtags: script.hashtags.filter((tag) => tag.trim().length > 0),
      scene_breakdown: script.scenes.map((scene, index) => ({
        scene: index + 1,
        duration: script.duration,
        visual: scene,
        audio: "",
      })),
      thumbnail_url: script.thumbnail_url || undefined,
      status: targetStatus || script.status,
    };

    try {
      const response = await fetch(`/api/scripts/${script.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to save script");
      }
      setScript(normalizeScriptResponse((data || {}) as Record<string, unknown>, script.id));
      setSaveState("saved");
    } catch (saveError: unknown) {
      setSaveState("unsaved");
      setActionError(saveError instanceof Error ? saveError.message : "Failed to save script");
    } finally {
      setIsSavingScript(false);
    }
  }, [isSavingScript, script]);

  const handleDeleteScript = useCallback(async () => {
    if (!script || isDeletingScript) return;

    const shouldDelete = window.confirm("Delete this script? This action cannot be undone.");
    if (!shouldDelete) return;

    setIsDeletingScript(true);
    setActionError(null);
    try {
      const response = await fetch(`/api/scripts/${script.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to delete script");
      }
      router.push("/dashboard");
    } catch (deleteError: unknown) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Failed to delete script");
      setIsDeletingScript(false);
    }
  }, [isDeletingScript, router, script]);

  const handleExportPdf = useCallback(() => {
    if (!script) return;
    const popup = window.open("", "_blank", "noopener,noreferrer");
    if (!popup) {
      downloadBlob(buildExportMarkdown(script), `${slugify(script.title)}.md`, "text/markdown;charset=utf-8");
      return;
    }

    popup.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeXml(script.title)}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111827; }
            h1 { margin: 0 0 16px; }
            p, li { line-height: 1.6; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${escapeXml(script.title)}</h1>
          <p><strong>Platform:</strong> ${escapeXml(PLATFORM_CONFIG[script.platform].label)}</p>
          <p><strong>Duration:</strong> ${escapeXml(script.duration)}</p>
          <p><strong>Niche:</strong> ${escapeXml(script.niche)}</p>
          <h2>Hook</h2>
          <p>${escapeXml(script.hook)}</p>
          <h2>Intro</h2>
          <p>${escapeXml(script.intro)}</p>
          <h2>Main Script</h2>
          <ul>${script.mainScript.map((line) => `<li>${escapeXml(line)}</li>`).join("")}</ul>
          <h2>CTA</h2>
          <p>${escapeXml(script.cta)}</p>
          <h2>Hashtags</h2>
          <p>${escapeXml(script.hashtags.join(" "))}</p>
          <h2>Scene Directions</h2>
          <ul>${script.scenes.map((scene) => `<li>${escapeXml(scene)}</li>`).join("")}</ul>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
    setExportOpen(false);
  }, [script]);

  const handleCopyAll = useCallback(async () => {
    if (!script) return;
    await navigator.clipboard.writeText(buildExportMarkdown(script));
    setExportOpen(false);
  }, [script]);

  const handleExportMarkdown = useCallback(() => {
    if (!script) return;
    downloadBlob(buildExportMarkdown(script), `${slugify(script.title)}.md`, "text/markdown;charset=utf-8");
    setExportOpen(false);
  }, [script]);

  const handleExportDocx = useCallback(async () => {
    if (!script) return;
    const blob = await Packer.toBlob(buildExportDocx(script));
    downloadBlob(
      blob,
      `${slugify(script.title)}.docx`,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    setExportOpen(false);
  }, [script]);

  const handleExportJson = useCallback(() => {
    if (!script) return;
    const jsonString = JSON.stringify(script, null, 2);
    downloadBlob(jsonString, `${slugify(script.title)}.json`, "application/json");
    setExportOpen(false);
  }, [script]);

  const handleDuplicate = useCallback(async () => {
    if (!script || isActionLoading) return;
    setIsActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/scripts/${scriptId}/duplicate`, { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to duplicate");
      router.push(`/script/${data.id}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to duplicate");
    } finally {
      setIsActionLoading(false);
    }
  }, [script, isActionLoading, scriptId, router]);

  if (loadingScript) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="text-center text-muted-foreground">Loading script…</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="text-center text-destructive">Script not found or you don&apos;t have access.</div>
        {actionError ? (
          <div className="text-center text-sm text-muted-foreground mt-2">{actionError}</div>
        ) : null}
      </div>
    );
  }

  const platform = PLATFORM_CONFIG[script.platform];
  const status = STATUS_CONFIG[script.status];
  const PlatformIcon = platform.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-script-id={scriptId}>
      {/* Topbar: Back + Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          {/* Save State */}
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-medium transition-colors",
            saveState === "saved" ? "text-green-400" : saveState === "saving" ? "text-yellow-400" : "text-muted-foreground"
          )}>
            {saveState === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveState === "saved" ? (
              <CloudCheck className="w-3.5 h-3.5" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
            {saveState === "saved" ? "All changes saved" : saveState === "saving" ? "Saving..." : "Unsaved changes"}
          </div>

          <Button
            size="sm"
            className="btn-amber border-0 h-9 rounded-xl"
            onClick={() => void handleSaveScript(script.status === "draft" ? "ready" : undefined)}
            disabled={isSavingScript || isDeletingScript || (saveState === "saved" && script.status !== "draft")}
          >
            {isSavingScript ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <CloudCheck className="w-3.5 h-3.5 mr-2" />}
            {script.status === "draft" ? "Save Script" : "Save Changes"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 border-white/10 bg-white/5 rounded-xl"
            onClick={() => setExportOpen(true)}
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export
          </Button>

          {/* More actions */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-white/10 bg-white/5 rounded-xl">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="bg-card border-white/10 w-40">
              <DropdownMenuItem 
                className="text-sm cursor-pointer" 
                onClick={handleDuplicate}
                disabled={isActionLoading}
              >
                {isActionLoading ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-sm text-destructive cursor-pointer focus:text-destructive"
                onClick={handleDeleteScript}
                disabled={isDeletingScript}
              >
                {isDeletingScript ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                {isDeletingScript ? "Deleting..." : "Delete Script"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {actionError ? (
        <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm">
          {actionError}
        </div>
      ) : null}

      {/* Viral Prediction Card */}
      {script.viralScore !== undefined && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lux-card p-6 rounded-2xl overflow-hidden relative mb-8"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div className="flex flex-col md:flex-row gap-6 relative z-10">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[oklch(0.62_0.24_285_/_8%)] border border-[oklch(0.62_0.24_285_/_15%)] min-w-[120px]">
              <div className="text-sm font-bold text-[oklch(0.72_0.20_285)] mb-1">Viral Potential</div>
              <div className="text-4xl font-black text-foreground tracking-tighter" style={{ fontFamily: "var(--font-cabinet)" }}>
                {script.viralScore}%
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${script.viralScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[oklch(0.62_0.24_285)] to-[oklch(0.72_0.20_285)]" 
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 text-[oklch(0.72_0.20_285)]">
                <Zap className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider">AI Strategy Analysis</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                &quot;{script.viralAnalysis || "Our AI predicts this script has high retention potential due to its punchy hook and clear problem-solution framework."}&quot;
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card">
          <DialogHeader>
            <DialogTitle>Export script</DialogTitle>
            <DialogDescription>Choose the format you want to download.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button onClick={handleExportPdf} className="justify-start">
              <FileText className="w-3.5 h-3.5 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportMarkdown} className="justify-start border-white/10">
              <FileText className="w-3.5 h-3.5 mr-2" />
              Markdown
            </Button>
            <Button variant="outline" onClick={handleExportDocx} className="justify-start border-white/10">
              <FileText className="w-3.5 h-3.5 mr-2" />
              DOCX
            </Button>
            <Button variant="outline" onClick={handleExportJson} className="justify-start border-white/10">
              <FileText className="w-3.5 h-3.5 mr-2" />
              JSON
            </Button>
            <Button variant="ghost" onClick={handleCopyAll} className="justify-start text-muted-foreground">
              <Copy className="w-3.5 h-3.5 mr-2" />
              Copy all to clipboard
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)} className="border-white/10">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Script Header */}
      <div className="lux-card rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-secondary/50 to-background/50">
        <div className="grid md:grid-cols-[1fr_280px] gap-6 p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest border px-2.5 py-0.5", status.class)}>
                  {status.label}
                </Badge>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", platform.bg, platform.color)}>
                  <PlatformIcon className="w-3 h-3" />
                  {platform.label}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {script.duration}
                </div>
                <div className="flex items-center gap-2 ml-auto md:ml-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Project:</span>
                  <select
                    value={script.project_id || ""}
                    onChange={(e) => updateField("project_id", e.target.value || "")}
                    className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer hover:text-foreground transition-colors"
                    disabled={loadingProjects}
                  >
                    <option value="" className="bg-card">General</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} className="bg-card">{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {editingTitle ? (
                <input
                  autoFocus
                  value={script.title}
                  onChange={(e) => setScript((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
                  onBlur={() => { setEditingTitle(false); markUnsaved(); }}
                  className="w-full bg-transparent border-b border-[oklch(0.62_0.24_285_/_40%)] text-3xl font-black text-foreground focus:outline-none pb-1"
                  style={{ fontFamily: "var(--font-cabinet)" }}
                />
              ) : (
                <h1
                  onClick={() => setEditingTitle(true)}
                  className="text-3xl font-black tracking-[-0.03em] cursor-text hover:text-[oklch(0.62_0.24_285)] transition-colors flex items-center gap-3 group/title"
                  style={{ fontFamily: "var(--font-cabinet)" }}
                >
                  {script.title}
                  <Pencil className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                </h1>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Niche</span>
                <span className="text-sm font-semibold">{script.niche || "General"}</span>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Created</span>
                <span className="text-sm font-semibold text-muted-foreground">{new Date(script.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail preview */}
          <div className="relative group/thumb">
             <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-xl opacity-50 group-hover/thumb:opacity-100 transition-opacity duration-500" />
             <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
              {script.thumbnail_url || script.thumbnail_base64 ? (
                <Image
                  src={script.thumbnail_url ?? (script.thumbnail_base64?.startsWith('data:') ? script.thumbnail_base64 : `data:image/webp;base64,${script.thumbnail_base64}`)}
                  alt="Thumbnail"
                  fill
                  className="object-cover transition-transform duration-700 group-hover/thumb:scale-110"
                  unoptimized={!!script.thumbnail_base64}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                  <Sparkles className="w-8 h-8" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Thumbnail</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
              <Button 
                variant="secondary" 
                size="sm" 
                className="absolute bottom-3 right-3 h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/thumb:opacity-100 translate-y-2 group-hover/thumb:translate-y-0 transition-all duration-300 shadow-xl"
                onClick={() => router.push("/generate/thumbnail")}
              >
                Regenerate
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Script Sections */}
      <div className="space-y-4">
        {SCRIPT_SECTIONS.map((section) => (
          <SectionBlock
            key={section.key}
            label={section.label}
            emoji={section.emoji}
            content={script[section.key] as string | string[]}
            isArray={section.isArray}
            onChange={(v) => updateField(section.key, v)}
          />
        ))}
      </div>

      {/* Thumbnail Generator */}
      <div className="lux-card rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3
              className="text-xs font-black uppercase tracking-[0.15em] text-[oklch(0.62_0.24_285)]"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              🖼 Thumbnail Generator
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Open the dedicated thumbnail UI to generate a new thumbnail with the default prompt or your own custom prompt.
            </p>
          </div>
          <Button
            onClick={() => router.push("/generate/thumbnail")}
            className="btn-amber border-0 h-10 rounded-xl font-bold px-5"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            Open Thumbnail Generator
          </Button>
        </div>
      </div>
    </div>
  );
}
