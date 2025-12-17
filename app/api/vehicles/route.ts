import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("vehicles").select("*").order("vehicle_number", { ascending: true })

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

    console.log("[v0] Vehicles POST received:", body)

    const vehicleData = {
      vehicle_number: body.vehicle_number,
    }

    console.log("[v0] Vehicle data to insert:", vehicleData)

    const { data, error } = await supabase.from("vehicles").insert([vehicleData]).select().single()

    if (error) {
      console.error("[v0] Vehicle insert error:", error)
      throw error
    }

    console.log("[v0] Vehicle inserted successfully:", data)

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("[v0] Vehicles POST error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ data: { success: true } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
