"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  Clock,
  Copy,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/store/generationStore";
import type { 
  Platform, 
  Duration, 
  Style, 
  SceneBreakdownItem, 
  GeneratedScript 
} from "@/store/generationStore";
import { StreamingText } from "@/components/animations/StreamingText";

type GenerationChunkType =
  | "title_and_hook"
  | "full_script"
  | "scene_breakdown"
  | "hashtags"
  | "error";

interface ThumbnailResponse {
  imageBase64: string;
  storagePath: string | null;
}

interface StreamChunk {
  type: GenerationChunkType;
  payload: unknown;
}

// ─── Icons (Custom SVGs for missing Lucide brand icons) ───
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// ─── Config ──────────────────────────────────────────────
const PLATFORMS = [
  { value: "instagram" as Platform, label: "Instagram Reels", icon: InstagramIcon, color: "text-pink-400" },
  { value: "youtube_shorts" as Platform, label: "YouTube Shorts", icon: YoutubeIcon, color: "text-red-400" },
  { value: "tiktok" as Platform, label: "TikTok", icon: () => <span className="font-bold text-sm">TT</span>, color: "text-white" },
];

const DURATIONS: Duration[] = ["15s", "30s", "60s"];

const STYLES: { value: Style; label: string; desc: string }[] = [
  { value: "educational", label: "Educational", desc: "Teach and explain clearly" },
  { value: "entertaining", label: "Entertaining", desc: "High-energy and fun" },
  { value: "motivational", label: "Motivational", desc: "Inspire and push action" },
  { value: "controversial", label: "Controversial", desc: "Strong hot-take angle" },
];

const INSTRUCTION_SUGGESTIONS = [
  "Tone: luxury + authoritative",
  "Target audience: beginners in this niche",
  "Goal: increase comments and shares",
  "Output style: punchy, no fluff, short lines",
  "Add a curiosity gap in the first 3 seconds",
  "Avoid jargon and complicated terms",
];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram Reels",
  youtube_shorts: "YouTube Shorts",
  tiktok: "TikTok",
};

const STEPS = ["Setup", "Generating", "Result"];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
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
  URL.revokeObjectURL(url);
}

