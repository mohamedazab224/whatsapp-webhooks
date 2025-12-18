interface SendMessageParams {
  phoneNumber: string
  message: string
}

interface WhatsAppResponse {
  messaging_product: string
  contacts: Array<{ input: string; wa_id: string }>
  messages: Array<{ id: string }>
}

export async function sendWhatsAppMessage({ phoneNumber, message }: SendMessageParams): Promise<WhatsAppResponse> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const apiToken = process.env.WHATSAPP_API_TOKEN
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0"

  if (!phoneNumberId || !apiToken) {
    throw new Error(
      "WhatsApp API credentials not configured. Please check WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_API_TOKEN",
    )
  }

  const apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "text",
      text: { body: message },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error("[v0] WhatsApp API Error:", error)
    throw new Error(error.error?.message || "Failed to send message")
  }

  return response.json()
}

export function formatPhoneNumber(phone: string): string {
  // إزالة جميع الأحرف غير الرقمية
  let cleaned = phone.replace(/\D/g, "")

  // إذا كان الرقم يبدأ بـ 1 (كود أمريكا) والطول صحيح، أبقه كما هو
  if (cleaned.startsWith("1") && cleaned.length === 11) {
    return cleaned
  }

  // إذا كان رقم أمريكي بدون كود الدولة
  if (cleaned.length === 10 && !cleaned.startsWith("966")) {
    cleaned = "1" + cleaned
  }

  // إضافة كود السعودية إذا لم يكن موجوداً
  if (!cleaned.startsWith("966") && !cleaned.startsWith("1") && cleaned.length === 9) {
    cleaned = "966" + cleaned
  }

  return cleaned
}

export async function getMessageStatus(messageId: string): Promise<any> {
  const apiToken = process.env.WHATSAPP_API_TOKEN
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0"

  if (!apiToken) {
    throw new Error("WhatsApp API token not configured")
  }

  const apiUrl = `https://graph.facebook.com/${apiVersion}/${messageId}`

  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get message status")
  }

  return response.json()
}
