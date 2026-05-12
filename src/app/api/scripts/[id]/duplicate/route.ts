import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Fetch the source script
  const { data: source, error: fetchError } = await supabase
    .from("scripts")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !source) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 });
  }

  // 2. Prepare the duplicate data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...duplicateData } = source;
  duplicateData.title = `${source.title} (Copy)`;
  duplicateData.status = "draft"; // Duplicates start as drafts

  // 3. Insert the duplicate
  const { data: newScript, error: insertError } = await supabase
    .from("scripts")
    .insert(duplicateData)
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");

  return NextResponse.json(newScript);
}
