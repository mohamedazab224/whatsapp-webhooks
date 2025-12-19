import { type NextRequest, NextResponse } from "next/server"
import { azureOpenAIAgent } from "@/lib/azure-openai-agent"

// GET - الحصول على طلبات الصيانة
export async function GET(request: NextRequest) {
  try {
    const requests = azureOpenAIAgent.getMaintenanceRequests()
    return NextResponse.json({ success: true, requests })
  } catch (error) {
    console.error("[v0] Error fetching maintenance requests:", error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  }
}

// POST - تحديث طلب صيانة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, updates } = body

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const success = azureOpenAIAgent.updateMaintenanceRequest(requestId, updates)

    if (success) {
      return NextResponse.json({ success: true, message: "Request updated successfully" })
    } else {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("[v0] Error updating maintenance request:", error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
  }
}
