// نظام إدارة System Users المتعددين

interface SystemUser {
  id: string
  name: string
  role: "admin" | "employee" | "automation"
  type: "automation_bot" | "crm_helpdesk" | "integrations"
  token: string
  scopes: string[]
  isActive: boolean
  description: string
  createdAt: string
}

interface UserSession {
  phoneNumber: string
  assignedTo: "bot" | "human" | "system"
  systemUserId: string
  handoverReason?: string
  startedAt: string
  lastActivity: string
}

class SystemUsersManager {
  private users: SystemUser[] = [
    {
      id: "user_automation_bot",
      name: "Automation Bot",
      role: "admin",
      type: "automation_bot",
      token: process.env.WHATSAPP_API_TOKEN || "",
      scopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
      isActive: true,
      description: "الردود التلقائية، Flows، والبوتات",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_crm_helpdesk",
      name: "CRM / Helpdesk",
      role: "employee",
      type: "crm_helpdesk",
      token: process.env.WHATSAPP_CRM_TOKEN || "",
      scopes: ["whatsapp_business_messaging"],
      isActive: true,
      description: "Live Agents، Tickets، والمحادثات",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user_integrations",
      name: "Integrations",
      role: "admin",
      type: "integrations",
      token: process.env.WHATSAPP_INTEGRATION_TOKEN || "",
      scopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
      isActive: true,
      description: "ERP، UberFix، Daftra، والـ Webhooks الخارجية",
      createdAt: new Date().toISOString(),
    },
  ]

  private sessions: Map<string, UserSession> = new Map()

  getAllUsers(): SystemUser[] {
    return this.users.filter((u) => u.isActive)
  }

  getUserById(id: string): SystemUser | undefined {
    return this.users.find((u) => u.id === id)
  }

  getUserByType(type: SystemUser["type"]): SystemUser | undefined {
    return this.users.find((u) => u.type === type && u.isActive)
  }

  // إدارة الجلسات
  createSession(phoneNumber: string, assignedTo: "bot" | "human" | "system", systemUserId: string): UserSession {
    const session: UserSession = {
      phoneNumber,
      assignedTo,
      systemUserId,
      startedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    }
    this.sessions.set(phoneNumber, session)
    console.log("[v0] Session created for:", phoneNumber, "assigned to:", assignedTo)
    return session
  }

  getSession(phoneNumber: string): UserSession | undefined {
    return this.sessions.get(phoneNumber)
  }

  updateSessionActivity(phoneNumber: string) {
    const session = this.sessions.get(phoneNumber)
    if (session) {
      session.lastActivity = new Date().toISOString()
    }
  }

  // Handover من Bot إلى Human
  handoverToHuman(phoneNumber: string, reason: string): boolean {
    const session = this.sessions.get(phoneNumber)
    if (session) {
      const crmUser = this.getUserByType("crm_helpdesk")
      if (crmUser) {
        session.assignedTo = "human"
        session.systemUserId = crmUser.id
        session.handoverReason = reason
        session.lastActivity = new Date().toISOString()
        console.log("[v0] Handover to human:", phoneNumber, "reason:", reason)
        return true
      }
    }
    return false
  }

  // Handover من Human إلى Bot
  handoverToBot(phoneNumber: string): boolean {
    const session = this.sessions.get(phoneNumber)
    if (session) {
      const botUser = this.getUserByType("automation_bot")
      if (botUser) {
        session.assignedTo = "bot"
        session.systemUserId = botUser.id
        session.handoverReason = undefined
        session.lastActivity = new Date().toISOString()
        console.log("[v0] Handover to bot:", phoneNumber)
        return true
      }
    }
    return false
  }

  getActiveHumanSessions(): UserSession[] {
    return Array.from(this.sessions.values()).filter((s) => s.assignedTo === "human")
  }

  getStats() {
    const totalSessions = this.sessions.size
    const botSessions = Array.from(this.sessions.values()).filter((s) => s.assignedTo === "bot").length
    const humanSessions = Array.from(this.sessions.values()).filter((s) => s.assignedTo === "human").length
    const systemSessions = Array.from(this.sessions.values()).filter((s) => s.assignedTo === "system").length

    return {
      totalUsers: this.users.filter((u) => u.isActive).length,
      totalSessions,
      botSessions,
      humanSessions,
      systemSessions,
      activeUsers: {
        bot: this.users.filter((u) => u.type === "automation_bot" && u.isActive).length,
        crm: this.users.filter((u) => u.type === "crm_helpdesk" && u.isActive).length,
        integrations: this.users.filter((u) => u.type === "integrations" && u.isActive).length,
      },
    }
  }
}

export const systemUsersManager = new SystemUsersManager()
export type { SystemUser, UserSession }
