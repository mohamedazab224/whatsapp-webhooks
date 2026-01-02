import { type NextRequest, NextResponse } from "next/server"
import { createMetaTemplateManager } from "@/lib/meta-template-manager"

// GET: سرد جميع القوالب من Meta
export async function GET(request: NextRequest) {
  try {
    const metaManager = createMetaTemplateManager()
    const templates = await metaManager.listTemplatesFromMeta()

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("[v0] List Meta templates error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list templates from Meta" },
      { status: 500 },
    )
  }
}
