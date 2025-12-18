"use client"

import type React from "react"
import { useState } from "react"

type FeedbackType = "suggestion" | "complaint" | "praise" | "other"
type SubmitStatus = "idle" | "loading" | "success" | "error"

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    feedbackType: "suggestion" as FeedbackType,
    message: "",
    rating: 5,
  })

  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const feedbackTypes = [
    { value: "suggestion" as FeedbackType, label: "💡 اقتراح" },
    { value: "complaint" as FeedbackType, label: "⚠️ شكوى" },
    { value: "praise" as FeedbackType, label: "👏 إشادة" },
    { value: "other" as FeedbackType, label: "📌 أخرى" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        feedbackType: "suggestion",
        message: "",
        rating: 5,
      })

      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      setStatus("error")
      setErrorMessage("حدث خطأ في إرسال الملاحظة. يرجى المحاولة مجدداً.")
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Feedback Form */}
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-foreground">شارك آراءك ومقترحاتك</h2>
            <p className="text-sm text-muted-foreground">نقيّم ملاحظاتك وسنعمل على تحسين الخدمة بناءً عليها</p>
          </div>

          {/* Alert */}
          {status === "success" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400 flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">✅</span>
              <p className="text-sm">تم استقبال ملاحظتك بنجاح. شكراً لك!</p>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400 flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">⚠️</span>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">الاسم *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="أدخل اسمك الكامل"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Email and Phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+966501234567"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          {/* Feedback Type and Rating */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">نوع الملاحظة *</label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                {feedbackTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">التقييم (من 1 إلى 5)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  name="rating"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground font-bold">
                  {formData.rating}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">الملاحظة أو الاقتراح *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="شارك معنا ملاحظاتك وآراءك..."
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">الحد الأقصى: 500 حرف</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                جاري الإرسال...
              </>
            ) : (
              <>📤 إرسال الملاحظة</>
            )}
          </button>
        </form>
      </div>

      {/* Info Sidebar */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-foreground">معلومات مفيدة</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              ✓ <span className="text-foreground font-medium">اقتراحاتك تساعدنا</span> على تحسين الخدمة
            </p>
            <p>
              ✓ <span className="text-foreground font-medium">سنرد عليك</span> خلال 24 ساعة
            </p>
            <p>
              ✓ <span className="text-foreground font-medium">جميع الملاحظات</span> محفوظة وآمنة
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-6 shadow-sm">
          <h3 className="mb-3 font-semibold text-foreground">المزيد من الطرق</h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">يمكنك أيضاً التواصل معنا عبر:</p>
            <div className="space-y-1">
              <p className="text-foreground">📧 support@example.com</p>
              <p className="text-foreground">📱 +966 50 123 4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
