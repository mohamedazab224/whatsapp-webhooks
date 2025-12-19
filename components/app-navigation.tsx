"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function AppNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-bold text-foreground">WhatsApp Hub</h1>
            <p className="text-xs text-muted-foreground">إدارة متكاملة للخدمات</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            href="/control"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive("/control")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            لوحة التحكم
          </Link>
          <Link
            href="/dashboard"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive("/dashboard")
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            المراجعة
          </Link>
          <Link
            href="/ai-training"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive("/ai-training")
                ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg"
                : "border border-accent/50 text-accent hover:bg-accent/10"
            }`}
          >
            <span>🤖</span>
            <span>تدريب AI</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
