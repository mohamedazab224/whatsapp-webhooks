"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
  hasKnowledgeContext?: boolean
  provider?: "azure" | "deepseek"
  confidence?: number
}

export function AITrainingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(true)
  const [preferredProvider, setPreferredProvider] = useState<"auto" | "azure" | "deepseek">("auto")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          phone: "training-session",
          useKnowledgeBase,
          preferredProvider,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
          hasKnowledgeContext: data.hasKnowledgeContext,
          provider: data.provider,
          confidence: data.confidence,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "عذراً، حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const getProviderLabel = (provider?: string) => {
    switch (provider) {
      case "deepseek":
        return "🟦 DeepSeek"
      case "azure":
        return "🔵 Azure OpenAI"
      default:
        return ""
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle>محادثة تجريبية مع AI Agent</CardTitle>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Label htmlFor="provider-select" className="text-sm">
                المزود:
              </Label>
              <Select value={preferredProvider} onValueChange={(value: any) => setPreferredProvider(value)}>
                <SelectTrigger id="provider-select" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">تلقائي (ذكي)</SelectItem>
                  <SelectItem value="azure">Azure OpenAI</SelectItem>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="knowledge-base" checked={useKnowledgeBase} onCheckedChange={setUseKnowledgeBase} />
              <Label htmlFor="knowledge-base" className="text-sm">
                قاعدة المعرفة
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={clearChat}>
              مسح
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">ابدأ محادثة لاختبار AI Agent</div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {msg.provider && (
                    <div className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                      {getProviderLabel(msg.provider)}
                      {msg.confidence && ` (${(msg.confidence * 100).toFixed(0)}%)`}
                    </div>
                  )}
                  {msg.hasKnowledgeContext && (
                    <div className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                      📚 قاعدة المعرفة
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="اكتب رسالتك هنا..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
              {isLoading ? "جاري..." : "إرسال"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
