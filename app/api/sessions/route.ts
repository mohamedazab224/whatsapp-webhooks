import { NextResponse, type NextRequest } from "next/server"
import { systemUsersManager } from "@/lib/system-users"

// الحصول على جميع الجلسات النشطة
export async function GET() {
  try {
    const humanSessions = systemUsersManager.getActiveHumanSessions()
    const stats = systemUsersManager.getStats()

    return NextResponse.json({
      humanSessions,
      stats,
    })
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

// تحويل جلسة من bot إلى human أو العكس
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, action, reason } = await request.json()

    if (!phoneNumber || !action) {
      return NextResponse.json({ error: "phoneNumber and action are required" }, { status: 400 })
    }

    let success = false
    if (action === "handover_to_human") {
      success = systemUsersManager.handoverToHuman(phoneNumber, reason || "Manual handover")
    } else if (action === "handover_to_bot") {
      success = systemUsersManager.handoverToBot(phoneNumber)
    }

    if (success) {
      return NextResponse.json({ success: true, message: "Handover completed" })
    } else {
      return NextResponse.json({ error: "Handover failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Error handling handover:", error)
    return NextResponse.json({ error: "Failed to process handover" }, { status: 500 })
  }
}
