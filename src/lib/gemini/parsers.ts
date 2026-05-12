import { z } from "zod";

// --- Step 1: Title and Hook ---
export const titleAndHookSchema = z.object({
  title: z.string(),
  hook: z.string(),
  viral_score: z.number().min(0).max(100).optional(),
  viral_analysis: z.string().optional(),
});

export type TitleAndHookOutput = z.infer<typeof titleAndHookSchema>;

// --- Step 2: Full Script ---
export const fullScriptSchema = z.object({
  script: z.string(),
  cta: z.string(),
});

export type FullScriptOutput = z.infer<typeof fullScriptSchema>;

// --- Step 3: Scene Breakdown ---
export const sceneBreakdownItemSchema = z.object({
  scene: z.number(),
  duration: z.string(),
  visual: z.string(),
  audio: z.string(),
  text_overlay: z.string().optional(),
});

export const sceneBreakdownSchema = z.array(sceneBreakdownItemSchema);

export type SceneBreakdownOutput = z.infer<typeof sceneBreakdownSchema>;

// --- Step 4: Hashtags ---
export const hashtagsSchema = z.array(z.string());

export type HashtagsOutput = z.infer<typeof hashtagsSchema>;
