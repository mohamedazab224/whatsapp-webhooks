"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"

export default function DocumentationPage() {
  const docs = [
    {
      title: "دليل البدء السريع",
      description: "تعلم كيفية البدء في استخدام WhatsApp Hub",
      url: "#",
    },
    {
      title: "API Reference",
      description: "توثيق شاملة لجميع API endpoints",
      url: "#",
    },
    {
      title: "Integration Guide",
      description: "دليل التكامل مع الأنظمة الأخرى",
      url: "#",
    },
    {
      title: "Best Practices",
      description: "أفضل الممارسات لاستخدام النظام",
      url: "#",
    },
    {
      title: "FAQ",
      description: "الأسئلة الشائعة والإجابات",
      url: "#",
    },
    {
      title: "Troubleshooting",
      description: "حل المشاكل الشائعة",
      url: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">التوثيق</h1>
          <p className="text-muted-foreground">جميع المستندات والأدلة الخاصة بـ WhatsApp Hub</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {docs.map((doc) => (
            <Card key={doc.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      اقرأ المزيد
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
