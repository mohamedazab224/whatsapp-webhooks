"use client"

import { useState } from "react"
import MessageList from "@/components/message-list"
import FeedbackForm from "@/components/feedback-form"
import MessageStats from "@/components/message-stats"

type TabType = "messages" | "feedback"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("messages")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة المراجعة</h1>
          <p className="text-muted-foreground">مراجعة الرسائل والملاحظات والإحصائيات</p>
        </div>

        {/* Stats Section */}
        <MessageStats />

        {/* Tabs */}
        <div className="mt-8 space-y-6">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === "messages"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>💬</span>
              <span>الرسائل</span>
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === "feedback"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>⭐</span>
              <span>الملاحظات والآراء</span>
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
