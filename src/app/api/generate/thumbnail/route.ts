import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";
import { generateThumbnailSchema } from "@/schemas/api";
import { buildThumbnailPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

// Using Playground v2.5 for highly aesthetic, social-media ready thumbnails.
const HF_MODEL_ID = "black-forest-labs/FLUX.1-schnell";

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

    const { customPrompt, previousStoragePath, ...thumbnailParams } = validation.data;
    const prompt = customPrompt?.trim() || buildThumbnailPrompt(thumbnailParams);

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    const hf = hfKey ? new HfInference(hfKey) : null;

    let blob: Blob | null = null;
    let usedFallback = false;

    // 1. Try Hugging Face
    if (hf) {
      try {
        const imageResult = await hf.textToImage({
          model: HF_MODEL_ID,
          inputs: prompt,
        }, {
          wait_for_model: true,
        } as any) as any;

        if (typeof imageResult === "string") {
          const response = await fetch(imageResult);
          if (response.ok) {
            blob = await response.blob();
          }
        } else {
          blob = imageResult;
        }
      } catch (err) {
        console.error("Hugging Face primary model failed, trying fallback...", err);
      }
    }

    // 2. Fallback to Pollinations AI (Unlimited, Free, and very reliable)
    if (!blob) {
      try {
        usedFallback = true;
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(prompt);
        // Use Flux model on Pollinations for high quality
        const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&seed=${seed}&model=flux&nologo=true`;
        
        const response = await fetch(pollUrl);
        if (!response.ok) {
          throw new Error(`Pollinations AI failed with status ${response.status}`);
        }
        blob = await response.blob();
      } catch (err) {
        console.error("Pollinations AI fallback failed:", err);
      }
    }

    if (!blob) {
      return NextResponse.json(
        { error: "Thumbnail generation failed. All providers are currently unavailable." },
        { status: 503 }
      );
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = blob.type || "image/webp";

    // Upload to Supabase Storage
    const bucket = process.env.SUPABASE_THUMBNAIL_BUCKET || "thumbnails";
    const fileExtension = mimeType.includes("png")
      ? "png"
      : mimeType.includes("jpeg") || mimeType.includes("jpg")
        ? "jpg"
        : "webp";
    const fileName = `${user.id}/${Date.now()}-${randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({
        imageBase64: `data:${mimeType};base64,${base64Data}`,
        imageUrl: null,
        storagePath: null,
        info: usedFallback ? "Generated via fallback provider (Storage error)" : undefined
      });
    }

    if (
      previousStoragePath &&
      previousStoragePath !== fileName &&
      previousStoragePath.startsWith(`${user.id}/`)
    ) {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([previousStoragePath]);
      if (removeError) {
        console.error("Previous thumbnail cleanup error:", removeError);
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      imageBase64: `data:${mimeType};base64,${base64Data}`,
      imageUrl: publicUrl,
      storagePath: fileName,
      info: usedFallback ? "Generated via fallback provider" : undefined
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Thumbnail Generation Route Error:", error);

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
