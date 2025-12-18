"use client"

const stats = [
  {
    label: "إجمالي الرسائل",
    value: "1,247",
    icon: "📬",
    color: "from-primary to-secondary",
  },
  {
    label: "الرسائل المرسلة",
    value: "589",
    icon: "✅",
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "الرسائل المستقبلة",
    value: "658",
    icon: "⏰",
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "الأخطاء",
    value: "12",
    icon: "⚠️",
    color: "from-red-500 to-orange-500",
  },
]

export default function MessageStats() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3 text-2xl`}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
