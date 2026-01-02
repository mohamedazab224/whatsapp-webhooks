import { type NextRequest, NextResponse } from "next/server"
import { AIRouter, type AIResponse } from "@/lib/ai-router"
import { knowledgeBase } from "@/lib/knowledge-base"

export async function POST(request: NextRequest) {
  try {
    const { message, phone, useKnowledgeBase, preferredProvider } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    const customerPhone = phone || "test-user"

    // إضافة context من قاعدة المعرفة إذا كان مفعل
    let enhancedMessage = message
    if (useKnowledgeBase) {
      const context = knowledgeBase.getContextForQuery(message)
      if (context) {
        enhancedMessage = message + context
      }
    }

    // الحصول على رد من AI Router مع اختيار المزود
    const aiResponse: AIResponse = await AIRouter.getBestResponse(
      customerPhone,
      enhancedMessage,
      preferredProvider || "auto",
    )

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      provider: aiResponse.provider,
      confidence: aiResponse.confidence,
      hasKnowledgeContext: useKnowledgeBase && knowledgeBase.searchDocuments(message).length > 0,
    })
  } catch (error) {
    console.error("[v0] Error in AI chat:", error)
    return NextResponse.json({ success: false, error: "Failed to get AI response" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stats = AIRouter.getProviderStats()
    return NextResponse.json({
      success: true,
      providerStats: stats,
    })
  } catch (error) {
    console.error("[v0] Error getting stats:", error)
    return NextResponse.json({ success: false, error: "Failed to get stats" }, { status: 500 })
  }
}
