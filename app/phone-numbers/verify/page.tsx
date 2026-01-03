"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function VerifyPhoneNumbers() {
  const [numbers, setNumbers] = useState<string[]>([""])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const addNumberInput = () => {
    setNumbers([...numbers, ""])
  }

  const updateNumber = (index: number, value: string) => {
    const newNumbers = [...numbers]
    newNumbers[index] = value
    setNumbers(newNumbers)
  }

  const verifyNumbers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/numbers-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", numbers: numbers.filter((n) => n) }),
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("[v0] Error verifying numbers:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الأرقام الرقمية</h1>
          <p className="text-muted-foreground">تحقق من أرقام جديدة وأضفها إلى حسابك</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>إضافة أرقام جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {numbers.map((number, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="أدخل رقم الهاتف (مثال: 966501234567)"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                />
                {index === numbers.length - 1 && (
                  <Button onClick={addNumberInput} variant="outline">
                    +
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={verifyNumbers}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary"
            >
              {loading ? "جاري التحقق..." : "تحقق من الأرقام"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold">النتائج</h2>
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{result.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.verified ? "✅ تم التحقق" : "❌ لم يتم التحقق"}
                      </div>
                    </div>
                    <div className="text-sm">{result.message}</div>
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
