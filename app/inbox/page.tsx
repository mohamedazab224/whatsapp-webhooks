"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Conversation {
  id: string
  phoneNumber: string
  name: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: "active" | "inactive"
  assignedTo?: string
}

interface Message {
  id: string
  from: string
  text: string
  timestamp: number
  type: "incoming" | "outgoing"
  status: string
  attachments?: any[]
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchConversations()
    fetchMessages()
  }, [])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data.messages || [])

      // Group messages by sender to create conversations
      const conversationsMap = new Map<string, Conversation>()
      data.messages?.forEach((msg: Message) => {
        if (!conversationsMap.has(msg.from)) {
          conversationsMap.set(msg.from, {
            id: msg.from,
            phoneNumber: msg.from,
            name: msg.from,
            lastMessage: msg.text,
            lastMessageTime: new Date(msg.timestamp).toLocaleString("ar-EG"),
            unreadCount: msg.type === "incoming" ? 1 : 0,
            status: "active",
          })
        }
      })
      setConversations(Array.from(conversationsMap.values()))
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("[v0] Error fetching messages:", error)
    }
  }

  const selectedMessages = selectedConversation ? messages.filter((m) => m.from === selectedConversation) : []

  const filteredConversations = conversations.filter((conv) => {
    const searchMatch = conv.phoneNumber.includes(searchQuery) || conv.name.includes(searchQuery)
    const statusMatch = filterStatus === "all" || conv.status === filterStatus
    return searchMatch && statusMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Inbox</h1>
          <p className="text-muted-foreground">Manage conversations and reply to customers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center text-muted-foreground py-8">Loading conversations...</div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No conversations found</div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedConversation === conv.id ? "bg-primary/10 border-primary" : "hover:bg-muted"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{conv.phoneNumber}</span>
                        {conv.unreadCount > 0 && <Badge className="bg-red-500">{conv.unreadCount}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conv.lastMessageTime}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedConversation ? `Conversation: ${selectedConversation}` : "Select a conversation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedConversation ? (
                <div className="text-center text-muted-foreground py-12">Select a conversation to view messages</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No messages in this conversation</div>
                  ) : (
                    selectedMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${msg.type === "outgoing" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <p className="text-sm break-words">{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString("ar-EG")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedConversation && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <textarea
                    placeholder="Type your reply..."
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                    rows={3}
                  />
                  <Button className="w-full">Send Message</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
