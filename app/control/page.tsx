"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SendMessagePanel from "@/components/send-message-panel"
import MessagesPanel from "@/components/messages-panel"
import StatsDashboard from "@/components/stats-dashboard"
import FeedbackForm from "@/components/feedback-form"
import TemplatesManager from "@/components/templates-manager"
import { AIMaintenancePanel } from "@/components/ai-maintenance-panel"
import { Toaster } from "@/components/ui/toaster"

export default function ControlPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">إدارة شاملة لجميع خدمات WhatsApp API</p>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <StatsDashboard />

          {/* Tabs */}
          <Tabs defaultValue="send" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="send" className="gap-2">
                <span>📤</span>
                <span>إرسال رسالة</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2">
                <span>📋</span>
                <span>القوالب</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <span>🤖</span>
                <span>AI Agent</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <span>💬</span>
                <span>الرسائل</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="gap-2">
                <span>⭐</span>
                <span>الملاحظات</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send" className="space-y-4">
              <SendMessagePanel />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <TemplatesManager />
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <AIMaintenancePanel />
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <MessagesPanel />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <FeedbackForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
