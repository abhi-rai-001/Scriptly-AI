"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

// ─── Mock Script Data ─────────────────────────────────────
const MOCK_SCRIPT = {
  id: "1",
  title: "5 AI Tools That Will Replace Your Job by 2026",
  niche: "Tech",
  platform: "youtube" as const,
  status: "ready" as const,
  duration: "60s",
  createdAt: "May 11, 2026",
  hook: "What if I told you the tools you're ignoring today will cost you your career tomorrow?",
  intro: "AI isn't coming for your job. It's already here. And most people have no idea which tools are spreading through every industry right now. I've spent 6 months testing 40+ AI tools. These 5 are the ones I'd be terrified to not know if I were starting from scratch.",
  mainScript: [
    "Tool #1 is Perplexity AI — a research assistant that's 10x faster than Google for finding cited, verified information. Journalists, lawyers, researchers, all at risk.",
    "Tool #2 is Runway ML — it generates, edits, and enhances video with text commands. No editing skills needed. Video editors, take note.",
    "Tool #3 is ElevenLabs — voice cloning that's indistinguishable from human speech in 30 languages. Voice-over artists, the clock is ticking.",
    "Tool #4 is Cursor — an AI coding IDE that writes entire features from a comment. Junior developers are already feeling this.",
    "Tool #5 is Scriptly AI — it generates full high-retention video scripts from a topic in under 60 seconds. I literally used it for this video.",
  ],
  cta: "If you want to survive the AI wave — you need to become the person who uses these tools, not the person who gets replaced by them. Follow for next week's breakdown of the 5 AI tools coming in 2027 that nobody's talking about yet.",
  hashtags: ["#aitools", "#artificialintelligence", "#futureofwork", "#techjobs", "#automation", "#contentcreator", "#youtubetech"],
  scenes: [
    "Scene 1: B-roll of various job titles flashing on screen (lawyer, journalist, editor, coder)",
    "Scene 2: Screen recording of each AI tool running in real time",
    "Scene 3: Split screen — 'Before AI' (stressed) vs 'After AI' (relaxed, efficient)",
    "Scene 4: CTA card appearing with social handle and follow prompt",
  ],
};

type Section = keyof typeof MOCK_SCRIPT;

const SCRIPT_SECTIONS: { key: Section; label: string; emoji: string; isArray?: boolean }[] = [
  { key: "hook", label: "Hook", emoji: "🪝" },
  { key: "intro", label: "Intro", emoji: "📣" },
  { key: "mainScript", label: "Main Script", emoji: "📝", isArray: true },
  { key: "cta", label: "Call To Action", emoji: "💥" },
  { key: "scenes", label: "Scene Directions", emoji: "🎬", isArray: true },
  { key: "hashtags", label: "Hashtags", emoji: "#" },
];

const PLATFORM_CONFIG = {
  instagram: { label: "Instagram", icon: InstagramIcon, color: "text-pink-400", bg: "bg-pink-500/10" },
  youtube: { label: "YouTube", icon: YoutubeIcon, color: "text-red-400", bg: "bg-red-500/10" },
  tiktok: { label: "TikTok", icon: () => <span className="font-bold text-xs">TT</span>, color: "text-white", bg: "bg-white/10" },
};

