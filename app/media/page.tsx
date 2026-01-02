"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchMedia()
    fetchStats()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/media")
      const data = await res.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error("[v0] Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/media?stats=true")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  const filteredMedia = media.filter((m) => {
    const typeMatch = selectedType === "all" || m.fileType === selectedType
    const searchMatch = m.fileName.includes(searchQuery) || m.fromNumber.includes(searchQuery)
    return typeMatch && searchMatch
  })

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-EG") + " " + date.toLocaleTimeString("ar-EG")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">WhatsApp Media</h1>
          <p className="text-muted-foreground">
            Browse media attachments across all conversations. Download or remove media without deleting the original
            message.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stats.totalFiles}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-secondary">{stats.byType.img}</div>
                <div className="text-sm text-muted-foreground">Images</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent">{stats.byType.pdf}</div>
                <div className="text-sm text-muted-foreground">PDFs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{stats.totalSizeMB} MB</div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Time Period</label>
                <select className="w-full px-3 py-2 border rounded-lg bg-background">
                  <option>All Time</option>
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                All types
              </Button>
              <Button
                variant={selectedType === "img" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("img")}
              >
                🖼️ Images
              </Button>
              <Button
                variant={selectedType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("video")}
              >
                🎥 Videos
              </Button>
              <Button
                variant={selectedType === "pdf" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("pdf")}
              >
                📄 Documents
              </Button>
              <Button
                variant={selectedType === "xlsx" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("xlsx")}
              >
                📊 Spreadsheets
              </Button>
            </div>

            <Input
              placeholder="Search by file name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Media List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">No media files found</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMedia.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4 p-4">
                    <div className="w-full md:w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.fileType === "img" ? (
                        <Image
                          src={file.fileUrl || "/placeholder.svg"}
                          alt={file.fileName}
                          width={96}
                          height={96}
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="text-3xl">
                          {file.fileType === "video" && "🎥"}
                          {file.fileType === "pdf" && "📄"}
                          {file.fileType === "xlsx" && "📊"}
                          {file.fileType === "cvs" && "📋"}
                          {file.fileType === "cad" && "📐"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{file.fileName}</h3>
                      {file.caption && <p className="text-sm text-muted-foreground mt-1">{file.caption}</p>}
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>{file.fromNumber}</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-col md:flex-row items-center">
                      <Button asChild variant="outline" size="sm">
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
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
