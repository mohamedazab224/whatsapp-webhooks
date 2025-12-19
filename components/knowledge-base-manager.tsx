"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface KnowledgeDocument {
  id: string
  fileName: string
  fileType: string
  content: string
  uploadedAt: string
  category: string
  tags: string[]
  size: number
}

export function KnowledgeBaseManager() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState("general")
  const [tags, setTags] = useState("")
  const { toast } = useToast()

  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/knowledge")
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error("[v0] Error loading documents:", error)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من نوع الملف
    const allowedTypes = ["text/plain", "application/pdf", "text/markdown"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى رفع ملفات TXT, PDF, أو MD فقط",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", category)
      formData.append("tags", tags)

      const response = await fetch("/api/knowledge", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "تم الرفع بنجاح",
          description: `تم رفع الملف: ${file.name}`,
        })
        loadDocuments()
        setTags("")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "خطأ في الرفع",
        description: "فشل رفع الملف، الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const deleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge?id=${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "تم الحذف",
          description: "تم حذف المستند بنجاح",
        })
        loadDocuments()
      }
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل حذف المستند",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>رفع ملفات جديدة</CardTitle>
          <CardDescription>قم برفع ملفات معرفية يستخدمها AI Agent للرد على العملاء (TXT, PDF, MD)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">الفئة</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="general">عام</option>
                <option value="services">الخدمات</option>
                <option value="pricing">الأسعار</option>
                <option value="policies">السياسات</option>
                <option value="faq">الأسئلة الشائعة</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">العلامات (مفصولة بفاصلة)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="صيانة، سباكة، كهرباء"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">اختر ملف</Label>
            <Input id="file" type="file" accept=".txt,.pdf,.md" onChange={handleFileUpload} disabled={uploading} />
          </div>

          {uploading && <div className="text-sm text-muted-foreground">جاري رفع الملف...</div>}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>المستندات المرفوعة ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">لم يتم رفع أي مستندات بعد</div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1">
                    <div className="font-medium">{doc.fileName}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.category} • {formatFileSize(doc.size)} •{" "}
                      {new Date(doc.uploadedAt).toLocaleDateString("ar-EG")}
                    </div>
                    {doc.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {doc.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteDocument(doc.id)}>
                    حذف
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
