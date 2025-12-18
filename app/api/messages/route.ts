import { NextResponse } from "next/server"
import { messageStore } from "@/lib/storage"

export async function GET() {
  const messages = messageStore.getMessages()

  return NextResponse.json({
    success: true,
    messages,
    total: messages.length,
  })
}
