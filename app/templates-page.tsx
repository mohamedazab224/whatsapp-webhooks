"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

interface Template {
  id: string
  name: string
  category: string
  status: string
  metaStatus?: string
  parameters: number
  language: string
  content: string
  preview?: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"approved" | "all">("approved")
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [viewMode])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/templates")
      const data = await res.json()
      const formattedTemplates = data.templates.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        status: t.status,
        metaStatus: t.metaStatus,
        parameters: t.variables.length,
        language: t.language,
        content: t.content,
        preview: t.content.substring(0, 100) + "...",
      }))
      setTemplates(formattedTemplates)
    } catch (error) {
      console.error("[v0] Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitToMeta = async (templateId: string) => {
    try {
      setSubmittingId(templateId)
      const res = await fetch("/api/templates/submit-to-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })
      if (res.ok) {
        alert("تم إرسال القالب إلى Meta للاعتماد بنجاح!")
        fetchTemplates()
      } else {
        alert("حدث خطأ في إرسال القالب")
      }
    } catch (error) {
      console.error("[v0] Error submitting template:", error)
      alert("خطأ: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setSubmittingId(null)
    }
  }

  const categories = [
    "all",
    "order",
    "reminder",
    "payment",
    "review",
    "support",
    "emergency",
    "system",
    "auth",
    "service",
    "notify",
    "promo",
  ]
  const categoryLabels: Record<string, string> = {
    all: "جميع الفئات",
    order: "دورة الطلب (7)",
    reminder: "التذكير (2)",
    payment: "المالية (3)",
    review: "التقييم (2)",
    support: "الدعم (3)",
    emergency: "الطوارئ (3)",
    system: "النظام (3)",
    auth: "المصادقة",
    service: "الخدمات",
    notify: "الإخطارات",
    promo: "العروضات",
  }

  const filteredTemplates = templates.filter((t) => {
    const categoryMatch = selectedCategory === "all" || t.category === selectedCategory
    const searchMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">إدارة قوالب WhatsApp</h1>
          <p className="text-muted-foreground">23 قالب محسّن للخدمات والعمليات المختلفة</p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚙️</span>
              تكوين WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Mohamed Azab</p>
                <p className="text-sm text-muted-foreground">WhatsApp Business Account</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">تغيير</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={fetchTemplates}>
                  تحديث القوالب
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات القوالب */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{templates.length}</p>
                <p className="text-sm text-muted-foreground mt-2">إجمالي القوالب</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {templates.filter((t) => t.metaStatus === "APPROVED").length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">معتمدة من Meta</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{templates.filter((t) => !t.metaStatus).length}</p>
                <p className="text-sm text-muted-foreground mt-2">لم ترسل بعد</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {templates.filter((t) => t.metaStatus === "PENDING_APPROVAL").length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">قيد المراجعة</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="البحث عن قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64"
            />
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="flex-1">
              <TabsList>
                <TabsTrigger value="approved">القوالب المعتمدة</TabsTrigger>
                <TabsTrigger value="all">جميع القوالب</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-right"
              >
                {categoryLabels[cat] || cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">جاري تحميل القوالب...</CardContent>
          </Card>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لم يتم العثور على قوالب</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{template.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          template.metaStatus === "APPROVED" ? "default" : template.metaStatus ? "secondary" : "outline"
                        }
                      >
                        {template.metaStatus === "APPROVED"
                          ? "✓ معتمد"
                          : template.metaStatus === "PENDING_APPROVAL"
                            ? "⏳ قيد المراجعة"
                            : "⊘ لم يرسل"}
                      </Badge>
                      <Badge variant="outline">{template.language === "ar" ? "العربية" : template.language}</Badge>
                      <Badge variant="outline" className="bg-blue-50">
                        {template.parameters} معامل
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-4 rounded text-sm text-right whitespace-pre-wrap border-r-2 border-blue-500">
                    {template.content}
                  </div>
                  {template.parameters > 0 && (
                    <p className="text-xs text-muted-foreground">⚠️ يتطلب {template.parameters} معامل ديناميكي</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    {template.metaStatus !== "APPROVED" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => submitToMeta(template.id)}
                        disabled={submittingId === template.id}
                      >
                        {submittingId === template.id ? "جاري الإرسال..." : "إرسال إلى Meta"}
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      معاينة
                    </Button>
                    {template.metaStatus === "APPROVED" && (
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600 bg-transparent">
                        ✓ معتمد
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