function buildMarkdownExport(result: GeneratedScript, platformLabel: string, duration: string, niche: string) {
  return [
    `# ${result.title}`,
    "",
    `**Platform:** ${platformLabel}`,
    `**Duration:** ${duration}`,
    `**Niche:** ${niche}`,
    "",
    "## Hook",
    result.hook,
    "",
    "## Full Script",
    result.script,
    "",
    "## CTA",
    result.cta,
    "",
    "## Scene Directions",
    ...result.sceneBreakdown.map((scene) => {
      const overlay = scene.text_overlay ? ` | Text: ${scene.text_overlay}` : "";
      return `- Scene ${scene.scene} (${scene.duration}) — Visual: ${scene.visual} | Audio: ${scene.audio}${overlay}`;
    }),
    "",
    "## Hashtags",
    result.hashtags.join(" "),
    "",
  ].join("\n");
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-500",
                i < current
                  ? "bg-[oklch(0.62_0.24_285)] text-white"
                  : i === current
                    ? "bg-[oklch(0.62_0.24_285_/_15%)] border border-[oklch(0.62_0.24_285_/_50%)] text-[oklch(0.72_0.20_285)]"
                    : "bg-white/4 text-muted-foreground border border-white/8"
              )}
            >
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-sm font-semibold transition-colors duration-300",
                i <= current ? "text-foreground" : "text-muted-foreground"
              )}
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex items-center mx-3">
              <div
                className={cn(
                  "h-px w-12 transition-all duration-500",
                  i < current
                    ? "bg-[oklch(0.62_0.24_285)]" 
                    : "bg-white/10"
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ScriptSection({
  title,
  content,
  onRegenerate,
  animate = false,
  onComplete,
}: {
  title: string;
  content: string | string[];
  onRegenerate: () => void;
  animate?: boolean;
  onComplete?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(content) ? content.join("\n\n") : content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="lux-card rounded-2xl p-6 group"
    >
      <div className="flex items-center justify-between mb-5">
        <h3
          className="text-xs font-black uppercase tracking-[0.15em] text-[oklch(0.62_0.24_285)]"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Copy section"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[oklch(0.72_0.16_160)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onRegenerate}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {Array.isArray(content) ? (
        <ul className="space-y-3">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-foreground/85 leading-relaxed flex items-start gap-2.5">
              <span className="text-[oklch(0.62_0.24_285_/_50%)] mt-0.5 flex-shrink-0 font-bold">{String(i + 1).padStart(2, "0")}.</span>
              {animate ? (
                <StreamingText
                  text={item}
                  speed={5}
                  onComplete={i === content.length - 1 ? onComplete : undefined}
                />
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
          {animate ? (
            <StreamingText text={content} speed={5} onComplete={onComplete} />
          ) : (
            content
          )}
        </div>
      )}
    </motion.div>
  );
}

function stringifyScenes(scenes: SceneBreakdownItem[]): string[] {
  return scenes.map(
    (scene) =>
      `Scene ${scene.scene} (${scene.duration}) — Visual: ${scene.visual} | Audio: ${scene.audio}${
        scene.text_overlay ? ` | Text: ${scene.text_overlay}` : ""
      }`
  );
}

export default function GeneratePage() {
  const {
    step,
    setStep,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    form,
    setForm,
    result,
    setResult,
    thumbnailImage,
    setThumbnailImage,
    resetAll,
  } = useGenerationStore();

  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  const canGenerate = useMemo(() => form.topic.trim().length > 1 && form.niche.trim().length > 1, [form.topic, form.niche]);

  const sections = result ? [
    { id: "title", title: "🏷️ Title", content: result.title },
    { id: "hook", title: "🪝 Hook (First 3-5 seconds)", content: result.hook },
    { id: "script", title: "📝 Full Script", content: result.script },
    { id: "cta", title: "💥 CTA (Call To Action)", content: result.cta },
    { id: "scenes", title: "🎬 Scene Directions", content: stringifyScenes(result.sceneBreakdown) },
    { id: "hashtags", title: "# Hashtags", content: result.hashtags },
  ] : [];

  const appendInstruction = (suggestion: string) => {
    setForm({
      additionalInstructions: form.additionalInstructions
        ? `${form.additionalInstructions}\n${suggestion}`
        : suggestion,
    });
  };
  const resetAllAndSequence = () => {
    resetAll();
    setRevealedCount(0);
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setStep(1);
    setIsGenerating(true);
    setError(null);
    setThumbnailError(null);
    setThumbnailImage(null);
    setResult(null);
    setRevealedCount(0);

    const draft: Partial<GeneratedScript> = {
      hashtags: [],
      sceneBreakdown: [],
    };

    try {
      const response = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: form.topic.trim(),
          niche: form.niche.trim(),
          platform: form.platform,
          style: form.style,
          duration: form.duration,
          additionalInstructions: (form.additionalInstructions || "").trim() || undefined,
        }),
      });

      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.error || failure?.message || "Script generation failed");
      }

      if (!response.body) {
        throw new Error("No stream received from generation API.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamBuffer = "";

      const applyChunk = (chunk: StreamChunk) => {
        switch (chunk.type) {
          case "title_and_hook": {
            const payload = chunk.payload as { title?: string; hook?: string };
            if (!payload?.title || !payload?.hook) throw new Error("Invalid title/hook payload.");
            draft.title = payload.title;
            draft.hook = payload.hook;
            break;
          }
          case "full_script": {
            const payload = chunk.payload as { script?: string; cta?: string };
            if (!payload?.script || !payload?.cta) throw new Error("Invalid script payload.");
            draft.script = payload.script;
            draft.cta = payload.cta;
            break;
          }
          case "scene_breakdown": {
            if (!Array.isArray(chunk.payload)) throw new Error("Invalid scene breakdown payload.");
            draft.sceneBreakdown = chunk.payload as SceneBreakdownItem[];
            break;
          }
          case "hashtags": {
            if (!Array.isArray(chunk.payload)) throw new Error("Invalid hashtags payload.");
            draft.hashtags = (chunk.payload as unknown[]).filter((item): item is string => typeof item === "string");
            break;
          }
          case "error": {
            const payload = chunk.payload as { message?: string };
            throw new Error(payload?.message || "Generation failed");
          }
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n");
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line) as StreamChunk;
          applyChunk(parsed);
        }
      }

      if (streamBuffer.trim()) {
        const parsed = JSON.parse(streamBuffer.trim()) as StreamChunk;
        applyChunk(parsed);
      }

      if (!draft.title || !draft.hook || !draft.script || !draft.cta) {
        throw new Error("Generation returned incomplete content.");
      }

      const finalResult: GeneratedScript = {
        title: draft.title,
        hook: draft.hook,
        script: draft.script,
        cta: draft.cta,
        hashtags: draft.hashtags || [],
        sceneBreakdown: draft.sceneBreakdown || [],
      };

      setResult(finalResult);
      setStep(2);
    } catch (generationError: unknown) {
      setError(getErrorMessage(generationError));
      setStep(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!result) return;

    setIsGeneratingThumbnail(true);
    setThumbnailError(null);

    try {
      const response = await fetch("/api/generate/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          hook: result.hook,
          niche: form.niche,
          platform: form.platform,
        }),
      });

      const data = (await response.json()) as Partial<ThumbnailResponse> & { error?: string; details?: string };

      if (!response.ok) {
        throw new Error(data.error || data.details || "Thumbnail generation failed");
      }

      if (!data.imageBase64) {
        throw new Error("Thumbnail API did not return image data.");
      }

      setThumbnailImage(data.imageBase64);
    } catch (thumbnailGenerationError: unknown) {
      setThumbnailError(getErrorMessage(thumbnailGenerationError));
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleExportScript = useCallback(() => {
    if (!result) return;

    const markdown = buildMarkdownExport(
      result,
      PLATFORM_LABELS[form.platform],
      form.duration,
      form.niche
    );
    downloadBlob(markdown, `${slugify(result.title)}.md`, "text/markdown;charset=utf-8");
  }, [form.duration, form.niche, form.platform, result]);

  const handleDownloadThumbnail = useCallback(async () => {
    if (!thumbnailImage) return;

    const response = await fetch(thumbnailImage);
    const blob = await response.blob();
    const extension = blob.type === "image/png" ? "png" : blob.type === "image/jpeg" ? "jpg" : "webp";
    downloadBlob(blob, `${slugify(result?.title || "thumbnail")}.${extension}`, blob.type || "image/webp");
  }, [result?.title, thumbnailImage]);


  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator current={step} />

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Step 0: Form ─────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1
              className="text-3xl font-black tracking-[-0.03em] mb-1"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Generate a Script
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in your details and get a viral-ready script with hook, scenes, CTA, and hashtags — in under a minute.
            </p>
          </div>

          <div className="grid gap-6 lux-card rounded-2xl p-6">
            <div className="grid gap-2">
              <label className="text-sm font-semibold">
                Video Topic <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Why most beginner traders lose money"
                value={form.topic}
                onChange={(e) => setForm({ topic: e.target.value })}
                className="h-11 bg-secondary/40 border-white/8 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Be specific. Great inputs create better scripts.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">
                Niche / Category <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Personal finance, fitness, skincare, SaaS"
                value={form.niche}
                onChange={(e) => setForm({ niche: e.target.value })}
                className="h-11 bg-secondary/40 border-white/8 focus-visible:ring-[oklch(0.62_0.24_285_/_40%)] rounded-xl"
              />
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((platformOption) => {
                  const Icon = platformOption.icon;
                  return (
                    <button
                      key={platformOption.value}
                      onClick={() => setForm({ platform: platformOption.value })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-sm font-medium",
                        form.platform === platformOption.value
                          ? "border-[oklch(0.62_0.24_285_/_50%)] bg-[oklch(0.62_0.24_285_/_10%)] text-foreground"
                          : "border-white/8 bg-white/3 text-muted-foreground hover:border-white/15 hover:bg-white/5"
                      )}
                    >
                      <span className={platformOption.color}>
                        <Icon className="w-5 h-5" />
                      </span>
                      {platformOption.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Target Duration</label>
              <div className="flex gap-3">
                {DURATIONS.map((durationOption) => (
                  <button
                    key={durationOption}
                    onClick={() => setForm({ duration: durationOption })}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                      form.duration === durationOption
                        ? "border-[oklch(0.62_0.24_285_/_50%)] bg-[oklch(0.62_0.24_285_/_10%)] text-foreground"
                        : "border-white/8 bg-white/3 text-muted-foreground hover:border-white/15"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {durationOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Content Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STYLES.map((styleOption) => (
                  <button
                    key={styleOption.value}
                    onClick={() => setForm({ style: styleOption.value })}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3.5 rounded-xl border text-left transition-all duration-200",
                      form.style === styleOption.value
                        ? "border-[oklch(0.62_0.24_285_/_50%)] bg-[oklch(0.62_0.24_285_/_10%)]"
                        : "border-white/8 bg-white/3 hover:border-white/15"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-cabinet)" }}>{styleOption.label}</span>
                    <span className="text-xs text-muted-foreground">{styleOption.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Extra Instructions (Optional)</label>
              <textarea
                value={form.additionalInstructions}
                onChange={(e) => setForm({ additionalInstructions: e.target.value })}
                placeholder="Add tone, target audience, expected output format, offer details, words to avoid, CTA goal..."
                className="min-h-30 rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                maxLength={500}
              />
              <div className="flex flex-wrap gap-2">
                {INSTRUCTION_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => appendInstruction(suggestion)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-white/25 hover:text-white transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">{form.additionalInstructions?.length || 0}/500 characters</div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full h-14 btn-amber border-0 font-bold text-base disabled:opacity-40 disabled:pointer-events-none rounded-xl"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            Generate Script with AI
          </Button>
        </div>
      )}

      {/* ── Step 1: Generating (Loading) ─────────────────── */}
      {step === 1 && (
        <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: "oklch(0.62 0.24 285 / 10%)", border: "1px solid oklch(0.62 0.24 285 / 25%)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.24_285_/_20%),transparent_70%)]" />
              <Sparkles className="w-10 h-10 text-[oklch(0.72_0.20_285)] animate-pulse relative z-10" />
            </div>
            <div className="absolute -inset-4 rounded-3xl border border-[oklch(0.62_0.24_285_/_12%)] animate-ping" />
          </div>
          <h2
            className="text-2xl font-black mb-2 tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Crafting your script...
          </h2>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs leading-relaxed">
            Building a conversion-focused script for {PLATFORM_LABELS[form.platform]}. This takes about 10 seconds.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-[oklch(0.62_0.24_285)]" />
            Generating title, hook, script, scenes &amp; hashtags...
          </div>
        </div>
      )}

      {/* ── Step 2: Result ────────────────────────────────── */}
      {step === 2 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[oklch(0.72_0.16_160_/_10%)] text-[oklch(0.72_0.16_160)] border border-[oklch(0.72_0.16_160_/_25%)] text-xs">✓ Script Ready</Badge>
                <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground capitalize">
                  {PLATFORM_LABELS[form.platform]}
                </Badge>
                <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
                  {form.duration}
                </Badge>
              </div>
              <h2
                className="text-xl font-black tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                Your Script is Ready
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-white/10 h-9 rounded-xl" onClick={handleExportScript}>
                <Download className="w-3.5 h-3.5 mr-2" />
                Export
              </Button>
              <Button size="sm" className="btn-amber border-0 h-9 rounded-xl" disabled>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Save Script
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {sections.slice(0, revealedCount + 1).map((section, i) => (
              <ScriptSection
                key={section.id}
                title={section.title}
                content={section.content}
                animate={i === revealedCount}
                onRegenerate={() => {}}
                onComplete={() => {
                  if (i === revealedCount && revealedCount < sections.length - 1) {
                    setRevealedCount(revealedCount + 1);
                  }
                }}
              />
            ))}
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-primary mb-4">AI Thumbnail</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-64 h-36 rounded-xl bg-gradient-to-br from-primary/20 to-secondary border border-white/10 flex-shrink-0 relative overflow-hidden">
                {thumbnailImage ? (
                  <Image src={thumbnailImage} alt="Generated thumbnail" fill unoptimized className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
                    />
                    <ImageIcon className="w-10 h-10 text-primary/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Generate a high-converting thumbnail aligned with this script and platform.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleGenerateThumbnail}
                    disabled={isGeneratingThumbnail}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-10"
                  >
                    {isGeneratingThumbnail ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {thumbnailImage ? "Regenerate Thumbnail" : "Generate Thumbnail"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadThumbnail}
                    disabled={!thumbnailImage}
                    className="border-white/10 bg-white/5 h-10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
                {thumbnailError && (
                  <p className="text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {thumbnailError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button variant="ghost" onClick={resetAllAndSequence} className="text-muted-foreground hover:text-foreground">
            ← Generate a new script
          </Button>
        </div>
      )}
    </div>
  );
}
