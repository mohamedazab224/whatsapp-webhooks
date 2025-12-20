import { type NextRequest, NextResponse } from "next/server"
import { messageStore } from "@/lib/storage"
import { webhookRouter } from "@/lib/webhook-router"
import { systemUsersManager } from "@/lib/system-users"
import { azureOpenAIAgent } from "@/lib/azure-openai-agent"
import { sendWhatsAppMessage } from "@/lib/whatsapp"
import { supabaseMediaStorage } from "@/lib/supabase-media-storage"

// GET - التحقق من Webhook
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "uberfix_webhook_secure_2024_token"

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[v0] Webhook verified successfully")
    return new NextResponse(challenge, { status: 200 })
  }

  console.log("[v0] Webhook verification failed. Expected:", verifyToken, "Got:", token)
  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}

// POST - استقبال الرسائل
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Webhook received:", JSON.stringify(body, null, 2))

    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const message = body.entry[0].changes[0].value.messages[0]
      const contact = body.entry[0].changes[0].value.contacts?.[0]

      if (message.type === "image" || message.type === "video" || message.type === "document") {
        try {
          const mediaId = message.image?.id || message.video?.id || message.document?.id
          const mimeType = message.image?.mime_type || message.video?.mime_type || message.document?.mime_type
          const caption = message.image?.caption || message.video?.caption || message.document?.caption

          if (mediaId && mimeType) {
            console.log("[v0] Processing media file:", { mediaId, mimeType, caption })

            // تحميل الملف من WhatsApp ورفعه إلى Supabase
            const uploadedFile = await supabaseMediaStorage.downloadAndUploadWhatsAppMedia(
              mediaId,
              mimeType,
              message.from,
              message.id,
              caption,
            )

            console.log("[v0] Media file uploaded to Supabase:", uploadedFile.fileUrl)
          }
        } catch (error) {
          console.error("[v0] Error processing media file:", error)
        }
      }

      const webhookMessage = {
        id: message.id,
        from: message.from,
        type: message.type,
        text: message.text,
        interactive: message.interactive,
        button: message.button,
        timestamp: message.timestamp,
      }

      // الحصول على الجلسة الحالية
      let session = systemUsersManager.getSession(message.from)

      // توجيه الرسالة
      const routing = webhookRouter.routeMessage(webhookMessage, session?.assignedTo)

      console.log("[v0] Routing decision:", routing)

      if (!session) {
        const systemUser =
          routing.action === "human"
            ? systemUsersManager.getUserByType("crm_helpdesk")
            : systemUsersManager.getUserByType("automation_bot")

        if (systemUser) {
          session = systemUsersManager.createSession(message.from, routing.action, systemUser.id)
        }
      } else if (routing.action === "human" && session.assignedTo !== "human") {
        systemUsersManager.handoverToHuman(message.from, routing.reason)
      }

      // تحديث آخر نشاط
      systemUsersManager.updateSessionActivity(message.from)

      // حفظ الرسالة
      const newMessage = {
        id: message.id,
        from: message.from,
        name: contact?.profile?.name || "Unknown",
        text: message.text?.body || message.type || "",
        timestamp: Number.parseInt(message.timestamp) * 1000,
        type: "incoming" as const,
        status: "delivered" as const,
        createdAt: new Date().toISOString(),
      }

      messageStore.addMessage(newMessage)

      if (routing.action === "bot" && message.text?.body) {
        try {
          const aiResponse = await azureOpenAIAgent.respondToMessage(message.from, message.text.body)

          // إرسال الرد عبر WhatsApp
          await sendWhatsAppMessage({
            phoneNumber: message.from,
            message: aiResponse,
          })

          // حفظ رد البوت في قاعدة البيانات
          messageStore.addMessage({
            id: `bot-${Date.now()}`,
            from: message.from,
            name: "Uberfix Bot",
            text: aiResponse,
            timestamp: Date.now(),
            type: "outgoing",
            status: "sent",
            createdAt: new Date().toISOString(),
          })

          console.log("[v0] AI response sent successfully")
        } catch (error) {
          console.error("[v0] Error sending AI response:", error)
        }
      }
    }

    if (body.entry?.[0]?.changes?.[0]?.value?.statuses) {
      const status = body.entry[0].changes[0].value.statuses[0]
      const messageId = status.id
      const newStatus = status.status

      messageStore.updateMessageStatus(messageId, newStatus)

      const analysis = webhookRouter.analyzeMessageStatus(status)
      if (analysis.shouldNotify) {
        console.log("[v0] Message failed - needs attention:", messageId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}
