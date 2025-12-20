"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MediaFile {
  id: string
  fileName: string
  fileType: "img" | "video" | "pdf" | "xlsx" | "cvs" | "cad"
  fileUrl: string
  mimeType: string
  fileSize?: number
  uploadedAt: string
  fromNumber: string
  messageId: string
  caption?: string
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [filteredMedia, setFilteredMedia] = useState<MediaFile[]>([])
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
    fetchStats()
  }, [])

  useEffect(() => {
    filterMedia()
  }, [selectedType, searchQuery, media])

  const fetchMedia = async () => {
    try {
      const response = await fetch("/api/media")
      const data = await response.json()
      setMedia(data.media || [])
      setFilteredMedia(data.media || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/media?stats=true")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const filterMedia = () => {
    let filtered = media

    if (selectedType !== "all") {
      filtered = filtered.filter((m) => m.fileType === selectedType)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.fileName.toLowerCase().includes(query) ||
          m.caption?.toLowerCase().includes(query) ||
          m.fromNumber.includes(query),
      )
    }

    setFilteredMedia(filtered)
  }

  const fileTypes = [
    { value: "all", label: "الكل", icon: "📁" },
    { value: "img", label: "صور", icon: "🖼️" },
    { value: "video", label: "فيديو", icon: "🎥" },
    { value: "pdf", label: "PDF", icon: "📄" },
    { value: "xlsx", label: "Excel", icon: "📊" },
    { value: "cvs", label: "CSV", icon: "📋" },
    { value: "cad", label: "CAD", icon: "📐" },
  ]

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "غير محدد"
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${mb.toFixed(2)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <div className="text-sm text-muted-foreground">إجمالي الملفات</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.totalSizeMB} MB</div>
            <div className="text-sm text-muted-foreground">المساحة المستخدمة</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.byType.img}</div>
            <div className="text-sm text-muted-foreground">صور</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.byType.pdf}</div>
            <div className="text-sm text-muted-foreground">مستندات PDF</div>
          </Card>
        </div>
      )}

      {/* البحث والفلتر */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="ابحث في الملفات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {fileTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
            >
              <span className="mr-1">{type.icon}</span>
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* قائمة الملفات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((file) => (
          <Card key={file.id} className="overflow-hidden">
            <div className="relative h-48 bg-muted">
              {file.fileType === "img" ? (
                <Image src={file.fileUrl || "/placeholder.svg"} alt={file.fileName} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-6xl">
                  {file.fileType === "video" && "🎥"}
                  {file.fileType === "pdf" && "📄"}
                  {file.fileType === "xlsx" && "📊"}
                  {file.fileType === "cvs" && "📋"}
                  {file.fileType === "cad" && "📐"}
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="font-medium text-sm truncate">{file.fileName}</div>
              {file.caption && <div className="text-sm text-muted-foreground line-clamp-2">{file.caption}</div>}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(file.fileSize)}</span>
                <span>{formatDate(file.uploadedAt)}</span>
              </div>
              <div className="text-xs text-muted-foreground">من: {file.fromNumber}</div>
              <Button asChild className="w-full" size="sm">
                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                  فتح الملف
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && <div className="text-center py-12 text-muted-foreground">لا توجد ملفات متاحة</div>}
    </div>
  )
}
