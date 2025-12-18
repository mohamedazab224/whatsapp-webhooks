"use client"

import { useState } from "react"
import MessageItem from "./message-item"

const mockMessages = [
  {
    id: "1",
    sender: "أحمد محمد",
    phone: "+966501234567",
    message: "السلام عليكم، هل تتوفر المنتج؟",
    timestamp: "2024-01-15 10:30",
    status: "received",
    type: "text",
  },
  {
    id: "2",
    sender: "فاطمة علي",
    phone: "+966505555555",
    message: "شكراً على الخدمة الممتازة",
    timestamp: "2024-01-15 11:45",
    status: "sent",
    type: "text",
  },
  {
    id: "3",
    sender: "محمد سالم",
    phone: "+966512345678",
    message: "أريد الاستفسار عن الأسعار",
    timestamp: "2024-01-15 09:15",
    status: "received",
    type: "text",
  },
  {
    id: "4",
    sender: "سارة خالد",
    phone: "+966534567890",
    message: "تم استقبال طلبك برقم #12345",
    timestamp: "2024-01-14 16:20",
    status: "sent",
    type: "text",
  },
  {
    id: "5",
    sender: "علي حسن",
    phone: "+966541234567",
    message: "لماذا لم أستقبل الرسالة؟",
    timestamp: "2024-01-14 14:00",
    status: "received",
    type: "text",
  },
]

export default function MessageList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "sent" | "received">("all")

  const filteredMessages = mockMessages.filter((msg) => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.phone.includes(searchTerm)

    const matchesFilter = filterStatus === "all" || msg.status === filterStatus

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3 top-3 text-muted-foreground">🔍</span>
          <input
            type="text"
            placeholder="ابحث عن الرسائل أو المرسلين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "sent", "received"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <span>⚙️</span>
              {status === "all" && "الكل"}
              {status === "sent" && "المرسلة"}
              {status === "received" && "المستقبلة"}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => <MessageItem key={message.id} message={message} />)
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">لا توجد رسائل تطابق البحث</p>
          </div>
        )}
      </div>
    </div>
  )
}
