import { NextRequest, NextResponse } from "next/server";
import { InlineDataPart } from "@google/generative-ai";
import { generateThumbnailSchema } from "@/schemas/api";
import { imageModel } from "@/lib/gemini/client";
import { buildThumbnailPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";

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

    const result = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    });

    const firstCandidate = result.response.candidates?.[0];
    const imagePart = firstCandidate?.content.parts.find(
      (part): part is InlineDataPart => "inlineData" in part
    );

    const mimeType = imagePart?.inlineData.mimeType;
    const base64Data = imagePart?.inlineData.data;

    if (!mimeType || !base64Data) {
      const modelText = result.response.text();
      return NextResponse.json(
        {
          error: "Image generation did not return image data",
          details: modelText || "Model returned no image payload",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imageBase64: `data:${mimeType};base64,${base64Data}`,
      storagePath: null,
    });
  } catch (error: unknown) {
    console.error("Thumbnail Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: getErrorMessage(error) }, { status: 500 });
  }
}
