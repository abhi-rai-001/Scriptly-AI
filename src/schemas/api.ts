import { z } from "zod";

// --- Script Generation Inputs ---
export const generateScriptSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters").max(100, "Topic must be less than 100 characters"),
  niche: z.string().min(2, "Niche is required"),
  platform: z.enum(["instagram", "youtube_shorts", "tiktok"]),
  style: z.enum(["educational", "entertaining", "motivational", "controversial"]),
  duration: z.enum(["15s", "30s", "60s"]),
  additionalInstructions: z
    .string()
    .max(500, "Additional instructions must be 500 characters or less")
    .optional(),
});

export type GenerateScriptInput = z.infer<typeof generateScriptSchema>;

// --- Thumbnail Generation Inputs ---
export const generateThumbnailSchema = z.object({
  title: z.string().min(1, "Title is required"),
  hook: z.string().min(1, "Hook is required"),
  niche: z.string().min(1, "Niche is required"),
  platform: z.enum(["instagram", "youtube_shorts", "tiktok"]),
});

export type GenerateThumbnailInput = z.infer<typeof generateThumbnailSchema>;

// --- Database CRUD Inputs ---
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

const sceneSchema = z.object({
  scene: z.number(),
  duration: z.string(),
  visual: z.string(),
  audio: z.string(),
  text_overlay: z.string().optional(),
});

export const saveScriptSchema = z.object({
  project_id: z.string().uuid().nullable().optional(),
  topic: z.string(),
  niche: z.string(),
  platform: z.string(),
  content_style: z.string(),
  duration: z.string(),
  title: z.string().optional(),
  hook: z.string().optional(),
  script: z.string().optional(),
  scene_breakdown: z.array(sceneSchema).optional(),
  cta: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  thumbnail_base64: z.string().optional(),
});

export const updateScriptSchema = saveScriptSchema.partial().omit({ thumbnail_base64: true });
