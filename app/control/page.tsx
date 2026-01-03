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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-lg text-gray-600">إدارة تطبيق WhatsApp Business | WhatsApp API</p>
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <StatsDashboard />

          {/* Tabs */}
          <Tabs defaultValue="send" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 h-auto bg-white border border-gray-200 rounded-lg p-1 gap-1">
              <TabsTrigger
                value="send"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>📤</span>
                <span className="hidden sm:inline">إرسال رسالة</span>
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>📋</span>
                <span className="hidden sm:inline">القوالب</span>
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>🤖</span>
                <span className="hidden sm:inline">AI Agent</span>
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>💬</span>
                <span className="hidden sm:inline">الرسائل</span>
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>⭐</span>
                <span className="hidden sm:inline">الملاحظات</span>
              </TabsTrigger>
              <TabsTrigger
                value="quality"
                className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded"
              >
                <span>📊</span>
                <span className="hidden sm:inline">الجودة</span>
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

            <TabsContent value="quality" className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-600">قريباً: معلومات الجودة والأداء</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
