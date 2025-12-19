// نظام قاعدة المعرفة للـ AI Agent

interface KnowledgeDocument {
  id: string
  fileName: string
  fileType: string
  content: string
  uploadedAt: string
  category: string
  tags: string[]
  size: number
}

class KnowledgeBase {
  private documents: KnowledgeDocument[] = []

  addDocument(doc: KnowledgeDocument) {
    this.documents.push(doc)
    console.log("[v0] Knowledge document added:", doc.fileName)
  }

  getDocuments(): KnowledgeDocument[] {
    return this.documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  getDocumentById(id: string): KnowledgeDocument | undefined {
    return this.documents.find((doc) => doc.id === id)
  }

  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex((doc) => doc.id === id)
    if (index !== -1) {
      this.documents.splice(index, 1)
      console.log("[v0] Document deleted:", id)
      return true
    }
    return false
  }

  searchDocuments(query: string): KnowledgeDocument[] {
    const lowerQuery = query.toLowerCase()
    return this.documents.filter(
      (doc) =>
        doc.fileName.toLowerCase().includes(lowerQuery) ||
        doc.content.toLowerCase().includes(lowerQuery) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  }

  // الحصول على context للـ AI من قاعدة المعرفة
  getContextForQuery(query: string): string {
    const relevantDocs = this.searchDocuments(query)

    if (relevantDocs.length === 0) {
      return ""
    }

    let context = "\n\n--- معلومات إضافية من قاعدة المعرفة ---\n"
    relevantDocs.slice(0, 3).forEach((doc) => {
      context += `\n[${doc.fileName}]:\n${doc.content.substring(0, 500)}...\n`
    })

    return context
  }

  getStats() {
    return {
      totalDocuments: this.documents.length,
      totalSize: this.documents.reduce((sum, doc) => sum + doc.size, 0),
      categories: [...new Set(this.documents.map((doc) => doc.category))],
    }
  }
}

export const knowledgeBase = new KnowledgeBase()
export type { KnowledgeDocument }
