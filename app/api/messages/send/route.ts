import { type NextRequest, NextResponse } from "next/server"
import { sendWhatsAppMessage, formatPhoneNumber } from "@/lib/whatsapp"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, message } = body

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "رقم الهاتف والرسالة مطلوبان" }, { status: 400 })
    }

    const formattedPhone = formatPhoneNumber(phoneNumber)
    console.log("[v0] Sending message to:", formattedPhone)

    const data = await sendWhatsAppMessage({
      phoneNumber: formattedPhone,
      message,
    })

    console.log("[v0] Message sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "تم إرسال الرسالة بنجاح",
      data,
    })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء إرسال الرسالة",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
