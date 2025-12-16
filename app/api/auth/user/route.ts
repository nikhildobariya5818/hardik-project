import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    // Fetch user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .maybeSingle()

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", session.user.id)
      .maybeSingle()

    const user = {
      id: session.user.id,
      name: profile?.full_name || session.user.email?.split("@")[0] || "User",
      email: session.user.email || "",
      role: roleData?.role || "staff",
    }

    return NextResponse.json({ user, session })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
