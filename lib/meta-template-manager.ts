interface MetaTemplate {
  id: string
  name: string
  category: string
  language: string
  status: "APPROVED" | "PENDING_APPROVAL" | "REJECTED"
  content: string
  components?: any[]
  createdAt?: string
}

class MetaTemplateManager {
  private businessAccountId: string
  private apiToken: string
  private apiVersion = "v21.0"

  constructor(businessAccountId: string, apiToken: string) {
    this.businessAccountId = businessAccountId
    this.apiToken = apiToken
  }

  async submitTemplate(template: {
    name: string
    language: string
    category: string
    content: string
    variables: string[]
  }): Promise<MetaTemplate> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessAccountId}/message_templates`

    // بناء مكونات القالب
    const components = this.buildComponents(template.content, template.variables)

    const payload = {
      name: template.name,
      language: template.language,
      category: template.category,
      components: components,
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `Failed to submit template to Meta: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      name: template.name,
      category: template.category,
      language: template.language,
      status: "PENDING_APPROVAL",
      content: template.content,
      createdAt: new Date().toISOString(),
    }
  }

  async listTemplates(): Promise<MetaTemplate[]> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.businessAccountId}/message_templates`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to list templates from Meta")
    }

    const data = await response.json()
    return (data.data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      language: item.language,
      status: item.status,
      content: item.components?.[0]?.body?.text || "",
    }))
  }

  async deleteTemplate(templateId: string): Promise<boolean> {
    const url = `https://graph.facebook.com/${this.apiVersion}/${templateId}`

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    return response.ok
  }

  private buildComponents(
    content: string,
    variables: string[],
  ): Array<{ type: string; format?: string; text?: string; body?: any }> {
    const components = []

    // Body component
    if (content) {
      const bodyComponent: any = {
        type: "BODY",
      }

      if (variables.length > 0) {
        // تحويل المتغيرات إلى صيغة Meta
        let processedContent = content
        variables.forEach((variable, index) => {
          processedContent = processedContent.replace(variable, `{{${index + 1}}}`)
        })
        bodyComponent.text = processedContent
      } else {
        bodyComponent.text = content
      }

      components.push(bodyComponent)
    }

    // Header component (اختياري)
    components.push({
      type: "HEADER",
      format: "TEXT",
    })

    // Footer component (اختياري)
    components.push({
      type: "FOOTER",
      text: "جميع الحقوق محفوظة © Uberfix",
    })

    return components
  }
}

export function createMetaTemplateManager(): MetaTemplateManager {
  const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  const apiToken = process.env.WHATSAPP_API_TOKEN

  if (!businessAccountId || !apiToken) {
    throw new Error("Meta credentials not configured")
  }

  return new MetaTemplateManager(businessAccountId, apiToken)
}

export type { MetaTemplate }
