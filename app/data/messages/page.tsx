"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "video" | "document"
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = messages.filter((m) => filter === "all" || m.status === filter)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الرسائل</h1>
          <p className="text-muted-foreground">جميع الرسائل المرسلة والمستقبلة</p>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "sent", "delivered", "read"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              size="sm"
            >
              {status === "all" ? "الكل" : status === "sent" ? "مرسلة" : status === "delivered" ? "مسلمة" : "مقروءة"}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا توجد رسائل</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{msg.from}</span>
                        <span className="text-xs text-muted-foreground">→</span>
                        <span className="text-muted-foreground">{msg.to}</span>
                      </div>
                      <div className="text-sm text-foreground mb-2">{msg.content}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleString("ar-EG")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          msg.status === "read"
                            ? "bg-green-100 text-green-700"
                            : msg.status === "delivered"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {msg.status === "read" ? "✓✓ مقروءة" : msg.status === "delivered" ? "✓✓ مسلمة" : "✓ مرسلة"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
