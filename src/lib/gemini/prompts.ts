import { GenerateScriptInput, GenerateThumbnailInput } from "@/schemas/api";

function buildCreativeBrief(params: GenerateScriptInput): string {
  return `Creative Brief:
- Topic: ${params.topic}
- Niche: ${params.niche}
- Platform: ${params.platform}
- Style: ${params.style}
- Duration: ${params.duration}
- Language: ${params.language || "English"}
- Additional instructions: ${params.additionalInstructions?.trim() || "None"}`;
}

export function buildTitleAndHookPrompt(params: GenerateScriptInput): string {
  return `You are a world-class direct-response creative strategist for short-form ads.

${buildCreativeBrief(params)}

Task:
Generate ONE high-converting title and ONE spoken hook designed to maximize retention in the first 3-5 seconds.

Hard constraints:
- Title: 6-14 words, clear benefit/outcome, curiosity + specificity, no clickbait lies.
- Hook: one spoken line, high emotional tension or bold claim, instantly understandable.
- Match the language and pacing of ${params.platform}.
- ALL generated text (title, hook, script, etc.) MUST be in ${params.language || "English"}.
- Respect the style and additional instructions exactly.

Return ONLY valid JSON with this exact schema:
{
  "title": "...",
  "hook": "...",
  "viral_score": 85,
  "viral_analysis": "Explain why this hook and title combo works for the current platform algorithm"
}

Rules:
- No markdown, no code fences, no extra keys, no commentary.`;
}

export function buildFullScriptPrompt(params: GenerateScriptInput, hook: string): string {
  return `You are a senior performance ad copywriter and viral short-form scriptwriter.

${buildCreativeBrief(params)}
- Locked hook (must stay first line): "${hook}"

Task:
Write a polished, professional, ad-grade spoken script optimized for retention and conversion.
The script must feel natural for voiceover delivery and be ready to record without editing.

Structure to follow inside the script:
1) Hook (already provided, first line)
2) Problem / tension expansion
3) Value delivery (clear mechanism, proof, or practical insight)
4) Mini payoff / summary
5) Transition into CTA

Quality rules:
- Keep sentence rhythm punchy and spoken, not essay-like.
- Use concrete language, not vague motivational filler.
- Include at least one pattern interrupt.
- Avoid repetitive phrases and generic AI tone.
- Keep claims realistic; do not fabricate statistics.
- ALL generated text MUST be in ${params.language || "English"}.
- Respect additional instructions if provided.

Return ONLY valid JSON with this exact schema:
{
  "script": "Full spoken script with line breaks for delivery",
  "cta": "One sentence CTA aligned with the goal"
}

Do not include markdown, code fences, or extra keys.`;
}

export function buildSceneBreakdownPrompt(params: GenerateScriptInput, script: string): string {
  return `You are a short-form creative director.

${buildCreativeBrief(params)}

Based on this script, produce a shot-by-shot scene plan:

Script: ${script}
Duration: ${params.duration}

Return ONLY a JSON array with objects following this exact structure:
[
  {
    "scene": 1,
    "duration": "0-5s",
    "visual": "What the camera shows",
    "audio": "What is being said",
    "text_overlay": "On-screen text if any"
  }
]

Rules:
- Keep overlays concise (max 7 words where possible).
- Make visuals specific and shootable (camera angle, action, environment).
- Keep scene durations realistic for ${params.duration}.`;
}

export function buildHashtagsPrompt(params: GenerateScriptInput): string {
  return `Generate 15-20 hashtags for a ${params.platform} video about "${params.topic}" in the ${params.niche} niche.

Mix of:
- 3-4 very broad hashtags (1M+ posts)
- 6-8 medium hashtags (100K-1M posts)
- 5-6 niche-specific hashtags (<100K posts)

Rules:
- Include only relevant hashtags.
- No duplicates.
- Use standard hashtag format.

Return ONLY a JSON array of strings: ["#Tag1", "#Tag2"]`;
}

export function buildThumbnailPrompt(
  params: Pick<GenerateThumbnailInput, "title" | "hook" | "niche" | "platform">
): string {
  return `Create a premium, high-converting ${params.platform === 'youtube_shorts' ? 'YouTube Shorts' : params.platform === 'instagram' ? 'Instagram Reel' : 'TikTok'} thumbnail.

Video title: ${params.title}
Hook: ${params.hook}
Niche: ${params.niche}

Design direction:
- Professional ad creative quality.
- High contrast, clear focal subject, bold visual hierarchy.
- Dynamic, emotional composition suitable for scroll-stopping feeds.
- Optional short text overlay (max 4 words) only if it improves clarity.
- No watermark, no logos, no unreadable tiny text, no clutter.`;
}
