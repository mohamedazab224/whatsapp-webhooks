# دليل الإعداد للإنتاج - WhatsApp Hub

## معلومات التطبيق المهمة

### بيانات الاعتماد (Production Credentials)

\`\`\`env
WHATSAPP_PHONE_NUMBER_ID=644995285354639
WHATSAPP_BUSINESS_ACCOUNT_ID=459851797218855
WHATSAPP_API_TOKEN=EAAKSz8EpkqkBQLZApF5bzj8jUoOZA2tl5x7G5wWxJXBaRbNnQcqr3pkWSwEaNdRcT9Ft6ZBytyC5lWCWSNzVQTMnF6rS46SomWsNFuwy8e2rwJv7kLMQu6X5qOrrLZCkqphqJPf4Rl9NmpceaGvStZAL5s1lwAJNA6enZAVtCz1I4MOZCtyqlUmQMdQIJ4lEhwmNyN92B9JTaJXZBKzGdyxHwkBSqfyfqxDZCFTc63vC9ieyXPb8suZCGNk1LFRxkJBDsZD
WHATSAPP_APP_ID=724370950034089
WHATSAPP_APP_SECRET=1099e980daa219a2d316d6e88ec219dd
WHATSAPP_API_VERSION=v21.0
WHATSAPP_CRM_TOKEN=your_crm_token_here
WHATSAPP_INTEGRATION_TOKEN=your_integration_token_here
WEBHOOK_VERIFY_TOKEN=uberfix_whatsapp_verify
\`\`\`

### رقم الهاتف الاختباري
\`\`\`
رقم الهاتف: +1 555 728 5727
صالح لمدة: 90 يوم
\`\`\`

### معرفات التكوين
- معرف التكوين الرئيسي: `1156013066694989`
- معرف شريك قياس الأداء: `1919649371923469`

### الصلاحيات المفعلة
- `email`
- `business_management`
- `whatsapp_business_management`
- `whatsapp_business_messaging`
- `read_audience_network_insights`
- `whatsapp_business_manage_events`
- `public_profile`

---

## خطوات الإعداد السريع

### 1. تثبيت المشروع

\`\`\`bash
# استنساخ أو تحميل المشروع
cd whatsapp-hub

# تثبيت الحزم
npm install
\`\`\`

### 2. إعداد ملف البيئة

أنشئ ملف `.env.local` في المجلد الرئيسي:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

ثم عدّل الملف بالمعرفات الصحيحة (المعرفات أعلاه مضافة مسبقاً في `.env.local`).

### 3. تشغيل التطبيق محلياً

\`\`\`bash
npm run dev
\`\`\`

التطبيق سيعمل على: `http://localhost:3000`

### 4. اختبار إرسال الرسائل

1. افتح: `http://localhost:3000/control`
2. استخدم رقم الهاتف الاختباري: `+15557285727` أو `15557285727`
3. اكتب رسالة واضغط "إرسال"
4. تحقق من console logs للتأكد من الإرسال

---

## إعداد Webhook للإنتاج

### استخدام ngrok للتطوير المحلي

\`\`\`bash
# تثبيت ngrok
npm install -g ngrok

# تشغيل ngrok
ngrok http 3000
\`\`\`

سيعطيك ngrok رابط مثل: `https://abc123.ngrok.io`

### إعداد Webhook في Meta

