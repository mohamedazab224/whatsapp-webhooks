"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

export default function StatusPage() {
  const services = [
    { name: "WhatsApp API", status: "operational", uptime: "99.9%" },
    { name: "Webhooks", status: "operational", uptime: "99.8%" },
    { name: "Media Storage", status: "operational", uptime: "99.95%" },
    { name: "AI Processing", status: "degraded", uptime: "98.5%" },
    { name: "Analytics", status: "operational", uptime: "99.7%" },
    { name: "Database", status: "operational", uptime: "99.99%" },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "operational") return <CheckCircle className="text-green-500" size={20} />
    if (status === "degraded") return <AlertCircle className="text-yellow-500" size={20} />
    return <Clock className="text-gray-500" size={20} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">حالة النظام</h1>
          <p className="text-muted-foreground">تحقق من حالة جميع الخدمات</p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h2 className="text-xl font-bold text-green-900">جميع الخدمات تعمل بشكل طبيعي</h2>
                <p className="text-sm text-green-800">آخر تحديث: قبل دقائق</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-semibold text-foreground">{service.name}</div>
                      <div className="text-xs text-muted-foreground">الوقت المتاح: {service.uptime}</div>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === "operational"
                        ? "bg-green-100 text-green-700"
                        : service.status === "degraded"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {service.status === "operational" ? "تشغيلي" : service.status === "degraded" ? "متدهور" : "مراقبة"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
