// نظام تخزين قوالب الرسائل

interface MessageTemplate {
  id: string
  name: string
  category:
    | "auth"
    | "service"
    | "notify"
    | "promo"
    | "system"
    | "marketing"
    | "utility"
    | "authentication"
    | "order"
    | "reminder"
    | "payment"
    | "review"
    | "support"
    | "emergency"
  language: string
  status: "approved" | "pending" | "rejected"
  content: string
  variables: string[]
  prefix?: string
  createdAt: string
  updatedAt: string
  metaTemplateId?: string
  metaStatus?: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "PAUSED"
  metaRejectionReason?: string
  submittedToMetaAt?: string
  lastMetaCheckAt?: string
}

class TemplateStore {
  private templates: MessageTemplate[] = [
    {
      id: "auth_otp_login",
      name: "OTP Login",
      category: "auth",
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
      language: "ar",
      status: "approved",
      content: "سيتم إجراء صيانة للنظام يوم {{1}} من {{2}} إلى {{3}}. نعتذر عن أي إزعاج.",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // ========== دورة حياة الطلب (7 قوالب) ==========
    {
      id: "order_created",
      name: "إنشاء طلب جديد",
      category: "order",
      language: "ar",
      status: "approved",
      content:
        "تم استلام طلب الصيانة بنجاح.\n\nرقم الطلب: {{1}}\nالخدمة: {{2}}\nالموقع: {{3}}\n\nسيتم مراجعة الطلب والتواصل معك قريبًا.",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "booking_confirmation",
      name: "تأكيد الحجز",
      category: "order",
      language: "ar",
      status: "approved",
      content: "تم تأكيد حجز الخدمة بنجاح.\n\nرقم الطلب: {{1}}\nالموعد: {{2}} الساعة {{3}}\n\nشكراً لثقتك!",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "technician_assigned",
      name: "تعيين الفني",
      category: "order",
      language: "ar",
      status: "approved",
      content: "تم تعيين فني لطلب الصيانة الخاص بك.\n\nرقم الطلب: {{1}}\nالفني: {{2}}\nالموعد: {{3}} – {{4}}",
      variables: ["{{1}}", "{{2}}", "{{3}}", "{{4}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "technician_on_the_way",
      name: "الفني في الطريق",
      category: "order",
      language: "ar",
      status: "approved",
      content: "الفني في الطريق إلى موقعك الآن.\n\nرقم الطلب: {{1}}\nيرجى الاستعداد لاستقباله.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "work_started",
      name: "بدء التنفيذ",
      category: "order",
      language: "ar",
      status: "approved",
      content: "تم بدء تنفيذ أعمال الصيانة.\n\nرقم الطلب: {{1}}",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "work_completed",
      name: "اكتمال التنفيذ",
      category: "order",
      language: "ar",
      status: "approved",
      content: "تم الانتهاء من أعمال الصيانة بنجاح.\n\nرقم الطلب: {{1}}\nنشكرك لاستخدام أوبر فيكس.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order_cancelled",
      name: "إلغاء الطلب",
      category: "order",
      language: "ar",
      status: "approved",
      content: "تم إلغاء طلب الصيانة.\n\nرقم الطلب: {{1}}\nالسبب: {{2}}\n\nيرجى التواصل معنا إذا كان لديك أي استفسار.",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== التذكير والمتابعة (2 قالب) ==========
    {
      id: "appointment_reminder",
      name: "تذكير الموعد",
      category: "reminder",
      language: "ar",
      status: "approved",
      content:
        "تذكير بموعد الخدمة.\n\nرقم الطلب: {{1}}\nالموعد: {{2}} الساعة {{3}}\nالموقع: {{4}}\n\nيرجى التأكد من توفر الوصول للموقع.",
      variables: ["{{1}}", "{{2}}", "{{3}}", "{{4}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "customer_not_available",
      name: "عدم التواجد",
      category: "reminder",
      language: "ar",
      status: "approved",
      content: "تعذر تنفيذ الزيارة لعدم التواجد بالموقع.\n\nرقم الطلب: {{1}}\nيرجى التواصل لإعادة الجدولة.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== القوالب المالية (3 قوالب) ==========
    {
      id: "invoice_notification",
      name: "إصدار فاتورة",
      category: "payment",
      language: "ar",
      status: "approved",
      content: "تم إصدار فاتورة خدمة الصيانة.\n\nرقم الفاتورة: {{1}}\nالمبلغ: {{2}} ريال\nرابط الدفع: {{3}}",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "payment_reminder",
      name: "تذكير سداد",
      category: "payment",
      language: "ar",
      status: "approved",
      content: "تذكير بسداد فاتورة خدمة الصيانة.\n\nرقم الفاتورة: {{1}}\nالمبلغ: {{2}}\nرابط الدفع: {{3}}",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "payment_received",
      name: "تأكيد الدفع",
      category: "payment",
      language: "ar",
      status: "approved",
      content: "تم استلام الدفعة بنجاح.\n\nرقم الفاتورة: {{1}}\nنشكرك على ثقتك.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== قوالب التقييم والجودة (2 قالب) ==========
    {
      id: "request_review",
      name: "طلب تقييم",
      category: "review",
      language: "ar",
      status: "approved",
      content: "هل رضيت عن الخدمة؟\n\nرقم الطلب: {{1}}\nرابط التقييم: {{2}}\n\nآراؤك تساعدنا على التحسن.",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "complaint_received",
      name: "شكوى مسجلة",
      category: "review",
      language: "ar",
      status: "approved",
      content: "تم تسجيل ملاحظتك بنجاح.\n\nرقم البلاغ: {{1}}\nسيقوم فريق الدعم بالتواصل معك قريباً.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== قوالب الدعم (3 قوالب) ==========
    {
      id: "support_ticket_created",
      name: "فتح تذكرة دعم",
      category: "support",
      language: "ar",
      status: "approved",
      content: "تم فتح تذكرة دعم جديدة.\n\nرقم التذكرة: {{1}}\nالموضوع: {{2}}\nسيتم الرد عليك قريباً.",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "support_ticket_update",
      name: "تحديث تذكرة دعم",
      category: "support",
      language: "ar",
      status: "approved",
      content: "تم تحديث تذكرة الدعم الخاصة بك.\n\nرقم التذكرة: {{1}}\nالحالة: {{2}}\nالتحديث: {{3}}",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "support_ticket_closed",
      name: "إغلاق تذكرة دعم",
      category: "support",
      language: "ar",
      status: "approved",
      content: "تم إغلاق تذكرة الدعم.\n\nرقم التذكرة: {{1}}\nشكراً لتواصلك معنا.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== قوالب الطوارئ والتنبيهات (3 قوالب) ==========
    {
      id: "visit_delayed",
      name: "تأخير الزيارة",
      category: "emergency",
      language: "ar",
      status: "approved",
      content:
        "سيتأخر موعد الزيارة المقررة.\n\nرقم الطلب: {{1}}\nالموعد الجديد: {{2}}\nالسبب: {{3}}\n\nنعتذر عن الإزعاج.",
      variables: ["{{1}}", "{{2}}", "{{3}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "service_unavailable",
      name: "تعذر التنفيذ",
      category: "emergency",
      language: "ar",
      status: "approved",
      content: "للأسف، تعذر توفير الخدمة المطلوبة.\n\nرقم الطلب: {{1}}\nالسبب: {{2}}\nيرجى التواصل معنا للتفاصيل.",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "additional_info_required",
      name: "طلب معلومات إضافية",
      category: "emergency",
      language: "ar",
      status: "approved",
      content: "نحتاج معلومات إضافية لاستكمال طلبك.\n\nرقم الطلب: {{1}}\nالمطلوب: {{2}}\nيرجى الرد سريعاً.",
      variables: ["{{1}}", "{{2}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },

    // ========== قوالب النظام والحساب (3 قوالب) ==========
    {
      id: "account_created",
      name: "إنشاء حساب",
      category: "system",
      language: "ar",
      status: "approved",
      content: "مرحباً! تم إنشاء حسابك بنجاح.\n\nاسم المستخدم: {{1}}\nيمكنك الآن استخدام جميع الخدمات.",
      variables: ["{{1}}"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "security_alert",
      name: "تنبيه أمني",
      category: "system",
      language: "ar",
      status: "approved",
      content:
        "تنبيه أمني: تم اكتشاف محاولة وصول غير عادية.\n\nإذا لم تكن أنت من قام بهذا، يرجى تغيير كلمة المرور فوراً.",
      variables: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "service_suspended",
      name: "إيقاف خدمة مؤقت",
      category: "system",
      language: "ar",
      status: "approved",
      content: "تم إيقاف الخدمة مؤقتاً.\n\nالسبب: {{1}}\nسيتم استئناف الخدمة قريباً.",
      variables: ["{{1}}"],
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
        order: this.templates.filter((t) => t.category === "order").length,
        reminder: this.templates.filter((t) => t.category === "reminder").length,
        payment: this.templates.filter((t) => t.category === "payment").length,
        review: this.templates.filter((t) => t.category === "review").length,
        support: this.templates.filter((t) => t.category === "support").length,
        emergency: this.templates.filter((t) => t.category === "emergency").length,
      },
    }
  }
}

export const templateStore = new TemplateStore()
export type { MessageTemplate }
