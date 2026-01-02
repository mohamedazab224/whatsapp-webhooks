export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">✅ التطبيق يعمل</h1>
        <p className="text-muted-foreground text-lg mb-8">جميع الملفات سليمة والمعاينة تعمل بشكل صحيح</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90"
        >
          العودة للصفحة الرئيسية
        </a>
      </div>
    </div>
  )
}
