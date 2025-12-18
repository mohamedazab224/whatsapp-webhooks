"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface MessageTemplate {
  id: string
  name: string
  content: string
  variables: string[]
}

export default function SendMessagePanel() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [templateVariables, setTemplateVariables] = useState<string[]>([])

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates?status=approved")
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error("[v0] Fetch templates error:", error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setMessage(template.content)
      setTemplateVariables(new Array(template.variables.length).fill(""))
    }
  }

  const handleVariableChange = (index: number, value: string) => {
    const newVariables = [...templateVariables]
    newVariables[index] = value
    setTemplateVariables(newVariables)

    // تحديث الرسالة بالمتغيرات الجديدة
    const template = templates.find((t) => t.id === selectedTemplate)
    if (template) {
      let updatedMessage = template.content
      template.variables.forEach((variable, i) => {
        if (newVariables[i]) {
          updatedMessage = updatedMessage.replace(variable, newVariables[i])
        }
      })
      setMessage(updatedMessage)
    }
  }

  const handleSend = async () => {
    if (!phoneNumber || !message) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رقم الهاتف والرسالة",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "تم الإرسال",
          description: "تم إرسال الرسالة بنجاح",
        })
        setPhoneNumber("")
        setMessage("")
        setSelectedTemplate("")
        setTemplateVariables([])
      } else {
        toast({
          title: "خطأ",
          description: data.error || "فشل إرسال الرسالة",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Send error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إرسال رسالة جديدة</CardTitle>
        <CardDescription>أرسل رسالة WhatsApp مباشرة من لوحة التحكم أو استخدم قالب جاهز</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">اختر قالب (اختياري)</label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="اختر قالب أو اكتب رسالة مخصصة" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedTemplate && templateVariables.length > 0 && (
          <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
            <label className="text-sm font-medium text-foreground">املأ المتغيرات</label>
            {templateVariables.map((variable, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline">
                  {"{{"}
                  {index + 1}
                  {"}}"}
                </Badge>
                <Input
                  placeholder={`القيمة ${index + 1}`}
                  value={variable}
                  onChange={(e) => handleVariableChange(index, e.target.value)}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">رقم الهاتف</label>
          <Input
            type="tel"
            placeholder="966xxxxxxxxx"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">الرسالة</label>
          <Textarea
            placeholder="اكتب رسالتك هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={5}
          />
        </div>
        <Button onClick={handleSend} disabled={loading} className="w-full">
          {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
        </Button>
      </CardContent>
    </Card>
  )
}
