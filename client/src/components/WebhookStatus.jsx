import "./WebhookStatus.css"

function WebhookStatus({ status }) {
  const statusConfig = {
    checking: { label: "جاري التحقق...", class: "checking" },
    configured: { label: "مُعدّ ✓", class: "configured" },
    "not-configured": { label: "غير مُعدّ", class: "not-configured" },
    error: { label: "خطأ", class: "error" },
  }

  const config = statusConfig[status] || statusConfig.error

  return (
    <div className={`webhook-status ${config.class}`}>
      <span className="status-dot"></span>
      <span className="status-label">{config.label}</span>
    </div>
  )
}

export default WebhookStatus
