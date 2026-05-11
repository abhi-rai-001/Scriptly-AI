"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Platform = "instagram" | "youtube_shorts" | "tiktok";
type Duration = "15s" | "30s" | "60s";
type Style = "educational" | "entertaining" | "motivational" | "controversial";

type GenerationChunkType =
  | "title_and_hook"
  | "full_script"
  | "scene_breakdown"
  | "hashtags"
  | "error";

interface FormData {
  topic: string;
  niche: string;
  platform: Platform;
  duration: Duration;
  style: Style;
  additionalInstructions: string;
}

interface SceneBreakdownItem {
  scene: number;
  duration: string;
  visual: string;
  audio: string;
  text_overlay?: string;
}

interface GeneratedScript {
  title: string;
  hook: string;
  script: string;
  cta: string;
  hashtags: string[];
  sceneBreakdown: SceneBreakdownItem[];
}

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

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-500",
              i < current
                ? "bg-primary text-white"
                : i === current
                  ? "bg-primary/20 border border-primary text-primary"
                  : "bg-secondary/50 text-muted-foreground border border-white/10"
            )}
          >
            {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={cn("text-sm font-medium", i <= current ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
          {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground/40 mx-1" />}
        </div>
      ))}
    </div>
  );
}

function ScriptSection({
  title,
  content,
  onRegenerate,
}: {
  title: string;
  content: string | string[];
  onRegenerate: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const text = Array.isArray(content) ? content.join("\n\n") : content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 group border border-white/8 hover:border-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">{title}</h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="w-7 h-7 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            onClick={onRegenerate}
            className="w-7 h-7 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="text-sm text-foreground/80 leading-relaxed flex items-start gap-2">
              <span className="text-primary/60 mt-0.5 flex-shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{content}</p>
      )}
    </div>
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
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedScript | null>(null);

  const [form, setForm] = useState<FormData>({
    topic: "",
    niche: "",
    platform: "instagram",
    duration: "60s",
    style: "educational",
    additionalInstructions: "",
  });

  const canGenerate = useMemo(() => form.topic.trim().length > 1 && form.niche.trim().length > 1, [form.topic, form.niche]);

  const appendInstruction = (suggestion: string) => {
    setForm((prev) => ({
      ...prev,
      additionalInstructions: prev.additionalInstructions
        ? `${prev.additionalInstructions}\n${suggestion}`
        : suggestion,
    }));
  };

  const resetAll = () => {
    setStep(0);
    setResult(null);
    setError(null);
    setThumbnailError(null);
    setThumbnailImage(null);
    setIsGenerating(false);
    setIsGeneratingThumbnail(false);
    setForm({
      topic: "",
      niche: "",
      platform: "instagram",
      duration: "60s",
      style: "educational",
      additionalInstructions: "",
    });
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setStep(1);
    setIsGenerating(true);
    setError(null);
    setThumbnailError(null);
    setThumbnailImage(null);
    setResult(null);

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
          additionalInstructions: form.additionalInstructions.trim() || undefined,
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
      let buffer = "";

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

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const parsed = JSON.parse(line) as StreamChunk;
          applyChunk(parsed);
        }
      }

      if (buffer.trim()) {
        const parsed = JSON.parse(buffer.trim()) as StreamChunk;
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
            <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ fontFamily: "var(--font-syne)" }}>
              Generate a Script
            </h1>
            <p className="text-sm text-muted-foreground">
              Submit your reel details and get a professional ad-grade script with hook, scenes, CTA, and hashtags.
            </p>
          </div>

          <div className="grid gap-6 glass-card rounded-2xl p-6 border border-white/8">
            <div className="grid gap-2">
              <label className="text-sm font-semibold">
                Video Topic <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Why most beginner traders lose money"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="h-11 bg-secondary/30 border-white/10 focus-visible:ring-primary/50"
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
                onChange={(e) => setForm({ ...form, niche: e.target.value })}
                className="h-11 bg-secondary/30 border-white/10 focus-visible:ring-primary/50"
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
                      onClick={() => setForm({ ...form, platform: platformOption.value })}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-sm font-medium",
                        form.platform === platformOption.value
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-white/10 bg-secondary/20 text-muted-foreground hover:border-white/20 hover:bg-secondary/40"
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
                    onClick={() => setForm({ ...form, duration: durationOption })}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
                      form.duration === durationOption
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-white/10 bg-secondary/20 text-muted-foreground hover:border-white/20"
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
                    onClick={() => setForm({ ...form, style: styleOption.value })}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3.5 rounded-xl border text-left transition-all duration-200",
                      form.style === styleOption.value
                        ? "border-primary/50 bg-primary/10"
                        : "border-white/10 bg-secondary/20 hover:border-white/20"
                    )}
                  >
                    <span className="text-sm font-semibold text-foreground">{styleOption.label}</span>
                    <span className="text-xs text-muted-foreground">{styleOption.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-sm font-semibold">Extra Instructions (Optional)</label>
              <textarea
                value={form.additionalInstructions}
                onChange={(e) => setForm({ ...form, additionalInstructions: e.target.value })}
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
              <p className="text-xs text-muted-foreground">{form.additionalInstructions.length}/500 characters</p>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base glow-primary disabled:opacity-50 disabled:glow-none"
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
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="absolute -inset-4 rounded-3xl border border-primary/10 animate-ping" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
            Generating your script...
          </h2>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
            Crafting a professional, conversion-focused script for {PLATFORM_LABELS[form.platform]}.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Building title, hook, script, scenes, and hashtags...
          </div>
        </div>
      )}

      {/* ── Step 2: Result ────────────────────────────────── */}
      {step === 2 && result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 border text-xs">Script Ready</Badge>
                <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground capitalize">
                  {PLATFORM_LABELS[form.platform]}
                </Badge>
                <Badge variant="outline" className="text-xs border-white/10 text-muted-foreground">
                  {form.duration}
                </Badge>
              </div>
              <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
                Your Script is Ready
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-white/10 h-9" disabled>
                <Download className="w-3.5 h-3.5 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 h-9" disabled>
                <Zap className="w-3.5 h-3.5 mr-2" />
                Save Script
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <ScriptSection title="🏷️ Title" content={result.title} onRegenerate={() => {}} />
            <ScriptSection title="🪝 Hook (First 3-5 seconds)" content={result.hook} onRegenerate={() => {}} />
            <ScriptSection title="📝 Full Script" content={result.script} onRegenerate={() => {}} />
            <ScriptSection title="💥 CTA (Call To Action)" content={result.cta} onRegenerate={() => {}} />
            <ScriptSection title="🎬 Scene Directions" content={stringifyScenes(result.sceneBreakdown)} onRegenerate={() => {}} />
            <ScriptSection title="# Hashtags" content={result.hashtags} onRegenerate={() => {}} />
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
                {thumbnailError && (
                  <p className="text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {thumbnailError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button variant="ghost" onClick={resetAll} className="text-muted-foreground hover:text-foreground">
            ← Generate a new script
          </Button>
        </div>
      )}
    </div>
  );
}
