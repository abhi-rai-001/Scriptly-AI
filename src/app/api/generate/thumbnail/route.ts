import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { generateThumbnailSchema } from "@/schemas/api";
import { buildThumbnailPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";

// Using Playground v2.5 for highly aesthetic, social-media ready thumbnails.
const HF_MODEL_ID = "playgroundai/playground-v2.5-1024px-aesthetic";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Thumbnail generation failed";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = generateThumbnailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    const params = validation.data;
    const prompt = buildThumbnailPrompt(params);

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfKey) {
      return NextResponse.json(
        { error: "Hugging Face API key is missing from environment variables." },
        { status: 500 }
      );
    }

    const hf = new HfInference(hfKey);

    // Call Hugging Face via official SDK
    const blob = await hf.textToImage({
      model: HF_MODEL_ID,
      inputs: prompt,
    });

    // Convert Blob to Base64
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    
    const mimeType = blob.type || "image/webp";

    return NextResponse.json({
      imageBase64: `data:${mimeType};base64,${base64Data}`,
      storagePath: null,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Thumbnail Generation Error Details:", error);

    // Handle model loading error gracefully (503 Service Unavailable)
    if (message.includes("currently loading")) {
       return NextResponse.json(
         { error: "Image model is cold-starting. Please try again in about 30 seconds." },
         { status: 503 }
       );
    }

    return NextResponse.json(
      {
        error: "Thumbnail generation failed",
        message,
        debug: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : JSON.stringify(error)) : undefined
      },
      { status: 500 }
    );
  }
}
