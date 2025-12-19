// Azure OpenAI Agent للرد على رسائل العملاء وطلبات الصيانة

import { knowledgeBase } from "./knowledge-base"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

interface MaintenanceRequest {
  id: string
  customerName: string
  customerPhone: string
  issueDescription: string
  urgency: "low" | "medium" | "high" | "urgent"
  category: "plumbing" | "electrical" | "ac" | "carpentry" | "painting" | "other"
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  createdAt: string
  assignedTo?: string
}

class AzureOpenAIAgent {
  private apiKey: string
  private deployment: string
  private endpoint: string
  private conversationHistory: Map<string, ChatMessage[]> = new Map()
  private maintenanceRequests: MaintenanceRequest[] = []

  constructor() {
    this.apiKey = process.env.AZURE_OPENAI_KEY || ""
    this.deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "AzaBot"
    this.endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://azabotai.openai.azure.com"

    if (!this.apiKey) {
      console.warn("[v0] Azure OpenAI API key not configured")
    }
  }

  // النظام الأساسي للبوت
  private getSystemPrompt(): string {
    const basePrompt = `أنت مساعد ذكي لشركة Uberfix لخدمات الصيانة المنزلية. مهمتك:

1. الترحيب بالعملاء بطريقة احترافية ودودة
2. الاستماع لمشاكل الصيانة واحتياجات العملاء
3. جمع المعلومات الضرورية: نوع المشكلة، الموقع، مستوى الطوارئ
4. إنشاء طلب صيانة إذا طلب العميل ذلك
5. تقديم نصائح سريعة للصيانة الأساسية عند الحاجة
6. التحويل للموظف البشري في الحالات المعقدة أو عند طلب العميل

أنواع الخدمات المتاحة:
- السباكة (Plumbing): تسريب مياه، انسداد مجاري، صيانة خزانات
- الكهرباء (Electrical): مشاكل الكهرباء، إضاءة، تمديدات
- التكييف (AC): صيانة مكيفات، تعبئة فريون، تنظيف
- النجارة (Carpentry): صيانة أبواب، نوافذ، أثاث
- الدهان (Painting): دهانات، تشطيبات
- أخرى (Other): أي خدمات صيانة أخرى

كن مختصراً ومباشراً في ردودك. استخدم اللغة العربية بشكل أساسي مع القدرة على الرد بالإنجليزية عند الحاجة.`

    const kbStats = knowledgeBase.getStats()
    if (kbStats.totalDocuments > 0) {
      return (
        basePrompt +
        `\n\nلديك وصول لقاعدة معرفة تحتوي على ${kbStats.totalDocuments} مستند. استخدم هذه المعلومات للإجابة بدقة أكبر.`
      )
    }

    return basePrompt
  }

