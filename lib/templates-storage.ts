// نظام تخزين قوالب الرسائل

interface MessageTemplate {
  id: string
  name: string
  category: "auth" | "service" | "notify" | "promo" | "system" | "marketing" | "utility" | "authentication"
  language: string
  status: "approved" | "pending" | "rejected"
  content: string
  variables: string[]
  prefix: string
  createdAt: string
  updatedAt: string
}

class TemplateStore {
  private templates: MessageTemplate[] = [
    {
      id: "auth_otp_login",
      name: "OTP Login",
      category: "auth",
      prefix: "auth_",
      language: "ar",
      status: "approved",
      content: "رمز التحقق الخاص بك هو: {{1}}. صالح لمدة 5 دقائق.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "service_maintenance_request",
      name: "طلب صيانة",
      category: "service",
      prefix: "service_",
      language: "ar",
      status: "approved",
      content: "تم استلام طلب الصيانة رقم {{1}}. سيتواصل معك الفني قريباً.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "notify_order_status",
      name: "تحديث حالة الطلب",
      category: "notify",
      prefix: "notify_",
      language: "ar",
      status: "approved",
      content: "طلبك رقم {{1}} أصبح في حالة: {{2}}. شكراً لثقتك!",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "promo_special_offer",
      name: "عرض خاص",
      category: "promo",
      prefix: "promo_",
      language: "ar",
      status: "approved",
      content: "عرض خاص لك! خصم {{1}}% على جميع الخدمات. استخدم الكود: {{2}}",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "system_update_notification",
      name: "إشعار تحديث النظام",
      category: "system",
      prefix: "system_",
      language: "ar",
      status: "approved",
      content: "سيتم إجراء صيانة للنظام يوم {{1}} من {{2}} إلى {{3}}. نعتذر عن أي إزعاج.",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  getAllTemplates(): MessageTemplate[] {
    return this.templates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }

  getTemplateById(id: string): MessageTemplate | undefined {
    return this.templates.find((t) => t.id === id)
  }

  getApprovedTemplates(): MessageTemplate[] {
    return this.templates.filter((t) => t.status === "approved")
  }

  addTemplate(template: Omit<MessageTemplate, "id" | "createdAt" | "updatedAt">): MessageTemplate {
    const newTemplate: MessageTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.templates.push(newTemplate)
    console.log("[v0] Template created:", newTemplate.id)
    return newTemplate
  }

  updateTemplate(id: string, updates: Partial<MessageTemplate>): MessageTemplate | null {
    const template = this.templates.find((t) => t.id === id)
    if (template) {
      Object.assign(template, updates, { updatedAt: new Date().toISOString() })
      console.log("[v0] Template updated:", id)
      return template
    }
    return null
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.templates.splice(index, 1)
      console.log("[v0] Template deleted:", id)
      return true
    }
    return false
  }

  fillTemplate(templateId: string, values: string[]): string | null {
    const template = this.getTemplateById(templateId)
    if (!template) return null

    let content = template.content
    template.variables.forEach((variable, index) => {
      if (values[index]) {
        content = content.replace(variable, values[index])
      }
    })

    return content
  }

  getTemplatesByCategory(category: MessageTemplate["category"]): MessageTemplate[] {
    return this.templates.filter((t) => t.category === category && t.status === "approved")
  }

  getTemplatesByPrefix(prefix: string): MessageTemplate[] {
    return this.templates.filter((t) => t.prefix === prefix && t.status === "approved")
  }

  getTemplateStats() {
    return {
      total: this.templates.length,
      approved: this.templates.filter((t) => t.status === "approved").length,
      pending: this.templates.filter((t) => t.status === "pending").length,
      rejected: this.templates.filter((t) => t.status === "rejected").length,
      byCategory: {
        auth: this.templates.filter((t) => t.category === "auth").length,
        service: this.templates.filter((t) => t.category === "service").length,
        notify: this.templates.filter((t) => t.category === "notify").length,
        promo: this.templates.filter((t) => t.category === "promo").length,
        system: this.templates.filter((t) => t.category === "system").length,
        marketing: this.templates.filter((t) => t.category === "marketing").length,
        utility: this.templates.filter((t) => t.category === "utility").length,
        authentication: this.templates.filter((t) => t.category === "authentication").length,
      },
    }
  }
}

export const templateStore = new TemplateStore()
export type { MessageTemplate }
