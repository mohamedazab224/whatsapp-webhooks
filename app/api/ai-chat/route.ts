import { type NextRequest, NextResponse } from "next/server"
import { azureOpenAIAgent } from "@/lib/azure-openai-agent"
import { knowledgeBase } from "@/lib/knowledge-base"

export async function POST(request: NextRequest) {
  try {
    const { message, phone, useKnowledgeBase } = await request.json()

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

    // الحصول على رد من AI Agent
    const response = await azureOpenAIAgent.respondToMessage(customerPhone, enhancedMessage)

    return NextResponse.json({
      success: true,
      response,
      hasKnowledgeContext: useKnowledgeBase && knowledgeBase.searchDocuments(message).length > 0,
    })
  } catch (error) {
    console.error("[v0] Error in AI chat:", error)
    return NextResponse.json({ success: false, error: "Failed to get AI response" }, { status: 500 })
  }
}
