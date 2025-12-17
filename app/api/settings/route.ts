import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase.from("company_settings").select("*").maybeSingle()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const { data: existing } = await supabase.from("company_settings").select("*").maybeSingle()

    let data, error

    if (!existing) {
      // Create new settings
      const result = await supabase.from("company_settings").insert([body]).select().single()
      data = result.data
      error = result.error
    } else {
      // Update existing settings
      const result = await supabase.from("company_settings").update(body).eq("id", existing.id).select().single()
      data = result.data
      error = result.error
    }

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
