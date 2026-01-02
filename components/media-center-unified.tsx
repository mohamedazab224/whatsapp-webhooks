"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MediaCenterUnified() {
  const [selectedType, setSelectedType] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>مركز الوسائط</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">نوع الملف</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">الكل</option>
                <option value="images">الصور</option>
                <option value="videos">الفيديوهات</option>
                <option value="documents">المستندات</option>
                <option value="audio">الصوتيات</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">من التاريخ</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">إلى التاريخ</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Placeholder for media items */}
            <div className="p-4 border-2 border-dashed rounded-lg text-center text-muted-foreground">لا توجد ملفات</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
