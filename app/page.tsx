import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <h1 className="text-balance text-5xl font-bold leading-tight text-foreground mb-4">
                مركز إدارة الرسائل والملاحظات
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                تطبيق احترافي لإدارة رسائل WhatsApp مع AI Agent ذكي وجمع آراء العملاء والملاحظات بسهولة
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-xl shrink-0">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">إدارة الرسائل</h3>
                  <p className="text-sm text-muted-foreground">إرسال واستقبال رسائل WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-xl shrink-0">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">قوالب الرسائل</h3>
                  <p className="text-sm text-muted-foreground">إنشاء وإدارة القوالب الجاهزة</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-xl shrink-0">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Agent</h3>
                  <p className="text-sm text-muted-foreground">رد تلقائي ذكي على العملاء</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/20 text-xl shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">التحليلات</h3>
                  <p className="text-sm text-muted-foreground">إحصائيات وتقارير شاملة</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/20 text-xl shrink-0">
                  ⭐
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">جمع الملاحظات</h3>
                  <p className="text-sm text-muted-foreground">آراء واقتراحات العملاء</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20 text-xl shrink-0">
                  📚
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">قاعدة المعرفة</h3>
                  <p className="text-sm text-muted-foreground">تدريب AI بالمستندات</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/control"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:scale-105"
              >
                ابدأ الآن
                <span>→</span>
              </Link>
              <Link
                href="/ai-training"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-accent bg-accent/10 px-8 py-3 font-semibold text-accent transition-all hover:bg-accent/20"
              >
                <span>🤖</span>
                <span>جرب AI Agent</span>
              </Link>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 h-72 w-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 h-72 w-72 bg-secondary/20 rounded-full blur-3xl"></div>
            <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-xl">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary"></div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-3 w-1/2 rounded bg-muted/50"></div>
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-muted"></div>
                      <div className="h-2 w-1/2 rounded bg-muted/50"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-secondary/20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-muted"></div>
                      <div className="h-2 w-1/2 rounded bg-muted/50"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-full bg-accent/20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-muted"></div>
                      <div className="h-2 w-1/2 rounded bg-muted/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-20 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground mt-2">أتمتة كاملة</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-secondary">24/7</div>
            <div className="text-sm text-muted-foreground mt-2">خدمة مستمرة</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-accent">AI</div>
            <div className="text-sm text-muted-foreground mt-2">ذكاء اصطناعي</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="text-3xl font-bold text-chart-1">⚡</div>
            <div className="text-sm text-muted-foreground mt-2">سرعة فائقة</div>
          </div>
        </div>
      </main>
    </div>
  )
}
