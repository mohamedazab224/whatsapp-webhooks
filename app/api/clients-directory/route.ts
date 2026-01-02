import { type NextRequest, NextResponse } from "next/server"

// GET: عرض العملاء مع البحث
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const system = searchParams.get("system")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const clients = [
      {
        id: "1",
        wa_id: "+966505555555",
        name: "أحمد محمد",
        phone: "0505555555",
        email: "ahmed@example.com",
        systems: ["daftara", "uberfix"],
        opt_in_status: true,
        client_type: "individual",
        last_message_at: new Date(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: clients,
      pagination: { page, limit, total: clients.length },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// POST: إضافة عميل جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // TODO: حفظ في Supabase
    return NextResponse.json({ success: true, message: "تم إضافة العميل" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
