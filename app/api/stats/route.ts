import { NextResponse } from "next/server"
import { fetchMessageStats } from "@/lib/kapso-client"

export async function GET() {
  const stats = await fetchMessageStats()

  return NextResponse.json({
    success: true,
    stats,
  })
}
