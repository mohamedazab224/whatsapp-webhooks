import type { WhatsAppClient } from "@kapso/whatsapp-cloud-api"

let client: WhatsAppClient | null = null

export function getKapsoClient(): WhatsAppClient {
  if (!client) {
    const { WhatsAppClient } = require("@kapso/whatsapp-cloud-api")
    client = new WhatsAppClient({
      baseUrl: process.env.KAPSO_BASE_URL || "https://api.kapso.ai/meta/whatsapp",
      kapsoApiKey: process.env.KAPSO_API_KEY!,
    })
  }
  return client
}

export async function fetchConversations() {
  try {
    const client = getKapsoClient()
    const conversations = await client.conversations.list({
      phoneNumberId: process.env.KAPSO_PHONE_NUMBER_ID!,
      status: "active",
      limit: 50,
    })
    return conversations.data || []
  } catch (error) {
    console.error("[v0] Fetch conversations error:", error)
    return []
  }
}

export async function fetchMessageStats() {
  try {
    const client = getKapsoClient()
    const messages = await client.messages.query({
      phoneNumberId: process.env.KAPSO_PHONE_NUMBER_ID!,
      limit: 1000,
    })

    const stats = {
      totalMessages: messages.data?.length || 0,
      incoming: messages.data?.filter((m: any) => m.direction === "inbound").length || 0,
      outgoing: messages.data?.filter((m: any) => m.direction === "outbound").length || 0,
    }

    return stats
  } catch (error) {
    console.error("[v0] Fetch stats error:", error)
    return { totalMessages: 0, incoming: 0, outgoing: 0 }
  }
}
