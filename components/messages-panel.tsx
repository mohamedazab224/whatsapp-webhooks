"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  from: string
  name: string
  text: string
  timestamp: number
  type: string
  status: string
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages")
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("[v0] Fetch messages error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.text.toLowerCase().includes(search.toLowerCase()) ||
      msg.from.includes(search),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>الرسائل الواردة</CardTitle>
        <CardDescription>عرض وإدارة جميع الرسائل الواردة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="🔍 ابحث عن رسالة..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">لا توجد رسائل</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-lg">
                      👤
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">{msg.name}</h4>
                        <Badge variant={msg.status === "read" ? "default" : "secondary"}>
                          {msg.status === "read" ? "مقروءة" : "جديدة"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.from}</p>
                      <p className="text-sm text-foreground">{msg.text}</p>
                      <p className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString("ar-SA")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
