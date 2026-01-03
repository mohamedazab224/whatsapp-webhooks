import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

function getFileTypeFromMime(mimeType: string): MediaFile["fileType"] {
  if (mimeType.startsWith("image/")) return "img"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.includes("pdf")) return "pdf"
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "xlsx"
  if (mimeType.includes("csv")) return "cvs"
  if (mimeType.includes("dwg") || mimeType.includes("dxf")) return "cad"
  return "img"
}

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

export async function POST(request: NextRequest) {
  try {
    const {
      fileBuffer: base64Buffer,
      mimeType,
      fromNumber,
      messageId,
      originalFileName,
      caption,
    } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing")
    }

    // إنشاء عميل Supabase آمن على جانب الخادم
    const supabase = createClient(supabaseUrl, supabaseKey)

    const fileType = getFileTypeFromMime(mimeType)
    const extension = getFileExtension(mimeType, originalFileName)
    const timestamp = Date.now()
    const fileName = `${timestamp}-${messageId}.${extension}`
    const filePath = `${fileType}/${fileName}`

    // تحويل Base64 إلى Buffer
    const fileBuffer = Buffer.from(base64Buffer, "base64")

    // رفع الملف إلى Supabase
    const { error: uploadError } = await supabase.storage.from("whatsapp-media").upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // الحصول على الرابط العام للملف
    const { data: publicUrl } = supabase.storage.from("whatsapp-media").getPublicUrl(filePath)

    const mediaFile: MediaFile = {
      id: `media-${timestamp}`,
      fileName,
      fileType,
      fileUrl: publicUrl.publicUrl,
      mimeType,
      fileSize: fileBuffer.length,
      uploadedAt: new Date().toISOString(),
      fromNumber,
      messageId,
      caption,
    }

    return NextResponse.json(mediaFile)
  } catch (error) {
    console.error("[Upload Media API] Error:", error)
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 })
  }
}
