"use client"

import { useState } from "react"
import "./SendMessageForm.css"

function SendMessageForm({ onMessageSent }) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!phoneNumber || !message) {
      setError("الرجاء ملء جميع الحقول")
      return
    }

    if (phoneNumber.length < 10) {
      setError("رقم الهاتف غير صحيح")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ""),
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "فشل في إرسال الرسالة")
        return
      }

      setSuccess("تم إرسال الرسالة بنجاح")
      setPhoneNumber("")
      setMessage("")
      onMessageSent()
    } catch (err) {
      setError("خطأ في الاتصال: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="send-form">
      <h3>إرسال رسالة</h3>

      <div className="form-group">
        <label htmlFor="phone">رقم الهاتف (واتس اب)</label>
        <input
          id="phone"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="966501234567 أو +966501234567"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">الرسالة</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          rows="3"
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? "جاري الإرسال..." : "إرسال"}
      </button>
    </form>
  )
}

export default SendMessageForm
