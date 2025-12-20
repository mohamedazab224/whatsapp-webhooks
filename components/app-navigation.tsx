"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function AppNavigation() {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	const isActive = (path: string) => pathname === path

	return (
		<>
			{/* زر فتح القائمة */}
			<button
				className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground rounded-full p-2 shadow-lg md:hidden"
				onClick={() => setOpen(true)}
				aria-label="فتح القائمة الجانبية"
			>
				<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
			</button>

			{/* القائمة الجانبية */}
			<aside
				className={`fixed right-0 top-0 h-screen w-56 bg-card border-l border-border/40 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'} md:static md:block`}
				style={{ boxShadow: open ? '0 0 0 9999px rgba(0,0,0,0.3)' : undefined }}
			>
				<div className="flex flex-col items-center py-8 gap-4">
					{/* زر إغلاق */}
					<button
						className="self-end mb-2 mr-2 md:hidden bg-muted text-foreground rounded-full p-1"
						onClick={() => setOpen(false)}
						aria-label="إغلاق القائمة الجانبية"
					>
						<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
					</button>
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
							onClick={() => setOpen(false)}
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
							onClick={() => setOpen(false)}
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
							onClick={() => setOpen(false)}
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
							onClick={() => setOpen(false)}
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
							onClick={() => setOpen(false)}
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
							onClick={() => setOpen(false)}
						>
							<span>🤖</span>
							<span>تدريب AI</span>
						</Link>
					</nav>
				</div>
			</aside>
			{/* خلفية شفافة عند فتح القائمة على الجوال */}
			{open && (
				<div
					className="fixed inset-0 z-30 bg-black/30 md:hidden"
					onClick={() => setOpen(false)}
					aria-label="إغلاق القائمة"
				/>
			)}
		</>
	)
}
