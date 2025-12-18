import { type NextRequest, NextResponse } from "next/server"
import { templateStore } from "@/lib/templates-storage"

// GET: الحصول على قالب محدد
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const template = templateStore.getTemplateById(params.id)

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("[v0] Get template error:", error)
    return NextResponse.json({ error: "Failed to get template" }, { status: 500 })
  }
}

// PUT: تحديث قالب
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const updatedTemplate = templateStore.updateTemplate(params.id, body)

    if (!updatedTemplate) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template: updatedTemplate })
  } catch (error) {
    console.error("[v0] Update template error:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}

// DELETE: حذف قالب
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = templateStore.deleteTemplate(params.id)

    if (!success) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete template error:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
