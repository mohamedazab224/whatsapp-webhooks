# توثيق API

## نظرة عامة

جميع endpoints تستخدم JSON للطلبات والردود.

## Authentication

حالياً، الـ API endpoints لا تتطلب مصادقة. في الإنتاج، يُنصح بإضافة:
- API Keys
- JWT Tokens
- Rate Limiting

## Endpoints

### 1. Webhook Verification

**GET** `/api/webhook`

يُستخدم من WhatsApp للتحقق من صحة الـ webhook.

**Query Parameters:**
- `hub.mode` - يجب أن يكون "subscribe"
- `hub.verify_token` - token التحقق
- `hub.challenge` - التحدي للتحقق

**Response:**
```
200 OK
{challenge_value}
```

---

### 2. Receive Messages

**POST** `/api/webhook`

استقبال الرسائل الواردة من WhatsApp.

**Request Body:**
```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "id": "wamid.xxx",
                "from": "966500000000",
                "timestamp": "1234567890",
                "text": {
                  "body": "Hello"
                }
              }
            ],
            "contacts": [
              {
                "profile": {
                  "name": "John Doe"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 3. Send Message

**POST** `/api/messages/send`

إرسال رسالة WhatsApp.

**Request Body:**
```json
{
  "phoneNumber": "966500000000",
  "message": "Hello from WhatsApp Hub!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "تم إرسال الرسالة بنجاح",
  "data": {
    "messaging_product": "whatsapp",
    "contacts": [...],
    "messages": [...]
  }
}
```

**Error Response:**
```json
{
  "error": "فشل إرسال الرسالة",
  "details": {...}
}
```

---

### 4. Get Messages

**GET** `/api/messages`

جلب جميع الرسائل المخزنة.

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "1",
      "from": "966500000001",
      "name": "أحمد محمد",
      "text": "مرحباً",
      "timestamp": 1234567890000,
      "type": "incoming",
      "status": "delivered"
    }
  ],
  "total": 10
}
```

---

### 5. Get Statistics

**GET** `/api/stats`

جلب إحصائيات الرسائل.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalMessages": 156,
    "incoming": 89,
    "outgoing": 67,
    "pending": 12,
    "delivered": 134,
    "read": 98,
    "failed": 2
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - بيانات غير صحيحة |
| 403  | Forbidden - فشل التحقق |
| 500  | Internal Server Error - خطأ في السيرفر |

## Rate Limits

حالياً لا توجد حدود. في الإنتاج، يُنصح بـ:
- 100 requests / minute للمستخدم الواحد
- 1000 requests / hour للتطبيق

## Webhooks

### Message Received Event

يتم إطلاقه عند استقبال رسالة جديدة.

**Payload:**
```json
{
  "event": "message.received",
  "data": {
    "id": "wamid.xxx",
    "from": "966500000000",
    "text": "Hello",
    "timestamp": 1234567890
  }
}
