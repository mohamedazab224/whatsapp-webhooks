"use client"

import { useState, useEffect } from "react"
import "./App.css"
import MessageList from "./components/MessageList"
import SendMessageForm from "./components/SendMessageForm"
import WebhookStatus from "./components/WebhookStatus"

function App() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [webhookStatus, setWebhookStatus] = useState("checking")

  useEffect(() => {
    fetchMessages()
    checkWebhookStatus()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      const data = await response.json()
      setMessages(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching messages:", error)
      setLoading(false)
    }
  }

  const checkWebhookStatus = async () => {
    try {
      const response = await fetch("/api/webhook?hub.mode=subscribe&hub.verify_token=test")
      setWebhookStatus(response.status === 403 ? "configured" : "not-configured")
    } catch {
      setWebhookStatus("error")
    }
  }

  const handleMessageSent = () => {
    fetchMessages()
  }

  const handleClearMessages = async () => {
    try {
      await fetch("/api/messages", { method: "DELETE" })
      setMessages([])
    } catch (error) {
      console.error("Error clearing messages:", error)
    }
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>تطبيق WhatsApp Webhook</h1>
        <WebhookStatus status={webhookStatus} />
      </div>

      <div className="app-content">
        <SendMessageForm onMessageSent={handleMessageSent} />

        <div className="messages-section">
          <div className="section-header">
            <h2>السجل ({messages.length})</h2>
            <button className="clear-btn" onClick={handleClearMessages} disabled={messages.length === 0}>
              مسح الكل
            </button>
          </div>

          {loading ? (
            <div className="loading">جاري التحميل...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <p>لا توجد رسائل حتى الآن</p>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
