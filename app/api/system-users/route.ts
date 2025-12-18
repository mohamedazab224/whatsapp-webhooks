import { NextResponse } from "next/server"
import { systemUsersManager } from "@/lib/system-users"

export async function GET() {
  try {
    const users = systemUsersManager.getAllUsers()
    const stats = systemUsersManager.getStats()

    return NextResponse.json({
      users,
      stats,
    })
  } catch (error) {
    console.error("[v0] Error fetching system users:", error)
    return NextResponse.json({ error: "Failed to fetch system users" }, { status: 500 })
  }
}
