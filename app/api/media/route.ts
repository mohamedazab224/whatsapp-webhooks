import { type NextRequest, NextResponse } from "next/server"
import { supabaseMediaStorage } from "@/lib/supabase-media-storage"

// GET - الحصول على جميع الملفات أو حسب الفلتر
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const number = searchParams.get("number")
    const search = searchParams.get("search")
    const stats = searchParams.get("stats")

    if (stats === "true") {
      const statistics = supabaseMediaStorage.getStats()
      return NextResponse.json(statistics)
    }

    let media

    if (type) {
      media = supabaseMediaStorage.getMediaByType(type as any)
    } else if (number) {
      media = supabaseMediaStorage.getMediaByNumber(number)
    } else if (search) {
      media = supabaseMediaStorage.searchMedia(search)
    } else {
      media = supabaseMediaStorage.getAllMedia()
    }

    return NextResponse.json({ media, count: media.length })
  } catch (error) {
    console.error("[v0] Error fetching media:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}
