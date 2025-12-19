"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AITrainingChat } from "@/components/ai-training-chat"
import { KnowledgeBaseManager } from "@/components/knowledge-base-manager"
import { Toaster } from "@/components/ui/toaster"

export default function AITrainingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span>🤖</span>
            <span>تدريب AI Agent</span>
          </h1>
          <p className="text-muted-foreground">تدريب ومحادثة الذكاء الاصطناعي وإدارة قاعدة المعرفة</p>
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="chat" className="gap-2">
              <span>💬</span>
              <span>محادثة تجريبية</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <span>📚</span>
              <span>قاعدة المعرفة</span>
            </TabsTrigger>
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
