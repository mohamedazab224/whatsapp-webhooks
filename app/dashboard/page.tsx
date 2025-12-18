"use client"

import { useState } from "react"
import Image from "next/image"
import MessageList from "@/components/message-list"
import FeedbackForm from "@/components/feedback-form"
import MessageStats from "@/components/message-stats"

type TabType = "messages" | "feedback"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("messages")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">WhatsApp Hub</h1>
              <p className="text-sm text-muted-foreground">مركز إدارة الرسائل والملاحظات</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <MessageStats />

        {/* Tabs */}
        <div className="mt-8 space-y-6">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === "messages"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              💬 الرسائل
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === "feedback"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⭐ الملاحظات والآراء
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-300">
            {activeTab === "messages" ? <MessageList /> : <FeedbackForm />}
          </div>
        </div>
      </main>
    </div>
  )
}