  // الرد على رسالة العميل
  async respondToMessage(customerPhone: string, messageText: string): Promise<string> {
    if (!this.apiKey) {
      return "عذراً، النظام غير متاح حالياً. سيتم تحويلك لموظف خدمة العملاء."
    }

    try {
      let history = this.conversationHistory.get(customerPhone) || []

      if (history.length === 0) {
        history.push({
          role: "system",
          content: this.getSystemPrompt(),
        })
      }

      const knowledgeContext = knowledgeBase.getContextForQuery(messageText)
      const enhancedMessage = messageText + knowledgeContext

      history.push({
        role: "user",
        content: enhancedMessage,
      })

      // استدعاء Azure OpenAI API
      const response = await fetch(
        `${this.endpoint}/openai/deployments/${this.deployment}/chat/completions?api-version=2024-08-01-preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": this.apiKey,
          },
          body: JSON.stringify({
            messages: history,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Azure OpenAI API Error:", error)
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      const aiResponse = data.choices[0]?.message?.content || "عذراً، لم أتمكن من معالجة طلبك."

      // حفظ رد البوت في التاريخ
      history.push({
        role: "assistant",
        content: aiResponse,
      })

      // حفظ التاريخ المحدث (الاحتفاظ بآخر 10 رسائل فقط)
      if (history.length > 21) {
        // 1 system + 20 messages
        history = [history[0], ...history.slice(-20)]
      }
      this.conversationHistory.set(customerPhone, history)

      // تحليل الرد لمعرفة إذا كان يحتاج لإنشاء طلب صيانة
      await this.analyzeForMaintenanceRequest(customerPhone, messageText, aiResponse)

      return aiResponse
    } catch (error) {
      console.error("[v0] Error in AI response:", error)
      return "عذراً، حدث خطأ. سيتم تحويلك لموظف خدمة العملاء للمساعدة."
    }
  }

  // تحليل المحادثة لإنشاء طلب صيانة
  private async analyzeForMaintenanceRequest(
    customerPhone: string,
    userMessage: string,
    aiResponse: string,
  ): Promise<void> {
    const lowerMessage = userMessage.toLowerCase()

    // كلمات مفتاحية لإنشاء طلب صيانة
    const requestKeywords = [
      "طلب صيانة",
      "محتاج فني",
      "عايز حد",
      "ابغى فني",
      "حجز موعد",
      "book",
      "request",
      "need technician",
    ]

    const hasRequestKeyword = requestKeywords.some((keyword) => lowerMessage.includes(keyword))

    if (hasRequestKeyword) {
      // استخراج التفاصيل من المحادثة
      const category = this.extractCategory(userMessage)
      const urgency = this.extractUrgency(userMessage)

      const request: MaintenanceRequest = {
        id: `REQ-${Date.now()}`,
        customerName: "Unknown", // سيتم تحديثه لاحقاً
        customerPhone: customerPhone,
        issueDescription: userMessage,
        urgency: urgency,
        category: category,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      this.maintenanceRequests.push(request)
      console.log("[v0] Maintenance request created:", request)
    }
  }

  // استخراج فئة الخدمة من النص
  private extractCategory(text: string): MaintenanceRequest["category"] {
    const lowerText = text.toLowerCase()

    if (lowerText.includes("سباك") || lowerText.includes("تسريب") || lowerText.includes("مياه")) {
      return "plumbing"
    }
    if (lowerText.includes("كهرب") || lowerText.includes("كهرباء") || lowerText.includes("إضاءة")) {
      return "electrical"
    }
    if (lowerText.includes("مكيف") || lowerText.includes("تكييف") || lowerText.includes("فريون")) {
      return "ac"
    }
    if (lowerText.includes("نجار") || lowerText.includes("باب") || lowerText.includes("نافذ")) {
      return "carpentry"
    }
    if (lowerText.includes("دهان") || lowerText.includes("طلاء") || lowerText.includes("صبغ")) {
      return "painting"
    }

    return "other"
  }

  // استخراج مستوى الطوارئ من النص
  private extractUrgency(text: string): MaintenanceRequest["urgency"] {
    const lowerText = text.toLowerCase()

    if (
      lowerText.includes("عاجل") ||
      lowerText.includes("urgent") ||
      lowerText.includes("طوارئ") ||
      lowerText.includes("emergency")
    ) {
      return "urgent"
    }
    if (lowerText.includes("مهم") || lowerText.includes("سريع") || lowerText.includes("important")) {
      return "high"
    }
    if (lowerText.includes("عادي") || lowerText.includes("normal")) {
      return "medium"
    }

    return "low"
  }

  // مسح تاريخ المحادثة
  clearConversation(customerPhone: string): void {
    this.conversationHistory.delete(customerPhone)
  }

  // الحصول على تاريخ المحادثة
  getConversationHistory(customerPhone: string): ChatMessage[] {
    return this.conversationHistory.get(customerPhone) || []
  }

  // الحصول على طلبات الصيانة
  getMaintenanceRequests(): MaintenanceRequest[] {
    return this.maintenanceRequests
  }

  // تحديث حالة طلب الصيانة
  updateMaintenanceRequest(requestId: string, updates: Partial<MaintenanceRequest>): boolean {
    const index = this.maintenanceRequests.findIndex((req) => req.id === requestId)
    if (index !== -1) {
      this.maintenanceRequests[index] = { ...this.maintenanceRequests[index], ...updates }
      return true
    }
    return false
  }

  // الحصول على إحصائيات
  getStats() {
    return {
      totalConversations: this.conversationHistory.size,
      totalMaintenanceRequests: this.maintenanceRequests.length,
      pendingRequests: this.maintenanceRequests.filter((req) => req.status === "pending").length,
      urgentRequests: this.maintenanceRequests.filter((req) => req.urgency === "urgent").length,
    }
  }
}

export const azureOpenAIAgent = new AzureOpenAIAgent()
export type { ChatMessage, MaintenanceRequest }
