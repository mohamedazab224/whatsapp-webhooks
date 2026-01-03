"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Send, MessageSquare, Phone, Mail } from "lucide-react"

export default function SupportPage() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Send support message
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      setMessage("")
      alert("تم إرسال رسالتك بنجاح")
    } catch (error) {
      console.error("[v0] Error sending support message:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">الدعم</h1>
          <p className="text-muted-foreground">تواصل معنا لأي استفسارات أو مشاكل</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Support Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} />
                أرسل رسالة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="الموضوع" />
                <textarea
                  placeholder="رسالتك..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={6}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Send size={16} />
                  {loading ? "جاري الإرسال..." : "أرسل الرسالة"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">رقم الهاتف</div>
                    <div className="text-sm text-muted-foreground">+966-1-2345-6789</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">البريد الإلكتروني</div>
                    <div className="text-sm text-muted-foreground">support@whatsapp-hub.com</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">وقت الدعم</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>السبت - الخميس: 9:00 AM - 6:00 PM</div>
                  <div>الجمعة: مغلق</div>
                  <div>التوقيت: UTC+3</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
