import { NextResponse } from "next/server"
import { messageStore } from "@/lib/storage"

export async function GET() {
  const stats = messageStore.getStats()

  return NextResponse.json({
    success: true,
    stats,
  })
}
