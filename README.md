# WhatsApp Hub - مركز إدارة رسائل WhatsApp

<div align="center">

![WhatsApp Hub](https://img.shields.io/badge/WhatsApp-Business_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Azure OpenAI](https://img.shields.io/badge/Azure-OpenAI-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)

تطبيق Next.js احترافي لإدارة رسائل WhatsApp عبر WhatsApp Business API مع Azure OpenAI Agent للرد التلقائي الذكي.

[البداية السريعة](#البداية-السريعة) • [الميزات](#المميزات) • [التوثيق](#التوثيق) • [النشر](#النشر)

</div>

---

## المميزات

- ✅ إرسال واستقبال رسائل WhatsApp
- ✅ **Azure OpenAI Agent** - ردود تلقائية ذكية بالذكاء الاصطناعي
- ✅ **إدارة طلبات الصيانة** - تلقائية بالكامل
- ✅ لوحة تحكم شاملة مع إحصائيات مباشرة
- ✅ نظام webhook ذكي للتوجيه التلقائي
- ✅ نموذج لجمع آراء وملاحظات العملاء
- ✅ نظام قوالب رسائل احترافي
- ✅ واجهة عربية احترافية مع تصميم عصري

---

## البداية السريعة

### التثبيت والتشغيل

\`\`\`bash
# 1. تثبيت الحزم
npm install

# 2. التطبيق مُعد مسبقاً بالمعرفات
# ملف .env.local موجود وجاهز

# 3. تشغيل التطبيق
npm run dev

# 4. افتح المتصفح
# http://localhost:3000
\`\`\`

### إرسال أول رسالة

1. افتح: `http://localhost:3000/control`
2. في نموذج "إرسال رسالة":
   - **رقم الهاتف**: `15557285727` (رقم اختبار)
   - **الرسالة**: اكتب أي شيء
3. اضغط "إرسال الرسالة"

✅ **جاهز للعمل!**

---

## الصفحات المتاحة

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| 🏠 الرئيسية | `/` | صفحة الترحيب والتعريف |
| 🎛️ لوحة التحكم | `/control` | إرسال واستقبال الرسائل + AI Agent |
| 📊 لوحة المراجعة | `/dashboard` | عرض الرسائل والملاحظات |

---

## API Endpoints

### Webhook
- `GET /api/webhook` - التحقق من webhook (Meta verification)
- `POST /api/webhook` - استقبال الرسائل والإشعارات

### Messages
- `POST /api/messages/send` - إرسال رسالة جديدة
- `GET /api/messages` - جلب جميع الرسائل

### Stats
- `GET /api/stats` - جلب الإحصائيات

### AI Agent
- `GET /api/ai-maintenance` - طلبات الصيانة
- `POST /api/ai-maintenance` - تحديث طلب
- `GET /api/ai-stats` - إحصائيات AI

---

## AI Agent المميزات الجديدة

### الرد التلقائي الذكي
- فهم اللغة العربية والإنجليزية
- سياق المحادثة محفوظ
- ردود فورية احترافية

### إدارة طلبات الصيانة
- إنشاء تلقائي عند الطلب
- تصنيف حسب النوع (سباكة، كهرباء، تكييف، إلخ)
- تحديد مستوى الطوارئ
- واجهة إدارة كاملة

### أمثلة على الاستخدام

\`\`\`
عميل: السلام عليكم، عندي تسريب ماء في المطبخ ضروري

AI Bot: وعليكم السلام 👋
تم استلام طلبكم بخصوص تسريب المياه.
رقم الطلب: REQ-1234567890
سيتم التواصل معكم خلال 30 دقيقة.
\`\`\`

---

## المعرفات المُعدة مسبقاً

التطبيق مُعد بالكامل بالمعرفات الصحيحة:

\`\`\`env
✅ WHATSAPP_PHONE_NUMBER_ID=644995285354639
✅ WHATSAPP_API_TOKEN=EAAKSz8Epkqk...
✅ AZURE_OPENAI_KEY=B9miWBdymm8e4BUFox...
✅ AZURE_OPENAI_DEPLOYMENT=AzaBot
✅ AZURE_OPENAI_ENDPOINT=https://azabotai.openai.azure.com
✅ WEBHOOK_VERIFY_TOKEN=uberfix_webhook_secure_2024_token
\`\`\`

### رقم الاختبار
- 📱 `+1 555 728 5727`
- ⏰ صالح لمدة 90 يوم

---

## إعداد Webhook (للتطوير)

### استخدام ngrok

\`\`\`bash
# تشغيل ngrok
ngrok http 3000
\`\`\`

### إضافة Webhook في Meta

1. اذهب إلى: [Meta Webhook Settings](https://developers.facebook.com/apps/724370950034089/whatsapp-business/wa-settings/)
2. أضف:
   - **Callback URL**: `https://your-ngrok-url.ngrok.io/api/webhook`
   - **Verify Token**: `uberfix_webhook_secure_2024_token`
3. اشترك في: `messages`

---

## النشر

### Vercel (موصى به)

\`\`\`bash
vercel
\`\`\`

### VPS أو Server

\`\`\`bash
npm run build
npm start

# أو باستخدام PM2
pm2 start npm --name "whatsapp-hub" -- start
\`\`\`

راجع [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) للتفاصيل الكاملة.

---

## البنية

\`\`\`
├── app/
│   ├── api/              # API Routes
│   │   ├── messages/     # إدارة الرسائل
│   │   ├── stats/        # الإحصائيات
│   │   ├── webhook/      # WhatsApp webhook
│   │   └── ai-maintenance/ # AI Agent for maintenance requests
│   ├── control/          # لوحة التحكم
│   ├── dashboard/        # لوحة المراجعة
│   └── page.tsx          # الصفحة الرئيسية
├── components/           # React Components
│   ├── ui/              # shadcn/ui components
│   └── ...              # Custom components
├── lib/                 # Utilities
│   ├── whatsapp.ts      # WhatsApp API client
│   ├── storage.ts       # Message storage
│   └── ai-agent.ts      # Azure OpenAI Agent
└── public/              # Static files
\`\`\`

---

## استكشاف الأخطاء

### الرسالة لا ترسل؟

\`\`\`bash
# تحقق من console logs
[v0] Sending message to: 15557285727
[v0] Message sent successfully
\`\`\`

**الحلول:**
- تأكد من تشغيل `npm run dev`
- استخدم الرقم بصيغة صحيحة: `15557285727`
- تحقق من صلاحية Access Token

### Webhook لا يعمل؟

**الحلول:**
- تأكد من تشغيل ngrok
- تحقق من الرابط في Meta
- Verify Token يجب أن يطابق `.env.local`

---

## التوثيق

- 📖 [دليل الإعداد الكامل](PRODUCTION_SETUP.md)
- 🤖 [دليل Azure OpenAI Agent](docs/AZURE_OPENAI_SETUP.md)
- 🚀 [البداية السريعة](QUICK_START.md)
- 📚 [توثيق API](docs/API_DOCUMENTATION.md)
- ⚙️ [دليل الإعداد](docs/SETUP_GUIDE.md)

---

## التقنيات المستخدمة

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **WhatsApp**: WhatsApp Business API (Graph API v21.0)
- **AI**: Azure OpenAI (GPT-4)

---

## الأمان

- 🔒 جميع المعرفات في متغيرات البيئة
- 🔒 HTTPS مطلوب للـ production
- 🔒 Webhook verification token
- 🔒 لا تشارك App Secret أبداً

---

## معلومات مهمة

- ⏰ **Access Token**: ينتهي بعد ~2 شهر
- ⏰ **رقم الاختبار**: يعمل لمدة 90 يوم
- 🏢 **للإنتاج**: يحتاج مراجعة من Meta

---

## الدعم

- 📖 [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- 🛠️ [Meta Debug Tool](https://developers.facebook.com/tools/debug/)
- 💬 [فتح Issue](https://github.com/your-repo/issues)

---

## الترخيص

MIT License - استخدم بحرية في مشاريعك

---

<div align="center">

**صُنع بـ ❤️ و 🤖 لإدارة رسائل WhatsApp بكفاءة**

</div>
