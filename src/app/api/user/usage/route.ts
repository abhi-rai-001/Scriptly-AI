import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({
        scripts_count: 0,
        thumbnails_count: 0,
        scripts_limit: 100,
        thumbnails_limit: 100,
      });
    }

    return NextResponse.json({
      ...data,
      scripts_limit: 100, // Hardcoded for now
      thumbnails_limit: 100, // Hardcoded for now
    });
  } catch (error: any) {
    console.error("Usage fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
