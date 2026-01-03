const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "527697617099639"
const KAPSO_API_KEY = process.env.KAPSO_API_KEY || "53681692f5efa9655622650f3ba4dad7acd964c4fdc34a7c13483fe57eccdaeb"
const WABA_ID = process.env.WABA_ID || "459851797218855"
const API_BASE_URL = "https://api.kapso.ai/v1"

async function makeKapsoRequest(endpoint: string, method = "GET", body?: any) {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": KAPSO_API_KEY,
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      console.error(`[v0] Kapso API error: ${response.status} - ${response.statusText}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Kapso request error:", error)
    return null
  }
}

export async function fetchConversations() {
  try {
    const data = await makeKapsoRequest(`/phone-numbers/${PHONE_NUMBER_ID}/conversations?limit=50`)
    if (data && data.data) {
      return data.data.map((conv: any) => ({
        id: conv.id,
        wabaId: WABA_ID,
        phoneNumberId: PHONE_NUMBER_ID,
        customerPhoneNumber: conv.customer_phone || conv.wa_id,
        customerName: conv.customer_name || "عميل",
        lastMessageTime: conv.last_message_timestamp || new Date().toISOString(),
        lastMessagePreview: conv.last_message_text || "لا توجد رسائل",
        status: conv.status || "active",
        unreadCount: conv.unread_count || 0,
      }))
    }
    return []
  } catch (error) {
    console.error("[v0] Fetch conversations error:", error)
    return []
  }
}

export async function fetchMessageStats() {
  try {
    const data = await makeKapsoRequest(`/phone-numbers/${PHONE_NUMBER_ID}/messages/stats`)
    if (data && data.data) {
      return {
        totalMessages: data.data.total || 0,
        incoming: data.data.inbound || 0,
        outgoing: data.data.outbound || 0,
        delivered: data.data.delivered || 0,
        read: data.data.read || 0,
        pending: data.data.pending || 0,
        failed: data.data.failed || 0,
      }
    }

    return {
      totalMessages: 0,
      incoming: 0,
      outgoing: 0,
      delivered: 0,
      read: 0,
      pending: 0,
      failed: 0,
    }
  } catch (error) {
    console.error("[v0] Fetch stats error:", error)
    return {
      totalMessages: 0,
      incoming: 0,
      outgoing: 0,
      delivered: 0,
      read: 0,
      pending: 0,
      failed: 0,
    }
  }
}

export async function sendMessage(phoneNumber: string, message: string) {
  try {
    const data = await makeKapsoRequest(`/phone-numbers/${PHONE_NUMBER_ID}/messages`, "POST", {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phoneNumber,
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    })
    return data
  } catch (error) {
    console.error("[v0] Send message error:", error)
    return null
  }
}

export async function fetchTemplates() {
  try {
    const data = await makeKapsoRequest(`/phone-numbers/${PHONE_NUMBER_ID}/templates`)
    if (data && data.data) {
      return data.data.map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        language: template.language,
        status: template.status,
        content: template.components?.[0]?.text || "",
      }))
    }
    return []
  } catch (error) {
    console.error("[v0] Fetch templates error:", error)
    return []
  }
}
