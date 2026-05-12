import { NextRequest, NextResponse } from "next/server";
import { textModel } from "@/lib/gemini/client";
import { buildRefinementPrompt } from "@/lib/gemini/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, instruction, context } = await req.json();

    if (!content || !instruction) {
      return NextResponse.json({ error: "Missing content or instruction" }, { status: 400 });
    }

    const prompt = buildRefinementPrompt(content, instruction, context);

    const result = await textModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    });

    const refinedText = result.response.text().trim();

    return NextResponse.json({ refinedText });

  } catch (error: unknown) {
    console.error("Refinement Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
