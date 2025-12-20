// نظام إدارة ملفات WhatsApp على Supabase Storage

export interface MediaFile {
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

// تحديد نوع الملف من MIME type
function getFileTypeFromMime(mimeType: string): MediaFile["fileType"] {
  if (mimeType.startsWith("image/")) return "img"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.includes("pdf")) return "pdf"
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "xlsx"
  if (mimeType.includes("csv")) return "cvs"
  if (mimeType.includes("dwg") || mimeType.includes("dxf")) return "cad"
  return "img" // default
}

// تحديد امتداد الملف من MIME type
function getFileExtension(mimeType: string, originalName?: string): string {
  if (originalName && originalName.includes(".")) {
    return originalName.split(".").pop() || "bin"
  }

  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "application/pdf": "pdf",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/csv": "csv",
    "application/acad": "dwg",
    "image/vnd.dxf": "dxf",
  }

  return mimeMap[mimeType] || "bin"
}

class SupabaseMediaStorage {
  private baseUrl = "https://zrrffsjbfkphridqyais.supabase.co/storage/v1/object/public/whatsapp-media"
  private supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zrrffsjbfkphridqyais.supabase.co"
  private supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ""
  private mediaFiles: MediaFile[] = []

  // رفع ملف إلى Supabase Storage
  async uploadMedia(
    fileBuffer: Buffer,
    mimeType: string,
    fromNumber: string,
    messageId: string,
    originalFileName?: string,
    caption?: string,
  ): Promise<MediaFile> {
    try {
      const fileType = getFileTypeFromMime(mimeType)
      const extension = getFileExtension(mimeType, originalFileName)
      const timestamp = Date.now()
      const fileName = `${timestamp}-${messageId}.${extension}`
      const filePath = `${fileType}/${fileName}`
      const uploadUrl = `${this.supabaseUrl}/storage/v1/object/whatsapp-media/${filePath}`

      // رفع الملف
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.supabaseKey}`,
          "Content-Type": mimeType,
        },
        body: fileBuffer,
      })

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`)
      }

      const fileUrl = `${this.baseUrl}/${filePath}`

      const mediaFile: MediaFile = {
        id: `media-${timestamp}`,
        fileName,
        fileType,
        fileUrl,
        mimeType,
        fileSize: fileBuffer.length,
        uploadedAt: new Date().toISOString(),
        fromNumber,
        messageId,
        caption,
      }

      this.mediaFiles.push(mediaFile)
      return mediaFile
    } catch (error) {
      console.error("[Supabase Storage] Upload error:", error)
      throw error
    }
  }

  // تحميل ملف من WhatsApp API ورفعه إلى Supabase
  async downloadAndUploadWhatsAppMedia(
    mediaId: string,
    mimeType: string,
    fromNumber: string,
    messageId: string,
    caption?: string,
  ): Promise<MediaFile> {
    try {
      const apiToken = process.env.WHATSAPP_API_TOKEN
      const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0"

      if (!apiToken) {
        throw new Error("WhatsApp API token not configured")
      }

      // الحصول على رابط التحميل من WhatsApp
      const mediaUrlResponse = await fetch(`https://graph.facebook.com/${apiVersion}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })

      if (!mediaUrlResponse.ok) {
        throw new Error("Failed to get media URL from WhatsApp")
      }

      const mediaData = await mediaUrlResponse.json()
      const downloadUrl = mediaData.url

      // تحميل الملف
      const fileResponse = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })

      if (!fileResponse.ok) {
        throw new Error("Failed to download media from WhatsApp")
      }

      const fileBuffer = Buffer.from(await fileResponse.arrayBuffer())

      // رفع الملف إلى Supabase
      return await this.uploadMedia(fileBuffer, mimeType, fromNumber, messageId, undefined, caption)
    } catch (error) {
      console.error("[Supabase Storage] Download and upload error:", error)
      throw error
    }
  }

  // الحصول على جميع الملفات
  getAllMedia(): MediaFile[] {
    return this.mediaFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  // الحصول على الملفات حسب النوع
  getMediaByType(fileType: MediaFile["fileType"]): MediaFile[] {
    return this.mediaFiles
      .filter((file) => file.fileType === fileType)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  // الحصول على الملفات حسب رقم المرسل
  getMediaByNumber(fromNumber: string): MediaFile[] {
    return this.mediaFiles
      .filter((file) => file.fromNumber === fromNumber)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  // البحث في الملفات
  searchMedia(query: string): MediaFile[] {
    const lowerQuery = query.toLowerCase()
    return this.mediaFiles.filter(
      (file) =>
        file.fileName.toLowerCase().includes(lowerQuery) ||
        file.caption?.toLowerCase().includes(lowerQuery) ||
        file.fromNumber.includes(query),
    )
  }

  // إحصائيات الملفات
  getStats() {
    const total = this.mediaFiles.length
    const byType = {
      img: this.mediaFiles.filter((f) => f.fileType === "img").length,
      video: this.mediaFiles.filter((f) => f.fileType === "video").length,
      pdf: this.mediaFiles.filter((f) => f.fileType === "pdf").length,
      xlsx: this.mediaFiles.filter((f) => f.fileType === "xlsx").length,
      cvs: this.mediaFiles.filter((f) => f.fileType === "cvs").length,
      cad: this.mediaFiles.filter((f) => f.fileType === "cad").length,
    }

    const totalSize = this.mediaFiles.reduce((sum, file) => sum + (file.fileSize || 0), 0)

    return {
      totalFiles: total,
      byType,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    }
  }
}

export const supabaseMediaStorage = new SupabaseMediaStorage()
