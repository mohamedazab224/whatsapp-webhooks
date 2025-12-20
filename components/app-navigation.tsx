"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function AppNavigation() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <aside className="fixed right-0 top-0 h-screen w-56 bg-card border-l border-border/40 flex flex-col z-40">
      <div className="flex flex-col items-center py-8 gap-4">
        <Link href="/" className="flex flex-col items-center gap-2 mb-6 transition-transform hover:scale-105">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} className="rounded-lg" />
          <h1 className="text-lg font-bold text-foreground">WhatsApp Hub</h1>
          <p className="text-xs text-muted-foreground">إدارة متكاملة للخدمات</p>
        </Link>
        <nav className="flex flex-col gap-2 w-full px-4">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/control"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/control")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            لوحة التحكم
          </Link>
          <Link
            href="/dashboard"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/dashboard")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            المراجعة
          </Link>
          <Link
            href="/media"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/media")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            مكتبة الوسائط
          </Link>
          <Link
            href="/chat"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/chat")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            الدردشة الذكية
          </Link>
          <Link
            href="/ai-training"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all text-right ${
              isActive("/ai-training")
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg"
                : "border border-accent/50 text-accent hover:bg-accent/10"
            }`}
          >
            <span>🤖</span>
            <span>تدريب AI</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
