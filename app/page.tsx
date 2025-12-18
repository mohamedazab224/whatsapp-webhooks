import Link from "next/link"
import Image from "next/image"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold text-foreground">WhatsApp Hub</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/control"
              className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 font-medium text-primary transition-all hover:bg-primary/20"
            >
              لوحة التحكم
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 font-semibold text-primary-foreground transition-all hover:shadow-lg"
            >
              الذهاب للوحة التحكم
              <span>→</span>
            </Link>
          </div>
        </div>
      </nav>

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
                تطبيق احترافي لإدارة رسائل WhatsApp وجمع آراء العملاء والملاحظات بسهولة
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-xl">💬</div>
                <div>
                  <h3 className="font-semibold text-foreground">إدارة الرسائل</h3>
                  <p className="text-muted-foreground">عرض وتنظيم جميع الرسائل الواردة والصادرة في مكان واحد</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 text-xl">⭐</div>
                <div>
                  <h3 className="font-semibold text-foreground">جمع الملاحظات</h3>
                  <p className="text-muted-foreground">نموذج سهل الاستخدام لجمع آراء العملاء والاقتراحات</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-xl">📊</div>
                <div>
                  <h3 className="font-semibold text-foreground">تحليل البيانات</h3>
                  <p className="text-muted-foreground">إحصائيات وتقارير شاملة عن الرسائل والملاحظات</p>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:scale-105"
            >
              ابدأ الآن
              <span>→</span>
            </Link>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
