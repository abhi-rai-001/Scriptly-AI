import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveScriptSchema } from "@/schemas/api";

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

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const validation = saveScriptSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 });
  }

  const payload = { ...validation.data, user_id: user.id };

  // Note: if thumbnail_base64 is provided, we should upload it to Supabase Storage
  // and set thumbnail_url. For now, since storage bucket isn't fully configured with policies,
  // we could just ignore or handle it carefully.
  if (payload.thumbnail_base64) {
    // 1. Decode base64
    // 2. Upload to 'thumbnails' bucket
    // 3. payload.thumbnail_url = public URL
    // For MVP, we will omit it to avoid breaking if storage isn't ready.
    delete payload.thumbnail_base64;
  }

  const { data, error } = await supabase
    .from("scripts")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
