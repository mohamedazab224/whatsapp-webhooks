// نظام Webhook Router الذكي

interface WebhookMessage {
  id: string
  from: string
  type: "text" | "interactive" | "button" | "image" | "document" | "audio" | "video"
  text?: { body: string }
  interactive?: any
  button?: any
  timestamp: string
}

interface RoutingDecision {
  action: "bot" | "human" | "system" | "ignore"
  reason: string
  priority: "low" | "medium" | "high" | "urgent"
  systemUserId?: string
}

class WebhookRouter {
  // كلمات مفتاحية لتحويل المحادثة للموظف
  private handoverTriggers = [
    "موظف",
    "مندوب",
    "شخص",
    "إنسان",
    "شكوى",
    "مشكلة",
    "اعتراض",
    "مدير",
    "complaint",
    "human",
    "agent",
    "representative",
  ]

  // كلمات مفتاحية للردود التلقائية
  private botTriggers = ["مرحبا", "السلام", "hello", "hi", "معلومات", "info", "help", "مساعدة"]

  // عداد عدم الرد
  private unansweredCounts: Map<string, number> = new Map()

  routeMessage(message: WebhookMessage, sessionType?: "bot" | "human" | "system"): RoutingDecision {
    // إذا كانت المحادثة محولة بالفعل للموظف
    if (sessionType === "human") {
      return {
        action: "human",
        reason: "Session already with human agent",
        priority: "high",
      }
    }

    // تحليل نوع الرسالة
    const messageText = message.text?.body?.toLowerCase() || ""

    // تحقق من كلمات التحويل للموظف
    const needsHuman = this.handoverTriggers.some((trigger) => messageText.includes(trigger))
    if (needsHuman) {
      return {
        action: "human",
        reason: `Trigger word detected: ${messageText}`,
        priority: "urgent",
      }
    }

    // الرسائل التفاعلية والأزرار
    if (message.type === "interactive" || message.type === "button") {
      return {
        action: "bot",
        reason: "Interactive message - handled by flow",
        priority: "medium",
      }
    }

    // رسائل الوسائط (صور، فيديو، ملفات)
    if (["image", "document", "audio", "video"].includes(message.type)) {
      return {
        action: "human",
        reason: "Media message requires human review",
        priority: "high",
      }
    }

    // تحقق من عدد الرسائل بدون رد مناسب
    const unansweredCount = this.unansweredCounts.get(message.from) || 0
    if (unansweredCount >= 2) {
      this.unansweredCounts.set(message.from, 0) // إعادة تعيين العداد
      return {
        action: "human",
        reason: "Customer sent 2+ messages without proper response",
        priority: "high",
      }
    }

    // الرسائل النصية العادية - يتعامل معها البوت
    if (message.type === "text") {
      // زيادة العداد
      this.unansweredCounts.set(message.from, unansweredCount + 1)

      return {
        action: "bot",
        reason: "Text message - automated response",
        priority: "low",
      }
    }

    // الحالة الافتراضية
    return {
      action: "bot",
      reason: "Default routing to bot",
      priority: "low",
    }
  }

  resetUnansweredCount(phoneNumber: string) {
    this.unansweredCounts.set(phoneNumber, 0)
  }

  getUnansweredCount(phoneNumber: string): number {
    return this.unansweredCounts.get(phoneNumber) || 0
  }

  // تحليل حالة الرسالة
  analyzeMessageStatus(status: any): { shouldNotify: boolean; priority: string } {
    switch (status.status) {
      case "failed":
        return { shouldNotify: true, priority: "urgent" }
      case "delivered":
        return { shouldNotify: false, priority: "low" }
      case "read":
        return { shouldNotify: false, priority: "low" }
      default:
        return { shouldNotify: false, priority: "low" }
    }
  }

  getStats() {
    return {
      totalTrackedNumbers: this.unansweredCounts.size,
      numbersNeedingAttention: Array.from(this.unansweredCounts.values()).filter((count) => count >= 2).length,
    }
  }
}

export const webhookRouter = new WebhookRouter()
export type { WebhookMessage, RoutingDecision }
