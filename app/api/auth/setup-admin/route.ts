import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Setup admin API called")

    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and fullName are required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase configuration")
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 })
    }

    console.log("[v0] Creating Supabase admin client")

    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    })

    console.log("[v0] Checking for existing admin")
    const { data: existingAdmin, error: checkError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle()

    if (checkError) {
      console.error("[v0] Error checking for existing admin:", checkError)
      return NextResponse.json({ error: "Failed to check for existing admin" }, { status: 500 })
    }

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists. Use the normal login flow." }, { status: 400 })
    }

    console.log("[v0] Creating first admin user:", email)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (authError) {
      console.error("[v0] Error creating user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    console.log("[v0] User created:", authData.user.id)

    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authData.user.id,
      role: "admin",
    })

    if (roleError) {
      console.error("[v0] Error adding admin role:", roleError)
      return NextResponse.json({ error: "Failed to assign admin role" }, { status: 500 })
    }

    console.log("[v0] Admin role assigned successfully")

    return NextResponse.json({ success: true, message: "Admin account created successfully" })
  } catch (error: unknown) {
    console.error("[v0] Error in setup-admin:", error)
    const message = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
