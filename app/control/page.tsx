"use client"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SendMessagePanel from "@/components/send-message-panel"
import MessagesPanel from "@/components/messages-panel"
import StatsDashboard from "@/components/stats-dashboard"
import FeedbackForm from "@/components/feedback-form"
import TemplatesManager from "@/components/templates-manager"
import { Toaster } from "@/components/ui/toaster"

export default function ControlPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-xs text-muted-foreground">إدارة WhatsApp API</p>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Stats */}
          <StatsDashboard />

          {/* Tabs */}
          <Tabs defaultValue="send" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="send">إرسال رسالة</TabsTrigger>
              <TabsTrigger value="templates">القوالب</TabsTrigger>
              <TabsTrigger value="messages">الرسائل الواردة</TabsTrigger>
              <TabsTrigger value="feedback">الملاحظات</TabsTrigger>
            </TabsList>

            <TabsContent value="send" className="space-y-4">
              <SendMessagePanel />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <TemplatesManager />
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
