import { getSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get("client_id")
    const beforeYear = searchParams.get("before_year")
    const beforeMonth = searchParams.get("before_month")

    let query = supabase
      .from("orders")
      .select(`
        *,
        clients (
          name,
          city
        )
      `)
      .order("order_date", { ascending: false })

    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    if (beforeYear && beforeMonth) {
      const beforeDate = `${beforeYear}-${beforeMonth.padStart(2, "0")}-01`
      query = query.lt("order_date", beforeDate)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const { data, error } = await supabase
      .from("orders")
      .insert({
        ...body,
        created_by: session?.user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
