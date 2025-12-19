"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MaintenanceRequest {
  id: string
  customerName: string
  customerPhone: string
  issueDescription: string
  urgency: "low" | "medium" | "high" | "urgent"
  category: string
  status: string
  createdAt: string
}

export function AIMaintenancePanel() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // تحديث كل 10 ثواني
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [requestsRes, statsRes] = await Promise.all([fetch("/api/ai-maintenance"), fetch("/api/ai-stats")])

      const requestsData = await requestsRes.json()
      const statsData = await statsRes.json()

      if (requestsData.success) setRequests(requestsData.requests)
      if (statsData.success) setStats(statsData.stats)
    } catch (error) {
      console.error("Error fetching AI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch("/api/ai-maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, updates: { status } }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error updating request:", error)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      plumbing: "سباكة",
      electrical: "كهرباء",
      ac: "تكييف",
      carpentry: "نجارة",
      painting: "دهان",
      other: "أخرى",
    }
    return labels[category] || category
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">جاري التحميل...</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">إجمالي المحادثات</div>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">طلبات الصيانة</div>
            <div className="text-2xl font-bold">{stats.totalMaintenanceRequests}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">قيد الانتظار</div>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">عاجل</div>
            <div className="text-2xl font-bold text-red-500">{stats.urgentRequests}</div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">طلبات الصيانة</h3>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">لا توجد طلبات صيانة حالياً</div>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                      <Badge variant="outline">{getCategoryLabel(request.category)}</Badge>
                      <Badge variant="secondary">{request.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {request.customerPhone} - {request.customerName}
                    </div>
                    <div className="text-sm">{request.issueDescription}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(request.createdAt).toLocaleString("ar-SA")}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateRequestStatus(request.id, "in_progress")}>
                    قيد التنفيذ
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateRequestStatus(request.id, "completed")}>
                    مكتمل
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateRequestStatus(request.id, "cancelled")}>
                    إلغاء
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
