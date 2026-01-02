"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [copiedWebhook, setCopiedWebhook] = useState("")

  useEffect(() => {
    loadWebhooks()
  }, [])

  const loadWebhooks = () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || "https://whatsapp.alazab.com/api/webhook"
    const verifyToken = "uberfix_webhook_secure_2024_token"

    setWebhooks([
      {
        name: "Sandbox WhatsApp",
        url: webhookUrl,
        verifyToken,
        status: "active",
        events: ["Message read", "Message delivered", "Conversation inactive", "Message sent", "Message received"],
        version: "v2",
      },
    ])
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedWebhook(id)
    setTimeout(() => setCopiedWebhook(""), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Webhooks</h1>
          <a href="#" className="text-primary hover:underline text-sm">
            View documentation →
          </a>
        </div>

        <Tabs defaultValue="whatsapp" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp">WhatsApp webhooks</TabsTrigger>
            <TabsTrigger value="project">Project webhooks</TabsTrigger>
            <TabsTrigger value="logs">Delivery logs</TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-6">
            {webhooks.map((webhook) => (
              <Card key={webhook.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Sandbox</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <span className="text-xs text-muted-foreground">{webhook.version}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Webhooks</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get real-time updates when messages arrive or conversations start
                    </p>
                    <div className="bg-muted p-3 rounded-lg font-mono text-xs break-all mb-2">{webhook.url}</div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(webhook.url, "webhook-url")}>
                      {copiedWebhook === "webhook-url" ? "✓ Copied" : "Copy"}
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-2">Events Subscribed</h4>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-2">Secret</h4>
                    <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                      <span className="font-mono text-xs">••••••••••••••••</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(webhook.verifyToken, "secret")}
                        >
                          {copiedWebhook === "secret" ? "✓" : "👁️"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(webhook.verifyToken, "secret")}
                        >
                          📋
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-3">Quick Reference</h4>
                    <div className="text-xs space-y-1 bg-muted p-3 rounded-lg font-mono">
                      <p>X-webhook-Event: whatsapp.message.received</p>
                      <p>X-webhook-Signature: ...</p>
                      <p>X-Idempotency-Key: unique-key-per-event</p>
                      <p>X-Batch: true (if batched)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle>Project Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Webhook configuration for project events will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Webhook delivery history and status logs will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
