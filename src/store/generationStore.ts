import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GenerateScriptInput } from "@/schemas/api";

export type Platform = "instagram" | "youtube_shorts" | "tiktok";
export type Duration = "15s" | "30s" | "60s";
export type Style = "educational" | "entertaining" | "motivational" | "controversial";

export interface SceneBreakdownItem {
  scene: number;
  duration: string;
  visual: string;
  audio: string;
  text_overlay?: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  script: string;
  cta: string;
  hashtags: string[];
  sceneBreakdown: SceneBreakdownItem[];
}

interface GenerationState {
  // Step & UI state
  step: number;
  isGenerating: boolean;
  error: string | null;

  // Form Data
  form: GenerateScriptInput;

  // Generated Content
  result: GeneratedScript | null;
  thumbnailImage: string | null;

  // Actions
  setStep: (step: number) => void;
  setForm: (form: Partial<GenerateScriptInput>) => void;
  setResult: (result: GeneratedScript | null) => void;
  setThumbnailImage: (image: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  resetAll: () => void;
}

const initialForm: GenerateScriptInput = {
  topic: "",
  niche: "",
  platform: "instagram",
  duration: "60s",
  style: "educational",
  additionalInstructions: "",
};

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set) => ({
      step: 0,
      isGenerating: false,
      error: null,
      form: initialForm,
      result: null,
      thumbnailImage: null,

      setStep: (step) => set({ step }),
      setForm: (form) =>
        set((state) => ({
          form: { ...state.form, ...form },
        })),
      setResult: (result) => set({ result }),
      setThumbnailImage: (thumbnailImage) => set({ thumbnailImage }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      resetAll: () =>
        set({
          step: 0,
          isGenerating: false,
          error: null,
          form: initialForm,
          result: null,
          thumbnailImage: null,
        }),
    }),
    {
      name: "generation-store",
    }
  )
);
