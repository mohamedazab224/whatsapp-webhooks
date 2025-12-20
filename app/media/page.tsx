import { MediaLibrary } from "@/components/media-library"

export default function MediaPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مكتبة الوسائط</h1>
        <p className="text-muted-foreground">جميع الملفات المستلمة من WhatsApp ومخزنة في Supabase Storage</p>
      </div>
      <MediaLibrary />
    </div>
  )
}
