import { type NextRequest, NextResponse } from "next/server"
import { templateStore } from "@/lib/templates-storage"
import { createMetaTemplateManager } from "@/lib/meta-template-manager"

// POST: إرسال قالب إلى Meta للاعتماد
export async function POST(request: NextRequest) {
  try {
    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    const template = templateStore.getTemplateById(templateId)

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const metaManager = createMetaTemplateManager()
    const metaTemplate = await metaManager.submitTemplate({
      name: template.name,
      language: template.language,
      category: template.category,
      content: template.content,
      variables: template.variables,
    })

    templateStore.updateTemplate(templateId, {
      metaTemplateId: metaTemplate.id,
      metaStatus: metaTemplate.status,
    })

    return NextResponse.json({ template: metaTemplate, status: "submitted" })
  } catch (error) {
    console.error("[v0] Submit to Meta error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit template to Meta" },
      { status: 500 },
    )
  }
}

// GET: التحقق من حالة القالب في Meta
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")
    const metaTemplateId = searchParams.get("metaTemplateId")

    if (!templateId && !metaTemplateId) {
      return NextResponse.json({ error: "Template ID or Meta Template ID is required" }, { status: 400 })
    }

    const metaManager = createMetaTemplateManager()

    const statusResult = metaTemplateId ? await metaManager.getTemplateStatus(metaTemplateId) : null

    // تحديث حالة القالب المحلية إذا كان لدينا معرّف Meta
    if (templateId && statusResult) {
      templateStore.updateTemplate(templateId, {
        metaStatus: statusResult.status,
        metaRejectionReason: statusResult.rejectionReason,
        lastMetaCheckAt: statusResult.checkedAt,
      })
    }

    return NextResponse.json({ statusResult })
  } catch (error) {
    console.error("[v0] Get template status error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get template status" },
      { status: 500 },
    )
  }
}
