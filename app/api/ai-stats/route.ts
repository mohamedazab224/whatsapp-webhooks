import { type NextRequest, NextResponse } from "next/server"
import { azureOpenAIAgent } from "@/lib/azure-openai-agent"

// GET - الحصول على إحصائيات AI Agent
export async function GET(request: NextRequest) {
  try {
    const stats = azureOpenAIAgent.getStats()
    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error("[v0] Error fetching AI stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
