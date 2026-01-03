"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function AppNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "phone-numbers": true,
    data: true,
    exit: false,
  })

  const isActive = (path: string) => pathname === path

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white rounded-lg p-2 shadow-lg md:hidden"
        onClick={() => setOpen(true)}
        aria-label="فتح القائمة الجانبية"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={`fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 flex flex-col z-40 transition-transform duration-300 overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="إغلاق القائمة">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900">WhatsApp Hub</h1>
              <p className="text-xs text-gray-500">إدارة متكاملة للخدمات</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link
            href="/control"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive("/control") ? "bg-purple-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setOpen(false)}
          >
            <span>📊</span>
            <span>لوحة التحكم</span>
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive("/dashboard") ? "bg-purple-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setOpen(false)}
          >
            <span>👁️</span>
            <span>المراجعة</span>
          </Link>

          <div className="pt-4">
            <button
              onClick={() => toggleSection("phone-numbers")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm font-semibold">أرقام الهواتف</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${expandedSections["phone-numbers"] ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections["phone-numbers"] && (
              <div className="ml-4 mt-2 space-y-2 border-r-2 border-gray-200 pr-2">
                <Link
                  href="/phone-numbers/connected"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/phone-numbers/connected")
                      ? "text-purple-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الأرقام المتصلة
                </Link>
                <Link
                  href="/phone-numbers/verify"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/phone-numbers/verify")
                      ? "text-purple-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الأرقام الرقمية
                </Link>
                <button
                  className="block px-4 py-2 text-sm text-teal-600 hover:text-teal-700 font-medium w-full text-right"
                  onClick={() => setOpen(false)}
                >
                  اختبر رقم جديد
                </button>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => toggleSection("data")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm font-semibold">البيانات</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${expandedSections["data"] ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections["data"] && (
              <div className="ml-4 mt-2 space-y-2 border-r-2 border-gray-200 pr-2">
                <Link
                  href="/data/conversations"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/data/conversations")
                      ? "text-purple-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  المحادثات
                </Link>
                <Link
                  href="/data/messages"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/data/messages") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الرسائل
                </Link>
                <Link
                  href="/data/media"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/data/media") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الإعلام
                </Link>
                <Link
                  href="/data/contacts"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/data/contacts") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  جهات الاتصال
                </Link>
                <Link
                  href="/data/broadcasts"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/data/broadcasts") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  البث (CTWA)
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => toggleSection("exit")}
              className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-sm font-semibold">الخروج</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${expandedSections["exit"] ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections["exit"] && (
              <div className="ml-4 mt-2 space-y-2 border-r-2 border-gray-200 pr-2">
                <Link
                  href="/exit/support"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/exit/support") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الدعم
                </Link>
                <Link
                  href="/exit/status"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/exit/status") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  الحالة
                </Link>
                <Link
                  href="/exit/documentation"
                  className={`block px-4 py-2 text-sm rounded-lg transition-all ${
                    isActive("/exit/documentation")
                      ? "text-purple-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  التوثيق
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* AI Training Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-all">
            <span>🤖</span>
            <span>تدريب AI</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">محمد</p>
              <p className="text-xs text-gray-500">مسؤول</p>
            </div>
          </div>
        </div>
      </aside>

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
