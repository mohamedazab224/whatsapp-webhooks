import { azureOpenAIAgent } from "@/lib/azure-openai-agent"
import { deepSeekAgent } from "@/lib/deepseek-agent"

export interface AIResponse {
  response: string
  provider: "azure" | "deepseek"
  timestamp: string
  confidence?: number
}

export class AIRouter {
  private static conversationHistory: Map<string, { provider: string; count: number }> = new Map()

  static async getBestResponse(
    userId: string,
    message: string,
    preferredProvider?: "azure" | "deepseek" | "auto",
  ): Promise<AIResponse> {
    const messageLower = message.toLowerCase()

    // إذا كان هناك تفضيل صريح للمزود
    if (preferredProvider && preferredProvider !== "auto") {
      try {
        const response =
          preferredProvider === "deepseek"
            ? await deepSeekAgent.respondToMessage(userId, message)
            : await azureOpenAIAgent.respondToMessage(userId, message)

        this.trackProviderUsage(userId, preferredProvider)
        return {
          response,
          provider: preferredProvider,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error(`[v0] Error with ${preferredProvider}:`, error)
        // العودة للمزود البديل
        preferredProvider = preferredProvider === "deepseek" ? "azure" : "deepseek"
      }
    }

    // توجيه ذكي حسب نوع الاستعلام
    try {
      // استعلامات الأسعار - DeepSeek أفضل للتحليل السريع
      if (messageLower.includes("سعر") || messageLower.includes("تكلفة") || messageLower.includes("عرض")) {
        const response = await deepSeekAgent.respondToMessage(userId, message)
        this.trackProviderUsage(userId, "deepseek")
        return {
          response,
          provider: "deepseek",
          timestamp: new Date().toISOString(),
          confidence: 0.95,
        }
      }

      // استعلامات المعلومات الثابتة - Azure أفضل للدقة
      if (
        messageLower.includes("موقع") ||
        messageLower.includes("عنوان") ||
        messageLower.includes("ساعات") ||
        messageLower.includes("رقم")
      ) {
        const response = await azureOpenAIAgent.respondToMessage(userId, message)
        this.trackProviderUsage(userId, "azure")
        return {
          response,
          provider: "azure",
          timestamp: new Date().toISOString(),
          confidence: 0.9,
        }
      }

      // استعلامات صيانة معقدة - Azure أفضل للسياق
      if (
        messageLower.includes("صيانة") ||
        messageLower.includes("فني") ||
        messageLower.includes("حجز") ||
        messageLower.includes("موعد")
      ) {
        const response = await azureOpenAIAgent.respondToMessage(userId, message)
        this.trackProviderUsage(userId, "azure")
        return {
          response,
          provider: "azure",
          timestamp: new Date().toISOString(),
          confidence: 0.92,
        }
      }

      // الاستعلامات العامة - جرب Azure أولاً ثم DeepSeek
      try {
        const response = await azureOpenAIAgent.respondToMessage(userId, message)
        this.trackProviderUsage(userId, "azure")
        return {
          response,
          provider: "azure",
          timestamp: new Date().toISOString(),
        }
      } catch (azureError) {
        console.warn("[v0] Azure failed, falling back to DeepSeek:", azureError)
        const response = await deepSeekAgent.respondToMessage(userId, message)
        this.trackProviderUsage(userId, "deepseek")
        return {
          response,
          provider: "deepseek",
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error("[v0] All AI providers failed:", error)
      return {
        response: "عذراً، حدث خطأ في نظام الذكاء الاصطناعي. سيتم تحويلك لفريق الدعم البشري.",
        provider: "azure",
        timestamp: new Date().toISOString(),
      }
    }
  }

  // تتبع استخدام المزودين
  private static trackProviderUsage(userId: string, provider: "azure" | "deepseek") {
    const history = this.conversationHistory.get(userId) || { provider: "", count: 0 }
    if (history.provider !== provider) {
      history.count = 1
    } else {
      history.count++
    }
    history.provider = provider
    this.conversationHistory.set(userId, history)

    console.log(`[v0] Provider tracking - User: ${userId}, Provider: ${provider}, Count: ${history.count}`)
  }

  // الحصول على إحصائيات المزودين
  static getProviderStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {
      azure: 0,
      deepseek: 0,
    }

    this.conversationHistory.forEach((history) => {
      stats[history.provider]++
    })

    return stats
  }
}
