import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveScriptSchema } from "@/schemas/api";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const THUMBNAIL_BUCKET = process.env.SUPABASE_THUMBNAIL_BUCKET || "thumbnails";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const projectId = searchParams.get("project_id");
  const platform = searchParams.get("platform");
  const niche = searchParams.get("niche");

  let query = supabase
    .from("scripts")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);
  if (platform) query = query.eq("platform", platform);
  if (niche) query = query.eq("niche", niche);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scripts: data, total: data.length });
}

async function uploadThumbnailIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  base64?: string
) {
  if (!base64) return null;

  try {
    const normalizedBase64 = base64.includes(",") ? (base64.split(",").pop() || "") : base64;
    if (!normalizedBase64) return null;

    const buf = Buffer.from(normalizedBase64, "base64");
    const name = `${userId}/${randomUUID()}.png`;

    const { error: uploadError } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(name, buf, { contentType: "image/png", upsert: true });

    if (uploadError) {
      console.error("Thumbnail upload error:", uploadError);
      return null;
    }

    const { data: publicData } = supabase.storage.from(THUMBNAIL_BUCKET).getPublicUrl(name);
    return publicData?.publicUrl || null;
  } catch (err) {
    console.error("Failed to upload thumbnail:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const validation = saveScriptSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
  }

  const payload = {
    ...validation.data,
    user_id: user.id,
  } as typeof validation.data & {
    user_id: string;
    thumbnail_base64?: string;
    thumbnail_url?: string;
  };

  let thumbnailUrl: string | null = null;
  if (payload.thumbnail_base64) {
    thumbnailUrl = await uploadThumbnailIfPresent(supabase, user.id, payload.thumbnail_base64);
    delete payload.thumbnail_base64;
    if (thumbnailUrl) payload.thumbnail_url = thumbnailUrl;
  }

  const { data, error } = await supabase
    .from("scripts")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return NextResponse.json(data);
}
