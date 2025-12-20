import { type NextRequest, NextResponse } from "next/server"
import { messageStore } from "@/lib/storage"
import { webhookRouter } from "@/lib/webhook-router"
import { systemUsersManager } from "@/lib/system-users"
import { sendWhatsAppMessage } from "@/lib/whatsapp"
import { supabaseMediaStorage } from "@/lib/supabase-media-storage"
import { AIRouter } from "@/lib/ai-router" // ← استيراد جديد

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

      // معالجة الملفات المرفوعة
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
            
            // إذا كان هناك نص مع الصورة، معالجته
            if (caption) {
              await processTextMessage({
                id: message.id,
                from: message.from,
                text: caption,
                type: "text",
                timestamp: message.timestamp
              }, contact)
            }
          }
        } catch (error) {
          console.error("[v0] Error processing media file:", error)
        }
      } else if (message.type === "text") {
        // معالجة الرسائل النصية
        await processTextMessage(message, contact)
      } else if (message.type === "interactive") {
        // معالجة الرسائل التفاعلية (أزرار، قوائم)
        await processInteractiveMessage(message, contact)
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
        // يمكنك إضافة إشعار هنا
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

// ===== دوال مساعدة =====

async function processTextMessage(message: any, contact: any) {
  const webhookMessage = {
    id: message.id,
    from: message.from,
    type: message.type,
    text: message.text,
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

  // حفظ الرسالة الواردة
  const newMessage = {
    id: message.id,
    from: message.from,
    name: contact?.profile?.name || "Unknown",
    text: message.text?.body || "",
    timestamp: Number.parseInt(message.timestamp) * 1000,
    type: "incoming" as const,
    status: "delivered" as const,
    createdAt: new Date().toISOString(),
  }

  messageStore.addMessage(newMessage)

  // إذا كانت الرسالة موجهة للبوت
  if (routing.action === "bot" && message.text?.body) {
    try {
      // 🎯 استخدام نظام التوجيه الذكي AI Router
      const aiResponse = await AIRouter.getBestResponse(message.from, message.text.body)

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

      console.log("[v0] AI response sent successfully via AIRouter")
      
      // تسجيل نوع الـ AI المستخدم
      const aiType = message.text.body.toLowerCase().includes('سعر') ? 'DeepSeek' : 'Azure/AI Router';
      console.log(`[v0] AI Provider used: ${aiType}`)
      
    } catch (error) {
      console.error("[v0] Error sending AI response:", error)
      
      // محاولة الرد برسالة بديلة
      try {
        await sendWhatsAppMessage({
          phoneNumber: message.from,
          message: "نعتذر، حدث خطأ في النظام. فريق الدعم سيتواصل معك قريباً.",
        })
      } catch (fallbackError) {
        console.error("[v0] Fallback also failed:", fallbackError)
      }
    }
  }
}

async function processInteractiveMessage(message: any, contact: any) {
  console.log("[v0] Processing interactive message:", message.interactive)
  
  // حفظ الرسالة الواردة
  const newMessage = {
    id: message.id,
    from: message.from,
    name: contact?.profile?.name || "Unknown",
    text: message.interactive?.button_reply?.title || 
          message.interactive?.list_reply?.title || 
          "Interactive Message",
    timestamp: Number.parseInt(message.timestamp) * 1000,
    type: "incoming" as const,
    status: "delivered" as const,
    createdAt: new Date().toISOString(),
  }

  messageStore.addMessage(newMessage)

  // معالجة الردود التفاعلية
  let responseText = "شكراً على اختيارك! ";
  
  if (message.interactive?.button_reply) {
    const buttonId = message.interactive.button_reply.id;
    const buttonTitle = message.interactive.button_reply.title;
    
    console.log(`[v0] Button clicked: ${buttonTitle} (ID: ${buttonId})`)
    
    // تخصيص الرد حسب الزر
    switch(buttonId) {
      case 'btn_price':
        responseText += "لحساب السعر، أرسل نموذج مشكلتك واسم الجهاز.";
        break;
      case 'btn_schedule':
        responseText += "لحجز موعد، أرسل التاريخ والوقت المناسبين.";
        break;
      case 'btn_contact':
        responseText += "يمكنك التواصل معنا على: 📞 1234567890";
        break;
      default:
        responseText += `تم استلام اختيارك: ${buttonTitle}`;
    }
  } else if (message.interactive?.list_reply) {
    const listId = message.interactive.list_reply.id;
    const listTitle = message.interactive.list_reply.title;
    
    console.log(`[v0] List item selected: ${listTitle} (ID: ${listId})`)
    responseText += `تم اختيار: ${listTitle}`;
  }

  // إرسال الرد
  await sendWhatsAppMessage({
    phoneNumber: message.from,
    message: responseText,
  })

  // حفظ الرد
  messageStore.addMessage({
    id: `bot-${Date.now()}`,
    from: message.from,
    name: "Uberfix Bot",
    text: responseText,
    timestamp: Date.now(),
    type: "outgoing",
    status: "sent",
    createdAt: new Date().toISOString(),
  })
}

// ===== دوال مساعدة إضافية =====

/**
 * معالجة حالة تسليم الرسالة
 */
async function handleMessageDelivery(status: any) {
  const messageId = status.id;
  const newStatus = status.status;
  
  messageStore.updateMessageStatus(messageId, newStatus);
  
  if (newStatus === "failed") {
    console.warn(`[v0] Message ${messageId} failed to deliver. Reason: ${status.errors?.[0]?.title || "Unknown"}`);
    
    // يمكنك إضافة إجراءات إضافية هنا، مثل:
    // 1. إشعار فريق الدعم
    // 2. إعادة المحاولة
    // 3. تسجيل في قاعدة البيانات للمراجعة
  }
}

/**
 * توليد إحصائيات حول استخدام الـ AI
 */
function logAIStatistics(userId: string, message: string, response: string) {
  const stats = {
    userId,
    messageLength: message.length,
    responseLength: response.length,
    timestamp: new Date().toISOString(),
    hasPriceQuery: message.toLowerCase().includes('سعر'),
    hasScheduleQuery: message.toLowerCase().includes('موعد'),
    hasContactQuery: message.toLowerCase().includes('اتصال'),
  };
  
  console.log("[v0] AI Statistics:", stats);
  
  // يمكنك حفظ هذه الإحصائيات في قاعدة البيانات
  // statsStore.save(stats);
}
