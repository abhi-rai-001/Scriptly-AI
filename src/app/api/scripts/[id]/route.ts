import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateScriptSchema } from "@/schemas/api";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const THUMBNAIL_BUCKET = process.env.SUPABASE_THUMBNAIL_BUCKET || "thumbnails";

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

function extractStoragePathFromPublicUrl(publicUrl?: string | null): string | null {
  if (!publicUrl) return null;
  try {
    const parsed = new URL(publicUrl);
    const prefix = `/storage/v1/object/public/${THUMBNAIL_BUCKET}/`;
    const index = parsed.pathname.indexOf(prefix);
    if (index === -1) return null;
    return decodeURIComponent(parsed.pathname.slice(index + prefix.length));
  } catch {
    return null;
  }
}

async function deleteStoredThumbnailIfOwned(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  publicUrl?: string | null
) {
  const storagePath = extractStoragePathFromPublicUrl(publicUrl);
  if (!storagePath || !storagePath.startsWith(`${userId}/`)) return;

  const { error } = await supabase.storage.from(THUMBNAIL_BUCKET).remove([storagePath]);
  if (error) {
    console.error("Thumbnail delete error:", error);
  }
}

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const validation = updateScriptSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
  }

  const { data: existingScript, error: existingError } = await supabase
    .from("scripts")
    .select("thumbnail_url")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const payload = {
    ...validation.data,
    updated_at: new Date().toISOString(),
  } as typeof validation.data & {
    updated_at: string;
    thumbnail_base64?: string;
    thumbnail_url?: string;
  };
  if (payload.thumbnail_base64) {
    const thumbnailUrl = await uploadThumbnailIfPresent(supabase, user.id, payload.thumbnail_base64);
    delete payload.thumbnail_base64;
    if (thumbnailUrl) payload.thumbnail_url = thumbnailUrl;
  }

  const { data, error } = await supabase
    .from("scripts")
    .update(payload)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (payload.thumbnail_url && payload.thumbnail_url !== existingScript.thumbnail_url) {
    await deleteStoredThumbnailIfOwned(supabase, user.id, existingScript.thumbnail_url);
  }
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existingScript, error: existingError } = await supabase
    .from("scripts")
    .select("thumbnail_url")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });

  const { error } = await supabase
    .from("scripts")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await deleteStoredThumbnailIfOwned(supabase, user.id, existingScript.thumbnail_url);
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  return NextResponse.json({ success: true });
}
