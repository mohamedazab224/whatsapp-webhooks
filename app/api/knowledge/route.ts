import { type NextRequest, NextResponse } from "next/server"
import { knowledgeBase } from "@/lib/knowledge-base"

// الحصول على جميع المستندات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (query) {
      const results = knowledgeBase.searchDocuments(query)
      return NextResponse.json({ success: true, documents: results })
    }

    const documents = knowledgeBase.getDocuments()
    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error("[v0] Error fetching knowledge documents:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch documents" }, { status: 500 })
  }
}

// رفع مستند جديد
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string
    const tags = formData.get("tags") as string

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // قراءة محتوى الملف
    const content = await file.text()

    const document = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      content,
      uploadedAt: new Date().toISOString(),
      category: category || "general",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      size: file.size,
    }

    knowledgeBase.addDocument(document)

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("[v0] Error uploading knowledge document:", error)
    return NextResponse.json({ success: false, error: "Failed to upload document" }, { status: 500 })
  }
}

// حذف مستند
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID required" }, { status: 400 })
    }

    const deleted = knowledgeBase.deleteDocument(id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting knowledge document:", error)
    return NextResponse.json({ success: false, error: "Failed to delete document" }, { status: 500 })
  }
}