const STATUS_CONFIG = {
  draft: { label: "Draft", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ready: { label: "Ready", class: "bg-[oklch(0.72_0.16_160_/_10%)] text-[oklch(0.72_0.16_160)] border-[oklch(0.72_0.16_160_/_25%)]" },
  published: { label: "Published", class: "bg-[oklch(0.62_0.24_285_/_10%)] text-[oklch(0.62_0.24_285)] border-[oklch(0.62_0.24_285_/_25%)]" },
};

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

function buildExportMarkdown(script: typeof MOCK_SCRIPT) {
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

function buildThumbnailSvg(script: typeof MOCK_SCRIPT) {
  const title = escapeXml(script.title.slice(0, 54));
  const hook = escapeXml(script.hook.slice(0, 96));
  const niche = escapeXml(script.niche);
  const platform = escapeXml(PLATFORM_CONFIG[script.platform].label);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2f134f" />
      <stop offset="45%" stop-color="#111827" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)" />
  <circle cx="1090" cy="120" r="220" fill="#a855f7" opacity="0.18" />
  <circle cx="180" cy="610" r="260" fill="#2563eb" opacity="0.14" />
  <rect x="72" y="72" width="220" height="54" rx="27" fill="rgba(255,255,255,0.08)" />
  <text x="122" y="108" fill="#f8fafc" font-size="26" font-weight="700" font-family="Arial, sans-serif">${platform}</text>
  <rect x="72" y="160" width="1136" height="312" rx="36" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" />
  <text x="120" y="262" fill="#f8fafc" font-size="68" font-weight="800" font-family="Arial, sans-serif">${title}</text>
  <text x="120" y="345" fill="#d1d5db" font-size="34" font-weight="500" font-family="Arial, sans-serif">${hook}</text>
  <rect x="120" y="390" width="280" height="12" rx="6" fill="url(#accent)" />
  <text x="72" y="608" fill="#cbd5e1" font-size="28" font-weight="600" font-family="Arial, sans-serif">${niche}</text>
  <text x="1208" y="608" text-anchor="end" fill="#94a3b8" font-size="24" font-weight="500" font-family="Arial, sans-serif">Scriptly AI</text>
</svg>`;
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

// ─── Main Component ──────────────────────────────────────
export default function ScriptViewPage({ scriptId }: { scriptId: string }) {
  const [script, setScript] = useState(MOCK_SCRIPT);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved">("saved");
  const [editingTitle, setEditingTitle] = useState(false);
  const thumbnailSvg = useMemo(() => buildThumbnailSvg(script), [script]);
  const thumbnailDataUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(thumbnailSvg)}`,
    [thumbnailSvg]
  );

  // Simulate auto-save
  const markUnsaved = useCallback(() => {
    setSaveState("unsaved");
    setTimeout(() => {
      setSaveState("saving");
      setTimeout(() => setSaveState("saved"), 800);
    }, 1200);
  }, []);

  const updateField = (key: string, value: unknown) => {
    setScript((prev) => ({ ...prev, [key]: value }));
    markUnsaved();
  };

  const handleExportMarkdown = useCallback(() => {
    downloadBlob(buildExportMarkdown(script), `${slugify(script.title)}.md`, "text/markdown;charset=utf-8");
  }, [script]);

  const handleExportPdf = useCallback(() => {
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
  }, [script]);

  const handleCopyAll = useCallback(async () => {
    await navigator.clipboard.writeText(buildExportMarkdown(script));
  }, [script]);

  const handleDownloadThumbnail = useCallback(() => {
    downloadBlob(thumbnailSvg, `${slugify(script.title)}-thumbnail.svg`, "image/svg+xml;charset=utf-8");
  }, [script.title, thumbnailSvg]);

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

          {/* Export Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="sm" className="h-9 border-white/10 bg-white/5 rounded-xl">
                <Download className="w-3.5 h-3.5 mr-2" />
                Export
              </Button>
            } />
            <DropdownMenuContent align="end" className="bg-card border-white/10 w-44">
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={handleExportPdf}>
                <FileText className="w-3.5 h-3.5 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={handleExportMarkdown}>
                <FileText className="w-3.5 h-3.5 mr-2" />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer" onClick={handleCopyAll}>
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy All to Clipboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More actions */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 border-white/10 bg-white/5 rounded-xl">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="bg-card border-white/10 w-40">
              <DropdownMenuItem className="text-sm cursor-pointer">
                <Copy className="w-3.5 h-3.5 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-sm text-destructive cursor-pointer focus:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete Script
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Script Header */}
      <div className="lux-card rounded-2xl p-6">
        {/* Title */}
        <div className="mb-4">
          {editingTitle ? (
            <input
              autoFocus
              value={script.title}
              onChange={(e) => setScript((prev) => ({ ...prev, title: e.target.value }))}
              onBlur={() => { setEditingTitle(false); markUnsaved(); }}
              className="w-full bg-transparent border-b border-[oklch(0.62_0.24_285_/_40%)] text-2xl font-black text-foreground focus:outline-none pb-1"
              style={{ fontFamily: "var(--font-cabinet)" }}
            />
          ) : (
            <h1
              onClick={() => setEditingTitle(true)}
              className="text-2xl font-black tracking-[-0.02em] cursor-text hover:text-[oklch(0.62_0.24_285)] transition-colors flex items-center gap-2 group/title"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {script.title}
              <Pencil className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </h1>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className={cn("text-xs border font-medium", status.class)}>
            {status.label}
          </Badge>
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", platform.bg, platform.color)}>
            <PlatformIcon className="w-3 h-3" />
            {platform.label}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {script.duration}
          </div>
          <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">{script.niche}</Badge>
          <span className="text-xs text-muted-foreground ml-auto">Created {script.createdAt}</span>
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

      {/* Thumbnail Panel */}
      <div className="lux-card rounded-2xl p-6">
        <h3
          className="text-xs font-black uppercase tracking-[0.15em] text-[oklch(0.62_0.24_285)] mb-5"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          🖼 Thumbnail
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Preview */}
          <div className="relative w-full sm:w-72 h-40 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center flex-shrink-0 overflow-hidden group/thumb cursor-pointer hover:border-white/15 transition-all">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <Image src={thumbnailDataUrl} alt={`${script.title} thumbnail preview`} fill unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <p className="text-xs text-white font-bold tracking-tight">View Full Size</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-bold mb-1" style={{ fontFamily: "var(--font-cabinet)" }}>AI-Generated Thumbnail</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Platform-native thumbnail optimized for click-through rate on {platform.label}.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="btn-amber border-0 h-9 text-sm rounded-xl font-bold px-5">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Regenerate
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadThumbnail}
                className="border-white/10 h-9 text-sm rounded-xl px-5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
