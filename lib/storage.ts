// في الإنتاج، استبدل هذا بقاعدة بيانات حقيقية

interface Message {
  id: string
  from: string
  to?: string
  name: string
  text: string
  timestamp: number
  type: "incoming" | "outgoing"
  status: "pending" | "sent" | "delivered" | "read" | "failed"
  createdAt: string
}

class MessageStore {
  private messages: Message[] = []

  addMessage(message: Message) {
    this.messages.push(message)
    console.log("[v0] Message stored:", message.id)
  }

  getMessages(): Message[] {
    return this.messages.sort((a, b) => b.timestamp - a.timestamp)
  }

  getMessageById(id: string): Message | undefined {
    return this.messages.find((msg) => msg.id === id)
  }

  updateMessageStatus(id: string, status: Message["status"]) {
    const message = this.messages.find((msg) => msg.id === id)
    if (message) {
      message.status = status
      console.log("[v0] Message status updated:", id, status)
    }
  }

  getStats() {
    const total = this.messages.length
    const incoming = this.messages.filter((m) => m.type === "incoming").length
    const outgoing = this.messages.filter((m) => m.type === "outgoing").length
    const read = this.messages.filter((m) => m.status === "read").length
    const delivered = this.messages.filter((m) => m.status === "delivered").length
    const pending = this.messages.filter((m) => m.status === "pending").length
    const failed = this.messages.filter((m) => m.status === "failed").length

    return {
      totalMessages: total,
      incoming,
      outgoing,
      read,
      delivered,
      pending,
      failed,
    }
  }
}

export const messageStore = new MessageStore()
export type { Message }
