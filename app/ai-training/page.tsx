"use client"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AITrainingChat } from "@/components/ai-training-chat"
import { KnowledgeBaseManager } from "@/components/knowledge-base-manager"
import { Toaster } from "@/components/ui/toaster"

export default function AITrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-foreground">تدريب AI Agent</h1>
              <p className="text-xs text-muted-foreground">تدريب ومحادثة الذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/control"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              لوحة التحكم
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">محادثة تجريبية</TabsTrigger>
            <TabsTrigger value="knowledge">قاعدة المعرفة</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <AITrainingChat />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBaseManager />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}
