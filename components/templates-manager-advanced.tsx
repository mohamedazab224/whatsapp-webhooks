"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Template {
  id: string
  name: string
  category: string
  status: string
  metaStatus?: string
  content: string
}

export default function TemplatesManagerAdvanced() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates")
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("خطأ في تحميل القوالب:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitToMeta = async (templateId: string) => {
    try {
      const res = await fetch("/api/templates/submit-to-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })
      if (res.ok) {
        alert("تم الإرسال إلى Meta بنجاح!")
        fetchTemplates()
      }
    } catch (error) {
      console.error("خطأ في الإرسال:", error)
    }
  }

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "order", label: "دورة الطلب" },
    { value: "reminder", label: "التذكير" },
    { value: "payment", label: "المالية" },
    { value: "review", label: "التقييم" },
    { value: "support", label: "الدعم" },
    { value: "emergency", label: "الطوارئ" },
    { value: "system", label: "النظام" },
  ]

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
    const matchesSearch = t.name.includes(searchQuery) || t.id.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="ابحث عن قالب..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-64"
        />
        <Button onClick={() => fetchTemplates()} className="bg-green-600 hover:bg-green-700">
          ✓ مزامنة القوالب
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs md:text-sm">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <Card>
          <CardContent className="pt-6">جاري التحميل...</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{template.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        template.metaStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : template.metaStatus === "PENDING_APPROVAL"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {template.metaStatus || "محلي"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm bg-muted p-3 rounded">{template.content}</p>
                <div className="flex gap-2">
                  {template.metaStatus !== "APPROVED" && (
                    <Button
                      size="sm"
                      onClick={() => submitToMeta(template.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      إرسال إلى Meta
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    تعديل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
