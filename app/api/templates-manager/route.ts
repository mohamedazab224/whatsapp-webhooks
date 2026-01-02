import { type NextRequest, NextResponse } from "next/server"

// GET: عرض القوالب
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const system = searchParams.get("system")

    const templates = [
      {
        id: "1",
        name: "invoice_notification",
        status: "approved",
        event_type: "invoice",
        system: "daftara",
        content: "تم إصدار فاتورة جديدة {{invoice_no}}",
        variables: ["invoice_no", "amount", "due_date"],
        buttons: [{ type: "url", text: "View Invoice", url: "https://app.daftara.io/invoice/{{id}}" }],
      },
    ]

    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// POST: إنشاء قالب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // TODO: حفظ في Supabase
    return NextResponse.json({ success: true, message: "تم إنشاء القالب" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// PUT: تعديل حالة القالب
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, status } = body
    // TODO: تحديث الحالة في Supabase
    return NextResponse.json({ success: true, message: "تم تحديث القالب" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
