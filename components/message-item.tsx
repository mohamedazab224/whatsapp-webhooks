"use client"

import { useState } from "react"

interface Message {
  id: string
  sender: string
  phone: string
  message: string
  timestamp: string
  status: "sent" | "received"
  type: string
}

export default function MessageItem({ message }: { message: Message }) {
  const [showMenu, setShowMenu] = useState(false)

  const isSent = message.status === "sent"

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
                isSent
                  ? "bg-gradient-to-br from-green-500 to-emerald-500"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}
            >
              {message.sender.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{message.sender}</p>
              <p className="text-xs text-muted-foreground">{message.phone}</p>
            </div>
            <div className="ml-auto">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isSent
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {isSent ? "مرسل" : "مستقبل"}
              </span>
            </div>
          </div>

          <p className="mb-3 break-words text-foreground/80">{message.message}</p>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{message.timestamp}</p>
            <div className="flex gap-2">
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                📋
              </button>
              <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                🔗
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  ⋮
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-border bg-card shadow-lg">
                    <button className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted">
                      💾 حفظ
                    </button>
                    <button className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted">
                      🗑️ حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
