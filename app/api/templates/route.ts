import { type NextRequest, NextResponse } from "next/server"
import { templateStore } from "@/lib/templates-storage"

// GET: الحصول على جميع القوالب
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let templates
    if (status === "approved") {
      templates = templateStore.getApprovedTemplates()
    } else {
      templates = templateStore.getAllTemplates()
    }

    return NextResponse.json({ templates, stats: templateStore.getTemplateStats() })
  } catch (error) {
    console.error("[v0] Get templates error:", error)
    return NextResponse.json({ error: "Failed to get templates" }, { status: 500 })
  }
}

// POST: إنشاء قالب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, language, content } = body

    if (!name || !category || !language || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // استخراج المتغيرات من المحتوى
    const variableRegex = /\{\{(\d+)\}\}/g
    const variables: string[] = []
    let match
    while ((match = variableRegex.exec(content)) !== null) {
      if (!variables.includes(match[0])) {
        variables.push(match[0])
      }
    }

    const newTemplate = templateStore.addTemplate({
      name,
      category,
      language,
      content,
      variables,
      status: "pending", // القوالب الجديدة تحتاج موافقة
    })

    return NextResponse.json({ template: newTemplate }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create template error:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
