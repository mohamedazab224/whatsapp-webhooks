export interface MediaFile {
  id: string
  media_id: string
  sender_wa_id: string
  filename: string
  mime_type: string
  size: number
  received_at: Date
  linked_client_id: string | null
  storage_path: string
  hash: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  status: "approved" | "disabled" | "pending"
  event_type: "invoice" | "maintenance" | "status_change" | "alert" | "collection" | "admin"
  system: "daftara" | "uberfix" | "both"
  content: string
  variables: string[]
  buttons: TemplateButton[]
  created_at: Date
  updated_at: Date
}

export interface TemplateButton {
  type: "url" | "call" | "quick_reply"
  text: string
  url?: string
  phone?: string
}

export interface WhatsAppNumber {
  id: string
  wa_number: string
  phone_number_id: string
  quality: "green" | "yellow" | "red"
  rate_limit: number
  messages_sent_today: number
  system: "daftara" | "uberfix" | "both"
  message_type: "text" | "template" | "media" | "all"
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Client {
  id: string
  wa_id: string
  name: string
  phone: string
  email: string
  systems: ("daftara" | "uberfix")[]
  opt_in_status: boolean
  client_type: "individual" | "business" | "technician"
  linked_projects: string[]
  created_at: Date
  updated_at: Date
  last_message_at: Date | null
}

export interface WhatsAppLog {
  id: string
  message_id: string
  timestamp: Date
  direction: "inbound" | "outbound"
  status: "sent" | "failed" | "delivered" | "read"
  from_system: string
  to_client_id: string
  from_number: string
  template_name?: string
  message_body: string
  error_message?: string
  meta_status_id?: string
}

export interface NotificationEvent {
  id: string
  event_type:
    | "invoice_issued"
    | "maintenance_request"
    | "status_change"
    | "collection_alert"
    | "team_alert"
    | "admin_notification"
  source_system: "daftara" | "uberfix"
  target_client_id: string
  target_number: string
  template_id: string
  variables: Record<string, string>
  status: "pending" | "sent" | "failed"
  created_at: Date
  sent_at?: Date
  retry_count: number
}
