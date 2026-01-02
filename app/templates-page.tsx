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

  useEffect(() => {
    fetchTemplates()
  }, [viewMode])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const url = `/api/templates${viewMode === "approved" ? "?status=approved" : ""}`
      const res = await fetch(url)
      const data = await res.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("[v0] Error fetching templates:", error)
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
        alert("Template submitted to Meta successfully!")
        fetchTemplates()
      }
    } catch (error) {
      console.error("[v0] Error submitting template:", error)
    }
  }

  const categories = ["all", "order", "reminder", "payment", "review", "support", "emergency", "system"]
  const categoryLabels: Record<string, string> = {
    all: "جميع الفئات",
    order: "دورة الطلب",
    reminder: "التذكير",
    payment: "المالية",
    review: "التقييم",
    support: "الدعم",
    emergency: "الطوارئ",
    system: "النظام",
  }

  const filteredTemplates = templates.filter((t) => {
    const categoryMatch = selectedCategory === "all" || t.category === selectedCategory
    const searchMatch = t.name.includes(searchQuery)
    return categoryMatch && searchMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">WhatsApp Templates</h1>
          <p className="text-muted-foreground">Manage message templates for WhatsApp</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>WhatsApp Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Mohamed Azab</p>
                <p className="text-sm text-muted-foreground">+20 1000-0000</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Change</Button>
                <Button className="bg-green-600 hover:bg-green-700">Sync Templates</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-64"
            />
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="flex-1">
              <TabsList>
                <TabsTrigger value="approved">Approved Templates</TabsTrigger>
                <TabsTrigger value="all">All Templates</TabsTrigger>
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
              >
                {categoryLabels[cat] || cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">Loading templates...</CardContent>
          </Card>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No templates found</CardContent>
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
                      <Badge variant={template.metaStatus === "APPROVED" ? "default" : "secondary"}>
                        {template.metaStatus || "Local"}
                      </Badge>
                      <Badge variant="outline">{template.language}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted p-3 rounded text-sm">{template.content}</div>
                  {template.parameters > 0 && (
                    <p className="text-xs text-muted-foreground">{template.parameters} parameter(s) required</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    {template.metaStatus !== "APPROVED" && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => submitToMeta(template.id)}
                      >
                        Submit to Meta
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
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
