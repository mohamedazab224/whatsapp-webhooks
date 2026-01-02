"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MessageTemplate {
  id: string
  name: string
  category: string
  language: string
  status: string
  content: string
  variables: string[]
  createdAt: string
  updatedAt: string
  metaTemplateId?: string
  metaStatus?: string
}

export default function TemplatesManager() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitingToMeta, setSubmitingToMeta] = useState<string | null>(null)
  const [metaTemplates, setMetaTemplates] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("[v0] Fetch templates error:", error)
    }
  }

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم القالب والمحتوى",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء القالب بنجاح",
        })
        setDialogOpen(false)
        setFormData({ name: "", category: "utility", language: "ar", content: "" })
        fetchTemplates()
      } else {
        const data = await response.json()
        toast({
          title: "خطأ",
          description: data.error || "فشل إنشاء القالب",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Create template error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء القالب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القالب؟")) return

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "تم الحذف",
          description: "تم حذف القالب بنجاح",
        })
        fetchTemplates()
      }
    } catch (error) {
      console.error("[v0] Delete template error:", error)
      toast({
        title: "خطأ",
        description: "فشل حذف القالب",
        variant: "destructive",
      })
    }
  }

  const handleSubmitToMeta = async (templateId: string) => {
    setSubmitingToMeta(templateId)
    try {
      const response = await fetch("/api/templates/submit-to-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      })

      if (response.ok) {
        toast({
          title: "تم الإرسال",
          description: "تم إرسال القالب إلى Meta بنجاح",
        })
        fetchTemplates()
      } else {
        const data = await response.json()
        toast({
          title: "خطأ",
          description: data.error || "فشل إرسال القالب إلى Meta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Submit to Meta error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال القالب",
        variant: "destructive",
      })
    } finally {
      setSubmitingToMeta(null)
    }
  }

  const fetchMetaTemplates = async () => {
    try {
      const response = await fetch("/api/templates/list-meta")
      const data = await response.json()
      setMetaTemplates(data.templates || [])
    } catch (error) {
      console.error("[v0] Fetch Meta templates error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "موافق عليه"
      case "pending":
        return "قيد المراجعة"
      case "rejected":
        return "مرفوض"
      default:
        return status
    }
  }

  const getMetaStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-500"
      case "PENDING_APPROVAL":
        return "bg-yellow-500/10 text-yellow-500"
      case "REJECTED":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: "",
    category: "utility",
    language: "ar",
    content: "",
  })

  return (
    <div className="space-y-4">
      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">القوالب المحلية</TabsTrigger>
          <TabsTrigger value="meta">قوالب Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="local" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">قوالب الرسائل</h3>
              <p className="text-sm text-muted-foreground">إدارة قوالب رسائل WhatsApp</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>إنشاء قالب جديد</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إنشاء قالب رسالة جديد</DialogTitle>
                  <DialogDescription>أنشئ قالب رسالة يمكن إعادة استخدامه مع المتغيرات</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اسم القالب</label>
                    <Input
                      placeholder="مثال: رسالة ترحيب"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">التصنيف</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utility">خدمي</SelectItem>
                          <SelectItem value="marketing">تسويقي</SelectItem>
                          <SelectItem value="authentication">توثيق</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">اللغة</label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData({ ...formData, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">محتوى القالب</label>
                    <Textarea
                      placeholder="مرحباً {{1}}! شكراً لتواصلك معنا..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      استخدم {"{{"}"1{"}}"}, {"{{"}"2{"}}"}, إلخ للمتغيرات التي سيتم استبدالها عند الإرسال
                    </p>
                  </div>
                  <Button onClick={handleCreateTemplate} disabled={loading} className="w-full">
                    {loading ? "جاري الإنشاء..." : "إنشاء القالب"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(template.status)}>
                          {getStatusText(template.status)}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                      حذف
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{template.content}</p>
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">المتغيرات:</span>
                        {template.variables.map((variable, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {!template.metaTemplateId && (
                      <Button
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => handleSubmitToMeta(template.id)}
                        disabled={submitingToMeta === template.id}
                      >
                        {submitingToMeta === template.id ? "جاري الإرسال..." : "إرسال إلى Meta للاعتماد"}
                      </Button>
                    )}
                    {template.metaTemplateId && (
                      <Badge variant="secondary" className="w-full justify-center">
                        تم إرساله إلى Meta - {template.metaStatus}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">لا توجد قوالب حتى الآن</p>
                <p className="text-sm text-muted-foreground">انقر على "إنشاء قالب جديد" للبدء</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Button onClick={fetchMetaTemplates} variant="outline" className="w-full bg-transparent">
            تحديث قوالب Meta
          </Button>
          <div className="grid gap-4 md:grid-cols-2">
            {metaTemplates.map((template: any) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge className={getMetaStatusColor(template.status)}>{template.status}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
