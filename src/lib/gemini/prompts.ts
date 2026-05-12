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
  return `You are a senior performance ad copywriter and viral short-form scriptwriter, you have written ads for top brands in the world and you know how to write scripts that go viral on any platform, you are also a trend analyst and you know what is trending on social media.

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
6) CTA (Call to action)

Quality rules:
- Keep sentence rhythm punchy and spoken, not essay-like.
- Use concrete language, not vague motivational filler.
- Include at least one pattern interrupt.
- Make sure you research about the topic properly
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
  return `You are a short-form creative director. You have to make a scene breakdown for the script given below. You are also a trend analyst and you know what is trending on social media.

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
  return `Generate 10-15 hashtags for a ${params.platform} video about "${params.topic}" in the ${params.niche} niche.

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
  params: Partial<Pick<GenerateThumbnailInput, "title" | "hook" | "niche" | "platform">>
): string {
  const title = params.title || "Untitled Video";
  const hook = params.hook || "No hook provided";
  const niche = params.niche || "General Content";
  const platform = params.platform || "instagram";

  return `You are a world-class creative director specializing in viral social media content. Your task is to generate a single, jaw-dropping thumbnail image for a ${platform === 'youtube_shorts'
      ? 'YouTube Shorts'
      : platform === 'instagram'
        ? 'Instagram Reel'
        : 'TikTok'
    } video that stops the scroll within 0.3 seconds.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIDEO CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title : ${title}
Hook  : ${hook}
Niche : ${niche}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT & TECHNICAL SPECS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Aspect ratio: 9:16 vertical (portrait, mobile-first)
- Resolution: Ultra-sharp, print-quality detail
- Safe zone: Keep critical visual elements within the central 80% to avoid platform UI crop
- Output: Single image, no panels, no collages, no borders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL HIERARCHY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ONE dominant focal subject — the eye must land on it instantly
2. Clear foreground / midground / background layering for depth
3. Subject must occupy at least 50–70% of the frame
4. Every element must serve a purpose — no visual noise, no clutter
5. Apply the rule of thirds; subject slightly off-center feels more dynamic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COLOR & LIGHTING DIRECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Use a bold, intentional color palette (2–3 hero colors max)
- High contrast between subject and background — subject must pop
- Cinematic lighting: dramatic rim light, god rays, neon glow, or studio-quality key light depending on niche mood
- Shadows add depth — never flat, never washed out
- Color grade should feel premium: rich blacks, saturated mids, crisp highlights
- Consider complementary or split-complementary color theory for maximum visual tension

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EMOTIONAL & PSYCHOLOGICAL IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- The thumbnail must trigger an immediate emotional response: curiosity, desire, shock, aspiration, or urgency — pick the one most aligned with the hook
- Facial expressions (if human subject): exaggerated, expressive, and emotionally congruent with the hook — viewers decide in milliseconds
- Composition should create visual tension that makes the viewer feel they NEED to click to resolve it
- Use negative space intentionally to guide the eye, not as empty space

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEXT OVERLAY (CONDITIONAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Include a short text overlay ONLY if it amplifies the hook or adds intrigue
- Maximum: 4 words, 3 words preferred
- Typography: Bold, thick-weight sans-serif (e.g. Impact, Bebas Neue, or similar)
- Text must be legible at thumbnail size — high contrast, drop shadow or outline stroke
- No hashtags, no handles, no watermarks, no fine print
- If text adds zero value, omit it entirely — visual storytelling alone is more powerful

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE PROHIBITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗ No watermarks or logos
✗ No borders, frames, or vignette overlays
✗ No stock-photo aesthetic or generic imagery
✗ No cluttered or busy backgrounds that compete with the subject
✗ No tiny, unreadable text
✗ No more than one focal subject
✗ No flat or AI-looking lighting — it must feel real, cinematic, and alive

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY BENCHMARK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before finalizing, ask yourself:
  → Would a top MrBeast editor approve this thumbnail?
  → Does it look better than the 9 other thumbnails on screen right now?
  → Does a stranger immediately understand the emotion or intrigue within 1 second?
  → Would this work as a full-page magazine ad or billboard?

If the answer to any of these is no — redo it. Only output when the answer to all four is yes.`;
}

export function buildRefinementPrompt(
  content: string,
  instruction: string,
  context?: { platform: string; niche: string }
): string {
  return `You are a viral content strategist. Your goal is to rewrite the provided script fragment based on a specific instruction.

CONTEXT:
- Platform: ${context?.platform || "General Social Media"}
- Niche: ${context?.niche || "General Content"}

FRAGMENT TO REWRITE:
"${content}"

INSTRUCTION:
${instruction}

RULES:
1. Maintain the original core meaning but transform the delivery.
2. Keep it under the original character count if possible, unless "extend" is requested.
3. If it's a hook, make it even more "scroll-stopping".
4. If it's a scene direction, make it more visual.
5. ONLY return the rewritten text. Do not add explanations, quotes, or markdown.`;
}