"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Stats {
  totalMessages: number
  incoming: number
  outgoing: number
  pending: number
  delivered: number
  read: number
  failed: number
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("[v0] Fetch stats error:", error)
    }
  }

  if (!stats) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
          <div className="text-2xl">💬</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages}</div>
          <p className="text-xs text-muted-foreground">جميع الرسائل المرسلة والمستلمة</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرسائل الواردة</CardTitle>
          <div className="text-2xl">📥</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.incoming}</div>
          <p className="text-xs text-muted-foreground">الرسائل المستلمة من العملاء</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرسائل الصادرة</CardTitle>
          <div className="text-2xl">📤</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.outgoing}</div>
          <p className="text-xs text-muted-foreground">الرسائل المرسلة للعملاء</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">رسائل مقروءة</CardTitle>
          <div className="text-2xl">✅</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.read}</div>
          <p className="text-xs text-muted-foreground">الرسائل التي تمت قراءتها</p>
        </CardContent>
      </Card>
    </div>
  )
}
