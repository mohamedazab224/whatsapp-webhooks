"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Copy, Trash2, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

interface PhoneNumber {
  id: string
  number: string
  status: "verified" | "pending" | "blocked"
  linkedAt: string
  messagesCount: number
  quality: number
}

export default function ConnectedPhoneNumbers() {
  const [numbers, setNumbers] = useState<PhoneNumber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNumbers()
  }, [])

  const fetchNumbers = async () => {
    try {
      const res = await fetch("/api/numbers-accounts")
      const data = await res.json()
      setNumbers(data.numbers || [])
    } catch (error) {
      console.error("[v0] Error fetching numbers:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الأرقام المتصلة</h1>
          <p className="text-muted-foreground">إدارة أرقام WhatsApp المتصلة بحسابك</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : numbers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا توجد أرقام متصلة حالياً</CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {numbers.map((number) => (
              <Card key={number.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                        <Phone size={24} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {number.number}
                          {number.status === "verified" && <CheckCircle size={20} className="text-green-500" />}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          متصل منذ {new Date(number.linkedAt).toLocaleDateString("ar-EG")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {number.messagesCount} رسالة · جودة: {number.quality}%
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(number.number)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
