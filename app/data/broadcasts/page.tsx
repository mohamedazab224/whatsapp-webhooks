"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Radio, Plus, Eye, Trash2 } from "lucide-react"

interface Broadcast {
  id: string
  name: string
  subscribersCount: number
  status: "active" | "inactive"
  createdAt: string
  lastMessageDate: string
}

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBroadcasts()
  }, [])

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch("/api/broadcasts")
      const data = await res.json()
      setBroadcasts(data.broadcasts || [])
    } catch (error) {
      console.error("[v0] Error fetching broadcasts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">البث (CTWA)</h1>
            <p className="text-muted-foreground">القنوات والقوائم البريدية</p>
          </div>
          <Button className="gap-2 bg-gradient-to-r from-primary to-secondary">
            <Plus size={16} />
            إنشاء قناة
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : broadcasts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا توجد قنوات بث</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {broadcasts.map((broadcast) => (
              <Card key={broadcast.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                      <Radio size={20} />
                    </div>
                    <h3 className="font-semibold text-foreground">{broadcast.name}</h3>
                  </div>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المشتركون:</span>
                      <span className="font-medium">{broadcast.subscribersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الحالة:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          broadcast.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {broadcast.status === "active" ? "نشطة" : "معطلة"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
