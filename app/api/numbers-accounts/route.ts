import { type NextRequest, NextResponse } from "next/server"

// GET: عرض الأرقام
export async function GET(request: NextRequest) {
  try {
    const numbers = [
      {
        id: "1",
        wa_number: "+1 (555) 724-5001",
        quality: "green",
        rate_limit: 1000,
        messages_sent_today: 245,
        system: "both",
        is_active: true,
      },
    ]

    return NextResponse.json({ success: true, data: numbers })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// PATCH: تحديث حالة الرقم
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { numberId, system, messageType } = body
    // TODO: تحديث في Supabase
    return NextResponse.json({ success: true, message: "تم تحديث الرقم" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
