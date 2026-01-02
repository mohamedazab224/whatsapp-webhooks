"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MediaCenterUnified from "@/components/media-center-unified"
import TemplatesManagerAdvanced from "@/components/templates-manager-advanced"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnifiedControlPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">نقطة التحكم المركزية</h1>
          <p className="text-muted-foreground">إدارة شاملة للوسائط والقوالب والعملاء والأرقام والسجلات</p>
        </div>

        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="media">📁 الوسائط</TabsTrigger>
            <TabsTrigger value="templates">📋 القوالب</TabsTrigger>
            <TabsTrigger value="numbers">📞 الأرقام</TabsTrigger>
            <TabsTrigger value="clients">👥 العملاء</TabsTrigger>
            <TabsTrigger value="logs">📊 السجلات</TabsTrigger>
          </TabsList>

          {/* 1. Media Center */}
          <TabsContent value="media">
            <MediaCenterUnified />
          </TabsContent>

          {/* 2. Template Manager */}
          <TabsContent value="templates">
            <TemplatesManagerAdvanced />
          </TabsContent>

          {/* 3. Numbers & Accounts */}
          <TabsContent value="numbers">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الأرقام والحسابات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">متابعة جودة الأرقام ومعدلات الإرسال</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 4. Clients Directory */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>دليل العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">إدارة بيانات العملاء والأنظمة المرتبطة</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 5. Logs & Auditing */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>السجلات والتدقيق</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">متابعة جميع الرسائل الواردة والصادرة</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
