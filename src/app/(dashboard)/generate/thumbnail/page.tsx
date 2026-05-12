"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  Download,
  ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGenerationStore } from "@/store/generationStore";
import type { Platform } from "@/store/generationStore";

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram Reels",
  youtube_shorts: "YouTube Shorts",
  tiktok: "TikTok",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "thumbnail";
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Thumbnail generation failed";
}

export default function ThumbnailGeneratorPage() {
  const {
    form,
    result,
    thumbnailImage,
    thumbnailUrl,
    thumbnailStoragePath,
    setThumbnailImage,
    setThumbnailUrl,
    setThumbnailStoragePath,
    savedScriptId,
  } = useGenerationStore();
  const [title, setTitle] = useState(result?.title ?? "");
  const [hook, setHook] = useState(result?.hook ?? "");
  const [niche, setNiche] = useState(form.niche ?? "");
  const [platform, setPlatform] = useState<Platform>(form.platform);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canGenerate = useMemo(
    () => title.trim().length > 0 && hook.trim().length > 0 && niche.trim().length > 0,
    [hook, niche, title]
  );

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          hook: hook.trim(),
          niche: niche.trim(),
          platform,
          customPrompt: customPrompt.trim() || undefined,
          previousStoragePath: thumbnailStoragePath || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Thumbnail generation failed");
      }

      if (!data?.imageBase64) {
        throw new Error("Thumbnail API did not return image data.");
      }

      setThumbnailImage(data.imageBase64);
      setThumbnailUrl(data?.imageUrl ?? null);
      if (typeof data?.storagePath === "string") {
        setThumbnailStoragePath(data.storagePath);
      }
    } catch (thumbnailError: unknown) {
      setError(getErrorMessage(thumbnailError));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const source = thumbnailUrl || thumbnailImage;
    if (!source) return;

    const response = await fetch(source);
    const blob = await response.blob();
    const extension = blob.type === "image/png" ? "png" : blob.type === "image/jpeg" ? "jpg" : "webp";
    downloadBlob(blob, `${slugify(title)}.${extension}`, blob.type || "image/webp");
  };
  
  const handleSaveAsPreview = async () => {
    if (!savedScriptId || !thumbnailUrl) return;

    setIsSaving(true);
    try {
      const payload: any = {};
      if (thumbnailUrl) {
        payload.thumbnail_url = thumbnailUrl;
      } else if (thumbnailImage) {
        payload.thumbnail_base64 = thumbnailImage;
      }

      if (Object.keys(payload).length === 0) {
        throw new Error("No thumbnail data to save");
      }

      const response = await fetch(`/api/scripts/${savedScriptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || data?.message || "Failed to update preview");
      }

      toast.success("Thumbnail set as script preview!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Link href="/generate" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to script generator
        </Link>
        <div className="text-sm text-muted-foreground">
          Leave custom prompt empty to use the default prompt.
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-[-0.03em]" style={{ fontFamily: "var(--font-cabinet)" }}>
          Thumbnail Generator
        </h1>
        <p className="text-sm text-muted-foreground">
          Use the default prompt or write your own, then generate a scroll-stopping thumbnail.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lux-card rounded-2xl p-6 space-y-5">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Thumbnail title" className="h-11 bg-secondary/40 border-white/8 rounded-xl" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Hook</label>
            <Input value={hook} onChange={(e) => setHook(e.target.value)} placeholder="Thumbnail hook" className="h-11 bg-secondary/40 border-white/8 rounded-xl" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Niche</label>
            <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Fitness, finance, tech..." className="h-11 bg-secondary/40 border-white/8 rounded-xl" />
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-semibold">Platform</label>
            <div className="grid grid-cols-3 gap-3">
              {(["instagram", "youtube_shorts", "tiktok"] as Platform[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPlatform(value)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                    platform === value
                      ? "border-[oklch(0.62_0.24_285_/_50%)] bg-[oklch(0.62_0.24_285_/_10%)]"
                      : "border-white/8 bg-white/3 hover:border-white/15"
                  )}
                >
                  {PLATFORM_LABELS[value]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold">Custom prompt</label>
              <Button type="button" variant="ghost" onClick={() => setCustomPrompt("")} className="h-7 px-2 text-xs text-muted-foreground">
                Use default prompt
              </Button>
            </div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Leave blank to use the default thumbnail prompt."
              className="min-h-36 rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
          <Button onClick={handleGenerate} disabled={!canGenerate || isGenerating} className="w-full h-11 btn-amber border-0 rounded-xl font-bold">
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Thumbnail
          </Button>
        </div>

        <div className="lux-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-primary">Preview</h2>
            <span className="text-xs text-muted-foreground">{customPrompt.trim() ? "Custom prompt" : "Default prompt"}</span>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-2xl border border-white/10 bg-gradient-to-br from-primary/20 to-secondary overflow-hidden">
            {thumbnailImage ? (
              <Image src={thumbnailImage} alt="Generated thumbnail" fill unoptimized className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                <ImageIcon className="w-12 h-12 text-white/15" />
                <p className="text-sm text-muted-foreground max-w-xs">
                  Your generated thumbnail will appear here.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {customPrompt.trim()
                ? "The custom prompt will be sent to the image model as-is."
                : "The default prompt combines your title, hook, niche, and platform."}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Thumbnail generation can take up to 2 minutes while the current image model warms up. Faster models are coming soon.
            </p>
            <Button variant="outline" onClick={handleDownload} disabled={!thumbnailImage} className="w-full border-white/10 bg-white/5 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>

            {savedScriptId && (
              <Button 
                onClick={handleSaveAsPreview} 
                disabled={(!thumbnailUrl && !thumbnailImage) || isSaving} 
                className="w-full btn-primary h-11 rounded-xl font-bold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                Save as Script Preview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
