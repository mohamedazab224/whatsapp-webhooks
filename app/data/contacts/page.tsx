"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { UserPlus, Phone, Mail } from "lucide-react"

interface Contact {
  id: string
  name: string
  phoneNumber: string
  email?: string
  lastInteraction: string
  status: "active" | "inactive"
  tags: string[]
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/clients-directory")
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error("[v0] Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = contacts.filter((c) => c.name.includes(search) || c.phoneNumber.includes(search))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">جهات الاتصال</h1>
            <p className="text-muted-foreground">جميع العملاء والجهات الاتصال</p>
          </div>
          <Button onClick={() => setShowAdd(!showAdd)} className="gap-2 bg-gradient-to-r from-primary to-secondary">
            <UserPlus size={16} />
            إضافة جهة اتصال
          </Button>
        </div>

        {showAdd && (
          <Card className="mb-8">
            <CardContent className="pt-6 space-y-4">
              <Input placeholder="الاسم" />
              <Input placeholder="رقم الهاتف" />
              <Input placeholder="البريد الإلكتروني" />
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">حفظ</Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAdd(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <Input placeholder="ابحث بالاسم أو الرقم..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">لا توجد جهات اتصال</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{contact.name}</div>
                      <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {contact.phoneNumber}
                        </span>
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={14} /> {contact.email}
                          </span>
                        )}
                      </div>
                      {contact.tags.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {contact.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-muted-foreground mb-2">آخر تفاعل: {contact.lastInteraction}</div>
                      <Button size="sm" variant="outline">
                        اتصل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
