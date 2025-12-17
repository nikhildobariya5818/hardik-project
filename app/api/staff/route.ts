import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("staff").select("*").order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    console.log("[v0] Staff POST received:", body)

    const staffData: any = {
      name: body.name || body.fullName || "",
      role: body.role || "staff",
    }

    if (body.email) {
      staffData.email = body.email
    }

    console.log("[v0] Staff data to insert:", staffData)

    const { data, error } = await supabase.from("staff").insert([staffData]).select().single()

    if (error) {
      console.error("[v0] Staff insert error:", error)
      throw error
    }

    console.log("[v0] Staff inserted successfully:", data)

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("[v0] Staff POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("staff").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ data: { success: true } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
