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
    if (!hfKey) {
      return NextResponse.json(
        { error: "Hugging Face API key is missing from environment variables." },
        { status: 500 }
      );
    }

    const hf = new HfInference(hfKey);

    // Call Hugging Face via official SDK
    const imageResult = await hf.textToImage({
      model: HF_MODEL_ID,
      inputs: prompt,
    }, {
      wait_for_model: true,
    }) as Blob;

    let blob: Blob;
    if (typeof imageResult === "string") {
      const response = await fetch(imageResult);
      if (!response.ok) {
        return NextResponse.json({ error: "Thumbnail generation failed" }, { status: 502 });
      }
      blob = await response.blob();
    } else {
      blob = imageResult;
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
