import { NextRequest, NextResponse } from "next/server";
import { generateScriptSchema } from "@/schemas/api";
import { textModel } from "@/lib/gemini/client";
import {
  buildTitleAndHookPrompt,
  buildFullScriptPrompt,
  buildSceneBreakdownPrompt,
  buildHashtagsPrompt,
} from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";
import {
  fullScriptSchema,
  hashtagsSchema,
  sceneBreakdownSchema,
  titleAndHookSchema,
} from "@/lib/gemini/parsers";

// Helper to wait
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function extractJsonPayload(raw: string): string {
  const trimmed = raw.trim();
  
  const firstObject = trimmed.indexOf("{");
  const firstArray = trimmed.indexOf("[");
  
  const objectStart = firstObject === -1 ? Number.POSITIVE_INFINITY : firstObject;
  const arrayStart = firstArray === -1 ? Number.POSITIVE_INFINITY : firstArray;
  const start = Math.min(objectStart, arrayStart);

  if (!Number.isFinite(start)) {
    throw new Error("Model returned non-JSON content.");
  }

  const source = trimmed.slice(start);
  if (source.startsWith("{")) {
    const end = source.lastIndexOf("}");
    if (end === -1) throw new Error("Model returned malformed JSON object.");
    return source.slice(0, end + 1);
  }

  const end = source.lastIndexOf("]");
  if (end === -1) throw new Error("Model returned malformed JSON array.");
  return source.slice(0, end + 1);
}

function parseModelJson(raw: string): unknown {
  const extracted = extractJsonPayload(raw);
  try {
    return JSON.parse(extracted);
  } catch {
    throw new Error("Model returned invalid JSON.");
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Generation failed";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = generateScriptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
    }

    const params = validation.data;

    // Use a ReadableStream to stream the multi-step JSON responses back
    const stream = new ReadableStream({
      async start(controller) {
        const sendChunk = (type: string, payload: unknown) => {
          controller.enqueue(new TextEncoder().encode(JSON.stringify({ type, payload }) + "\n"));
        };

        try {
          // Step 1: Title and Hook
          const titleHookPrompt = buildTitleAndHookPrompt(params);
          const result1 = await textModel.generateContent({
            contents: [{ role: "user", parts: [{ text: titleHookPrompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.8 },
          });
          const parsed1Data = parseModelJson(result1.response.text());
          const parsed1 = titleAndHookSchema.parse(parsed1Data);
          sendChunk("title_and_hook", parsed1);

          // Give API a tiny breather
          await delay(300);

          // Step 2: Full Script
          const scriptPrompt = buildFullScriptPrompt(params, parsed1.hook);
          const result2 = await textModel.generateContent({
            contents: [{ role: "user", parts: [{ text: scriptPrompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.85 },
          });
          const parsed2Data = parseModelJson(result2.response.text());
          const parsed2 = fullScriptSchema.parse(parsed2Data);
          sendChunk("full_script", parsed2);

          await delay(300);

          // Step 3: Scene Breakdown
          const scenesPrompt = buildSceneBreakdownPrompt(params, parsed2.script);
          const result3 = await textModel.generateContent({
            contents: [{ role: "user", parts: [{ text: scenesPrompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
          });
          const parsed3Data = parseModelJson(result3.response.text());
          const parsed3 = sceneBreakdownSchema.parse(parsed3Data);
          sendChunk("scene_breakdown", parsed3);

          await delay(300);

          // Step 4: Hashtags
          const tagsPrompt = buildHashtagsPrompt(params);
          const result4 = await textModel.generateContent({
            contents: [{ role: "user", parts: [{ text: tagsPrompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.5 },
          });
          const parsed4Data = parseModelJson(result4.response.text());
          const parsed4 = hashtagsSchema.parse(parsed4Data);
          sendChunk("hashtags", parsed4);

          controller.close();
        } catch (err: unknown) {
          sendChunk("error", { message: getErrorMessage(err) });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: unknown) {
    console.error("Script Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error", message: getErrorMessage(error) }, { status: 500 });
  }
}
