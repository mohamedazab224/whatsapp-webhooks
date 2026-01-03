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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
  }

  if (!stats) {
    return <div className="text-center py-8 text-red-500">فشل تحميل الإحصائيات</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
          <div className="text-2xl">💬</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalMessages || 0}</div>
          <p className="text-xs text-muted-foreground">جميع الرسائل المرسلة والمستلمة</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرسائل الواردة</CardTitle>
          <div className="text-2xl">📥</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{stats.incoming || 0}</div>
          <p className="text-xs text-muted-foreground">الرسائل المستلمة من العملاء</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرسائل الصادرة</CardTitle>
          <div className="text-2xl">📤</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{stats.outgoing || 0}</div>
          <p className="text-xs text-muted-foreground">الرسائل المرسلة للعملاء</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">رسائل مقروءة</CardTitle>
          <div className="text-2xl">✅</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-500">{stats.read || 0}</div>
          <p className="text-xs text-muted-foreground">الرسائل التي تمت قراءتها</p>
        </CardContent>
      </Card>
    </div>
  )
}