1. اذهب إلى: [Facebook Developers Console](https://developers.facebook.com/apps/724370950034089/whatsapp-business/wa-settings/)

2. في قسم **Webhook**:
   - **Callback URL**: `https://abc123.ngrok.io/api/webhook`
   - **Verify Token**: `uberfix_webhook_secure_2024_token`
   - اضغط "Verify and Save"

3. اشترك في الأحداث:
   - ✅ `messages`
   - ✅ `messaging_postbacks` (اختياري)
   - ✅ `message_status` (اختياري)

### اختبار Webhook

\`\`\`bash
# سيظهر في console logs عند استقبال رسالة
[v0] Webhook received: {...}
[v0] Message stored: {...}
\`\`\`

أرسل رسالة من WhatsApp إلى رقمك الاختباري وتحقق من الـ logs.

---

## إعداد WhatsApp داخل Meta (إجباري)

### داخل **Meta Developers → App → WhatsApp**

#### Configuration

**Webhook URL**
\`\`\`
https://webhook.uberfix.shop
34.140.51.106
\`\`\`

**Verify Token**
\`\`\`
uberfix_whatsapp_verify
\`\`\`

**Subscribed Fields**
\`\`\`
messages
message_status
\`\`\`

---

## System Users (أهم نقطة للتعدد)

داخل **Business Manager → System Users**

أنشئ **3 System Users منفصلين**:

### User 1 – Automation Bot

- **Role**: Admin
- **Token**: Permanent
- **Scopes**:
  - `whatsapp_business_messaging`
  - `whatsapp_business_management`

**يُستخدم لـ:**
- الردود التلقائية
- Flows
- Bots

**في التطبيق:**
المتغير البيئي الرئيسي `WHATSAPP_API_TOKEN` يستخدم لهذا User.

---

### User 2 – CRM / Helpdesk

- **Role**: Employee
- **Token**: Permanent
- **Scopes**:
  - `whatsapp_business_messaging`

**يُستخدم لـ:**
- Live Agents
- Tickets
- Conversations

**في التطبيق:**
أضف المتغير البيئي:
\`\`\`env
WHATSAPP_CRM_TOKEN=your_crm_token_here
\`\`\`

---

### User 3 – Integrations

- **Role**: Admin
- **Token**: Permanent
- **Scopes**:
  - `whatsapp_business_messaging`
  - `whatsapp_business_management`

**يُستخدم لـ:**
- ERP
- UberFix
- Daftra System
- Webhooks خارجية

**في التطبيق:**
أضف المتغير البيئي:
\`\`\`env
WHATSAPP_INTEGRATION_TOKEN=your_integration_token_here
\`\`\`

---

## ضبط Webhook ذكي (بدون تعارض)

### نظام التوجيه الآلي

التطبيق يحتوي على **Webhook Router** ذكي يقوم بـ:

#### تقسيم منطقي للرسائل:

1. **Messages Incoming** - الرسائل الواردة من العملاء
2. **Status Updates** - تحديثات حالة الرسائل المرسلة
3. **Interactive Replies** - ردود الأزرار والقوائم التفاعلية
4. **Button Clicks** - نقرات الأزرار

#### قواعد التوجيه:

\`\`\`javascript
// رسائل نصية عادية → البوت
if (message.type === "text") → automation_bot

// رسائل تفاعلية وأزرار → معالج الـ flows
if (message.type === "interactive") → flow_handler

// رسائل وسائط (صور، فيديو، ملفات) → موظف بشري
if (message.type === "image/video/document") → human_agent

// كلمات مفتاحية للتحويل → موظف بشري
if (text.includes("موظف" | "شكوى" | "مشكلة")) → human_agent

// عدم رد مناسب بعد رسالتين → موظف بشري
if (unanswered_count >= 2) → human_agent
\`\`\`

---

## إعداد Handover (Bot ⇄ Human)

### السياسة الصحيحة:

1. **البوت يرد أولاً** على جميع الرسائل النصية العادية
2. **التحويل التلقائي** عند:
   - كلمات مفتاحية محددة
   - رسائل وسائط (صور/فيديو/ملفات)
   - عدم قدرة البوت على الرد بشكل مناسب

### أمثلة Trigger للتحويل:

**كلمات عربية:**
- "موظف"
- "مندوب"
- "شخص"
- "إنسان"
- "شكوى"
- "مشكلة"
- "اعتراض"
- "مدير"

**كلمات إنجليزية:**
- "complaint"
- "human"
- "agent"
- "representative"

### API للتحويل اليدوي:

\`\`\`bash
# تحويل للموظف البشري
curl -X POST https://yourdomain.com/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "966xxxxxxxxx",
    "action": "handover_to_human",
    "reason": "Customer needs special assistance"
  }'

# إعادة للبوت
curl -X POST https://yourdomain.com/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "966xxxxxxxxx",
    "action": "handover_to_bot"
  }'
\`\`\`

---

## Message Templates (تنظيم احترافي)

### تقسيم التيمبلتات:

التطبيق يدعم الفئات التالية:

#### 1. `auth_` - المصادقة
- `auth_otp_login` - OTP / Login
- أكواد التحقق
- رسائل تسجيل الدخول

**مثال:**
\`\`\`
رمز التحقق الخاص بك هو: {{1}}. صالح لمدة 5 دقائق.
\`\`\`

#### 2. `service_` - الخدمات
- `service_maintenance_request` - صيانة / طلب
- جدولة المواعيد
- تأكيد الخدمات

**مثال:**
\`\`\`
تم استلام طلب الصيانة رقم {{1}}. سيتواصل معك الفني قريباً.
\`\`\`

#### 3. `notify_` - الإشعارات
- `notify_order_status` - إشعارات
- تحديثات حالة الطلبات
- إشعارات النظام

**مثال:**
\`\`\`
طلبك رقم {{1}} أصبح في حالة: {{2}}. شكراً لثقتك!
\`\`\`

#### 4. `promo_` - العروض
- `promo_special_offer` - عروض (بحذر)
- العروض الترويجية
- الحملات التسويقية

**مثال:**
\`\`\`
عرض خاص لك! خصم {{1}}% على جميع الخدمات. استخدم الكود: {{2}}
\`\`\`

#### 5. `system_` - النظام
- `system_update_notification` - تحديثات حالة
- صيانة النظام
- إشعارات فنية

**مثال:**
\`\`\`
سيتم إجراء صيانة للنظام يوم {{1}} من {{2}} إلى {{3}}. نعتذر عن أي إزعاج.
\`\`\`

### إضافة قالب جديد من الواجهة:

1. افتح `/control`
2. انتقل لتاب "القوالب"
3. اضغط "إضافة قالب جديد"
4. املأ البيانات:
   - **الاسم**: اسم وصفي للقالب
   - **الفئة**: اختر من القائمة
   - **المحتوى**: النص مع المتغيرات `{{1}}`, `{{2}}`, إلخ
5. احفظ القالب

---

## الأمان والحماية

### Webhook Verification
- ✅ التحقق من Token عند كل طلب
- ✅ رفض الطلبات غير المصرح بها

### IP Allowlist (للإنتاج)
أضف IPs Meta WhatsApp فقط في Nginx أو Firewall:

\`\`\`nginx
# في ملف nginx.conf
location /api/webhook {
    allow 31.13.0.0/16;
    allow 66.220.0.0/16;
    allow 69.63.0.0/16;
    allow 69.171.0.0/16;
    allow 173.252.0.0/16;
    deny all;
    
    proxy_pass http://localhost:3000;
}
\`\`\`

### Rate Limits
استخدم middleware للحد من عدد الطلبات:

\`\`\`typescript
// في middleware.ts أو API route
const MAX_REQUESTS = 1000 // طلب في الدقيقة
\`\`\`

---

## جاهزية Production (Checklist)

قبل النشر النهائي، تأكد من:

- ✅ **Webhook واحد** فقط مسجل في Meta
- ✅ **Tokens متعددة** للـ System Users الثلاثة
- ✅ **Roles مفصولة** بين Bot و CRM و Integrations
- ✅ **Templates منظمة** حسب الفئات
- ✅ **Handover مفعّل** وجاهز
- ✅ **Logging + Monitoring** يعمل بشكل صحيح
- ✅ **HTTPS مفعل** (ضروري)
- ✅ **IP Whitelist** محدد (اختياري)
- ✅ **Rate Limits** مطبقة
- ✅ **Environment Variables** آمنة

---

## الميزات المدعومة

التطبيق الآن يدعم:

✅ **تشغيل Bot** - ردود تلقائية ذكية
✅ **دعم بشري** - تحويل سلس للموظفين
✅ **ربط أنظمة** - Integrations مع أنظمة خارجية
✅ **توسع مستقبلي** - معماري قابل للتطوير

---

## مراقبة النظام

### الواجهات المتاحة:

1. **لوحة التحكم** (`/control`):
   - إرسال الرسائل
   - إدارة القوالب
   - عرض الإحصائيات

2. **لوحة المراجعة** (`/dashboard`):
   - عرض سجل الرسائل
   - عرض الملاحظات والآراء
   - فلترة وبحث

3. **API Endpoints**:
   - `GET /api/system-users` - عرض System Users
   - `GET /api/sessions` - عرض الجلسات النشطة
   - `POST /api/sessions` - Handover يدوي

### مراقبة الـ Console Logs:

\`\`\`bash
# عند استقبال رسالة
[v0] Webhook received: {...}
[v0] Routing decision: {...}
[v0] Session created for: 966xxxxxxxxx

# عند Handover
[v0] Handover to human: 966xxxxxxxxx reason: Customer needs special assistance

# عند إرسال رسالة
[v0] Sending message to: 966xxxxxxxxx
[v0] Message stored: {...}
\`\`\`

---

## النشر على Production Server

### الخيار 1: Vercel (الأسهل)

\`\`\`bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر التطبيق
vercel

# إضافة المتغيرات البيئية
vercel env add WHATSAPP_PHONE_NUMBER_ID
vercel env add WHATSAPP_API_TOKEN
vercel env add WHATSAPP_APP_ID
vercel env add WHATSAPP_APP_SECRET
vercel env add WEBHOOK_VERIFY_TOKEN
vercel env add WHATSAPP_CRM_TOKEN
vercel env add WHATSAPP_INTEGRATION_TOKEN

# نشر نهائي
vercel --prod
\`\`\`

### الخيار 2: VPS أو خادم خاص

\`\`\`bash
# على السيرفر
git clone your-repo.git
cd whatsapp-hub

# تثبيت الحزم
npm install

# إنشاء ملف .env.local بالمعرفات

# بناء التطبيق
npm run build

# تشغيل التطبيق مع PM2
npm install -g pm2
pm2 start npm --name "whatsapp-hub" -- start
pm2 save
pm2 startup
\`\`\`

### إعداد Nginx (للـ VPS)

\`\`\`nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/webhook {
        allow 31.13.0.0/16;
        allow 66.220.0.0/16;
        allow 69.63.0.0/16;
        allow 69.171.0.0/16;
        allow 173.252.0.0/16;
        deny all;
        
        proxy_pass http://localhost:3000;
    }
}
\`\`\`

ثم:

\`\`\`bash
sudo nginx -t
sudo systemctl reload nginx

# إعداد SSL مع Certbot
sudo certbot --nginx -d yourdomain.com
\`\`\`

---

## استكشاف الأخطاء وحلها

### خطأ: "WhatsApp API credentials not configured"

**الحل:**
- تأكد من وجود ملف `.env.local`
- تأكد من صحة المعرفات
- أعد تشغيل السيرفر: `npm run dev`

### خطأ: "Failed to send message"

**الأسباب المحتملة:**
1. رقم الهاتف غير صحيح - استخدم الصيغة: `966xxxxxxxxx` أو `1xxxxxxxxxx`
2. Access Token منتهي - احصل على توكن جديد من Meta
3. الرقم غير مسجل كـ Test Number - أضفه من لوحة Meta

**التحقق:**
\`\`\`bash
# افحص الـ console logs
[v0] Sending message to: 15557285727
[v0] WhatsApp API Error: {...}
\`\`\`

### خطأ: Webhook Verification Failed

**الحل:**
1. تأكد من أن `WEBHOOK_VERIFY_TOKEN` في `.env.local` يطابق ما في Meta
2. تأكد من أن التطبيق يعمل والرابط صحيح
3. جرب مرة أخرى

### الرسالة لا تصل

**تحقق من:**
1. الرسائل الاختبارية تعمل فقط على الأرقام المسجلة
2. التوكن صالح ولم ينتهي (انتهاء: ~2 شهر من تاريخ الإصدار)
3. صلاحيات التطبيق مفعلة بشكل صحيح

---

## الصفحات المتاحة

- `/` - الصفحة الرئيسية والتعريف بالتطبيق
- `/dashboard` - لوحة عرض الرسائل والملاحظات
- `/control` - لوحة التحكم الكاملة مع إرسال الرسائل

## API Endpoints

- `GET /api/webhook` - التحقق من webhook
- `POST /api/webhook` - استقبال الرسائل من WhatsApp
- `POST /api/messages/send` - إرسال رسالة
- `GET /api/messages` - جلب الرسائل
- `GET /api/stats` - جلب الإحصائيات
- `GET /api/system-users` - عرض System Users
- `GET /api/sessions` - عرض الجلسات النشطة
- `POST /api/sessions` - Handover يدوي

---

## الأمان في Production

### تغيير المعرفات قبل النشر النهائي

عند الانتقال للإنتاج الحقيقي:

1. **احصل على Access Token دائم** (لا ينتهي بعد شهرين)
2. **غيّر Verify Token** إلى قيمة عشوائية قوية
3. **فعّل HTTPS** (ضروري للـ webhook)
4. **لا تكشف App Secret** أبداً في الكود

### متغيرات البيئة الآمنة

\`\`\`env
# استخدم قيم قوية وعشوائية
WEBHOOK_VERIFY_TOKEN=$(openssl rand -hex 32)

# لا تضف المعرفات في Git
echo ".env.local" >> .gitignore
\`\`\`

---

## الدعم والتواصل

- التوثيق الرسمي: [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- استكشاف الأخطاء: راجع [Meta Debug Tool](https://developers.facebook.com/tools/debug/)

---

## ملاحظات مهمة

1. **فترة الاختبار 90 يوم**: رقم الهاتف الاختباري يعمل لمدة 90 يوم فقط
2. **Access Token**: ينتهي بعد ~2 شهر، يجب تجديده قبل الانتهاء
3. **Production Access**: للاستخدام التجاري الكامل، يجب مراجعة التطبيق من Meta
4. **Rate Limits**: WhatsApp Business API له حدود إرسال، راجع التوثيق

---

✅ **التطبيق جاهز الآن للتشغيل والاختبار!**

لأي استفسارات، راجع ملف `README.md` أو التوثيق في `docs/`
