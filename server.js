import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { fileURLToPath } from "url"
import path from "path"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8005

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

// في الإنتاج، نقدم ملفات React الثابتة
app.use(express.static(path.join(__dirname, "client/dist")))

// مخزن مؤقت للرسائل (في الإنتاج استخدم قاعدة بيانات)
let messageHistory = []

// Health Check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// واجهة API

// الحصول على جميع الرسائل
app.get("/api/messages", (req, res) => {
  res.json(messageHistory)
})

// مسح الرسائل
app.delete("/api/messages", (req, res) => {
  messageHistory = []
  res.json({ message: "تم مسح جميع الرسائل" })
})

// Webhook للاستقبال من WhatsApp
app.post("/api/webhook", (req, res) => {
  const { entry } = req.body

  if (!entry) {
    return res.status(200).json({ received: true })
  }

  try {
    entry.forEach((item) => {
      const changes = item.changes || []
      changes.forEach((change) => {
        const messages = change.value.messages || []

        messages.forEach((message) => {
          const messageData = {
            id: message.id,
            timestamp: message.timestamp,
            type: message.type,
            from: change.value.contacts?.[0]?.wa_id,
            text: message.text?.body || "",
            direction: "incoming",
            createdAt: new Date().toISOString(),
          }

          messageHistory.push(messageData)
          console.log("[WhatsApp Incoming]", messageData)
        })

        // التعامل مع تغييرات الحالة
        const statuses = change.value.statuses || []
        statuses.forEach((status) => {
          console.log("[Status Update]", status)
        })
      })
    })

    res.status(200).json({ received: true })
  } catch (error) {
    console.error("Webhook Error:", error)
    res.status(200).json({ received: true })
  }
})

// التحقق من الـ Webhook
app.get("/api/webhook", (req, res) => {
  const { "hub.mode": mode, "hub.challenge": challenge, "hub.verify_token": token } = req.query

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "your-verify-token"

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge)
  } else {
    res.status(403).json({ error: "Forbidden" })
  }
})

// إرسال رسالة عبر WhatsApp
app.post("/api/send-message", async (req, res) => {
  const { phoneNumber, message } = req.body

  if (!phoneNumber || !message) {
    return res.status(400).json({ error: "رقم الهاتف والرسالة مطلوبة" })
  }

  try {
    const whatsappAPI = process.env.WHATSAPP_API_URL
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const businessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID

    if (!whatsappAPI || !accessToken || !businessPhoneId) {
      return res.status(500).json({
        error: "متغيرات البيئة غير مكتملة",
        required: ["WHATSAPP_API_URL", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_BUSINESS_PHONE_ID"],
      })
    }

    const response = await fetch(`${whatsappAPI}/${businessPhoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: message },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("WhatsApp API Error:", data)
      return res.status(response.status).json(data)
    }

    const messageData = {
      id: data.messages[0]?.id,
      timestamp: Date.now(),
      type: "text",
      to: phoneNumber,
      text: message,
      direction: "outgoing",
      createdAt: new Date().toISOString(),
    }

    messageHistory.push(messageData)
    res.json({ success: true, message: messageData })
  } catch (error) {
    console.error("Send Message Error:", error)
    res.status(500).json({ error: error.message })
  }
})

// تقديم React App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/healthz`)
})
