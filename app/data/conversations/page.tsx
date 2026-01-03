"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { MessageCircle, Eye } from "lucide-react"

interface Conversation {
  id: string
  phoneNumber: string
  participantName: string
  lastMessage: string
  lastMessageTime: string
  status: "active" | "inactive"
  messageCount: number
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations")
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = conversations.filter((c) => c.phoneNumber.includes(search) || c.participantName.includes(search))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">المحادثات</h1>
          <p className="text-muted-foreground">جميع المحادثات النشطة مع العملاء</p>
        </div>

        <div className="mb-6">
          <Input placeholder="ابحث بالرقم أو الاسم..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا توجد محادثات</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((conv) => (
              <Card key={conv.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                        <MessageCircle size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground">{conv.participantName}</div>
                        <div className="text-sm text-muted-foreground truncate">{conv.phoneNumber}</div>
                        <div className="text-xs text-muted-foreground mt-1">{conv.lastMessage}</div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-muted-foreground">{conv.lastMessageTime}</div>
                      <div className="text-sm font-medium mt-1">{conv.messageCount} رسالة</div>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        <Eye size={14} />
                      </Button>
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
