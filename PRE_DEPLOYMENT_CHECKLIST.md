# قائمة المراجعة قبل النشر على الإنتاج

## التاريخ: __________
## المراجع: __________

---

## 1. البنية الأساسية

- [ ] التطبيق يعمل محلياً بدون أخطاء (`npm run dev`)
- [ ] البناء ينجح بدون أخطاء (`npm run build`)
- [ ] جميع الصفحات تُحمل بشكل صحيح:
  - [ ] `/` - الصفحة الرئيسية
  - [ ] `/control` - لوحة التحكم
  - [ ] `/dashboard` - لوحة المراجعة
- [ ] جميع API routes تستجيب بشكل صحيح

---

## 2. المتغيرات البيئية

### ملف `.env.local` موجود ويحتوي على:

- [ ] `WHATSAPP_PHONE_NUMBER_ID` - معرف رقم الهاتف
- [ ] `WHATSAPP_BUSINESS_ACCOUNT_ID` - معرف حساب الأعمال
- [ ] `WHATSAPP_API_TOKEN` - توكن API الرئيسي (Bot)
- [ ] `WHATSAPP_APP_ID` - معرف التطبيق
- [ ] `WHATSAPP_APP_SECRET` - سر التطبيق
- [ ] `WHATSAPP_API_VERSION` - إصدار API (v21.0)
- [ ] `WHATSAPP_CRM_TOKEN` - توكن CRM (System User 2)
- [ ] `WHATSAPP_INTEGRATION_TOKEN` - توكن التكامل (System User 3)
- [ ] `WEBHOOK_VERIFY_TOKEN` - رمز التحقق من Webhook
- [ ] `NEXT_PUBLIC_WEBHOOK_URL` - رابط Webhook العام

### على السيرفر/Vercel:

- [ ] جميع المتغيرات البيئية مضافة في لوحة التحكم
- [ ] لا توجد مفاتيح سرية في الكود
- [ ] ملف `.env.local` مضاف في `.gitignore`

---

## 3. إعداد WhatsApp Business API

### في Meta Developers Console:

- [ ] التطبيق موجود ومُفعّل
- [ ] WhatsApp Business تم إضافته للتطبيق
- [ ] رقم الهاتف مُفعّل ويعمل:
  - الرقم الاختباري: `+1 555 728 5727`
  - صالح حتى: __________

### Webhook Configuration:

- [ ] Callback URL صحيح: `https://webhook.alazab.com/api/webhook`
- [ ] Verify Token يطابق `WEBHOOK_VERIFY_TOKEN`
- [ ] Webhook تم التحقق منه بنجاح (✅ Verified)
- [ ] Subscribed Fields مُفعّلة:
  - [ ] `messages`
  - [ ] `message_status`

### System Users (3 مستخدمين منفصلين):

#### System User 1 - Automation Bot
- [ ] تم إنشاء System User
- [ ] Role: Admin
- [ ] Token: Permanent
- [ ] Scopes:
  - [ ] `whatsapp_business_messaging`
  - [ ] `whatsapp_business_management`
- [ ] Token مضاف في `WHATSAPP_API_TOKEN`

#### System User 2 - CRM/Helpdesk
- [ ] تم إنشاء System User
- [ ] Role: Employee
- [ ] Token: Permanent
- [ ] Scopes:
  - [ ] `whatsapp_business_messaging`
- [ ] Token مضاف في `WHATSAPP_CRM_TOKEN`

#### System User 3 - Integrations
- [ ] تم إنشاء System User
- [ ] Role: Admin
- [ ] Token: Permanent
- [ ] Scopes:
  - [ ] `whatsapp_business_messaging`
  - [ ] `whatsapp_business_management`
- [ ] Token مضاف في `WHATSAPP_INTEGRATION_TOKEN`

---

## 4. اختبار الوظائف الأساسية

### اختبار إرسال الرسائل:

- [ ] إرسال رسالة نصية عادية - يعمل ✅
- [ ] إرسال رسالة مع متغيرات - يعمل ✅
- [ ] إرسال رسالة من قالب - يعمل ✅
- [ ] الرسالة تصل للرقم الاختباري
- [ ] Status يتحدث بشكل صحيح (sent → delivered → read)

### اختبار استقبال الرسائل (Webhook):

- [ ] الرسائل الواردة تظهر في لوحة التحكم
- [ ] الرسائل تُحفظ بشكل صحيح
- [ ] التوقيت الزمني صحيح
- [ ] الأسماء تظهر بشكل صحيح

### اختبار Webhook Router:

- [ ] رسالة نصية عادية → Bot (automation_bot)
- [ ] رسالة بكلمة "موظف" → Human Agent
- [ ] رسالة صورة/فيديو → Human Agent
- [ ] رسالة تفاعلية → Flow Handler

### اختبار Handover:

- [ ] التحويل من Bot إلى Human يعمل
- [ ] التحويل من Human إلى Bot يعمل
- [ ] الجلسات تُحفظ بشكل صحيح
- [ ] Session timeout يعمل (30 دقيقة)

### اختبار Templates:

- [ ] إضافة قالب جديد - يعمل ✅
- [ ] حذف قالب - يعمل ✅
- [ ] استخدام قالب مع متغيرات - يعمل ✅
- [ ] القوالب منظمة حسب الفئات:
  - [ ] `auth_` - المصادقة
  - [ ] `service_` - الخدمات
  - [ ] `notify_` - الإشعارات
  - [ ] `promo_` - العروض
  - [ ] `system_` - النظام

---

## 5. الأمان والحماية

### Webhook Security:

- [ ] Verify Token قوي وعشوائي
- [ ] Webhook يرفض الطلبات بدون token صحيح
- [ ] HTTPS مُفعّل (إجباري)
- [ ] IP Whitelist محدد (اختياري):
  - [ ] Meta IPs مضافة
  - [ ] جميع الـ IPs الأخرى محجوبة

### API Security:

- [ ] لا توجد مفاتيح سرية مكشوفة في الكود
- [ ] App Secret محمي ولا يُرسل للعميل
- [ ] Rate Limiting مطبق (1000 طلب/دقيقة)
- [ ] Error messages لا تكشف معلومات حساسة

### Data Protection:

- [ ] الرسائل تُحفظ بشكل آمن
- [ ] لا يوجد تسجيل للبيانات الحساسة في logs
- [ ] Tokens محمية في Environment Variables فقط

---

## 6. الأداء والاستقرار

### Performance:

- [ ] الصفحات تُحمل بسرعة (< 3 ثواني)
- [ ] الصور محسّنة
- [ ] JavaScript مُصغّر
- [ ] CSS مُصغّر
- [ ] لا توجد memory leaks

### Monitoring:

- [ ] Console logs تعمل بشكل صحيح
- [ ] أخطاء الإرسال تُسجّل
- [ ] Webhook errors تُسجّل
- [ ] نظام تنبيهات جاهز (اختياري)

### Scalability:

- [ ] التطبيق يتحمل 100 رسالة/دقيقة
- [ ] Database/Storage يتحمل الحمل
- [ ] لا توجد bottlenecks

---

## 7. السيرفر والبنية التحتية

### Domain & SSL:

- [ ] النطاق: `webhook.alazab.com` يعمل
- [ ] SSL Certificate صالح ومُفعّل
- [ ] HTTPS redirect يعمل
- [ ] WWW redirect محدد (إن وجد)

### Server Configuration:

- [ ] Node.js مثبت (v18+)
- [ ] npm/pnpm مثبت
- [ ] PM2 مثبت ومُكوّن (للـ VPS)
- [ ] التطبيق يعمل عند إعادة تشغيل السيرفر

### Nginx/Reverse Proxy:

- [ ] Nginx مُكوّن بشكل صحيح
- [ ] Proxy pass للمنفذ 3000
- [ ] IP Whitelist للـ `/api/webhook`
- [ ] CORS محدد بشكل صحيح
- [ ] Request timeouts محددة

### Firewall:

- [ ] المنفذ 80 مفتوح (HTTP)
- [ ] المنفذ 443 مفتوح (HTTPS)
- [ ] المنفذ 3000 محجوب من الخارج
- [ ] SSH محمي (منفذ غير قياسي)

---

## 8. النشر

### Pre-Deployment:

- [ ] جميع التغييرات committed في Git
- [ ] النسخة tagged بشكل صحيح (v1.0.0)
- [ ] README محدّث
- [ ] CHANGELOG محدّث

### Deployment Method:

#### إذا كنت تستخدم Vercel:
- [ ] Project متصل بـ Git repo
- [ ] Environment Variables مضافة
- [ ] Build settings صحيحة
- [ ] Deploy hooks محددة (اختياري)

#### إذا كنت تستخدم VPS:
- [ ] الكود منسوخ على السيرفر
- [ ] `npm install` تم تشغيله
- [ ] `npm run build` نجح
- [ ] `.env.local` موجود بالمعرفات
- [ ] PM2 يشغل التطبيق
- [ ] PM2 startup enabled

### Post-Deployment:

- [ ] التطبيق يعمل على الرابط النهائي
- [ ] جميع الصفحات تُحمل
- [ ] Webhook يستقبل الرسائل
- [ ] الإرسال يعمل من الواجهة
- [ ] Console logs تظهر بشكل صحيح

---

## 9. التوثيق

- [ ] `README.md` محدّث بالمعلومات الصحيحة
- [ ] `PRODUCTION_SETUP.md` محدّث
- [ ] `QUICK_START.md` موجود
- [ ] `API_DOCUMENTATION.md` موجود
- [ ] شرح System Users موجود
- [ ] شرح Webhook Router موجود
- [ ] أمثلة على Templates موجودة

---

## 10. النسخ الاحتياطي والاستعادة

### Backup Strategy:

- [ ] نسخ احتياطي تلقائي للـ database (إن وجد)
- [ ] نسخ احتياطي للـ templates
- [ ] نسخ احتياطي للـ environment variables
- [ ] خطة استعادة في حالة الفشل

### Rollback Plan:

- [ ] نسخة سابقة محفوظة
- [ ] خطوات الـ rollback موثقة
- [ ] Downtime محدد (< 5 دقائق)

---

## 11. اختبار ما بعد النشر

### Immediate Tests (خلال 5 دقائق):

- [ ] الصفحة الرئيسية تُحمل
- [ ] لوحة التحكم تعمل
- [ ] إرسال رسالة يعمل
- [ ] استقبال رسالة يعمل

### Extended Tests (خلال ساعة):

- [ ] إرسال 10 رسائل متتالية
- [ ] استقبال 10 رسائل
- [ ] Handover يعمل
- [ ] Templates تعمل
- [ ] لا توجد memory leaks

### 24 Hour Tests:

- [ ] التطبيق مستقر
- [ ] لا توجد أخطاء غير متوقعة
- [ ] Performance جيد
- [ ] Logs نظيفة

---

## 12. الدعم والصيانة

### Support Channels:

- [ ] قنوات الدعم محددة
- [ ] فريق الدعم مُدرّب
- [ ] Documentation متاحة للفريق

### Maintenance Plan:

- [ ] خطة صيانة دورية (أسبوعية/شهرية)
- [ ] تحديثات أمنية محددة
- [ ] Token renewal strategy محددة (كل شهرين)

### Monitoring & Alerts:

- [ ] نظام مراقبة مُفعّل
- [ ] تنبيهات الأخطاء تعمل
- [ ] uptime monitoring active

---

## 13. الامتثال والقوانين

### WhatsApp Policies:

- [ ] التطبيق يتبع سياسات WhatsApp
- [ ] لا يوجد spam
- [ ] رسائل ترويجية محدودة
- [ ] Opt-out mechanism موجود

### Privacy & GDPR:

- [ ] سياسة الخصوصية موجودة
- [ ] إشعار بجمع البيانات
- [ ] حق الحذف متاح
- [ ] Data retention policy محددة

---

## 14. الأرقام المهمة

### Contact Information:

\`\`\`
الرقم الاختباري: +1 555 728 5727
صالح حتى: [90 يوم من تاريخ الإصدار]

الدعم الفني: ___________
WhatsApp Business Account: 459851797218855
Phone Number ID: 644995285354639
\`\`\`

### Important Links:

\`\`\`
- Meta Developers: https://developers.facebook.com/apps/724370950034089
- Webhook Setup: https://developers.facebook.com/apps/724370950034089/whatsapp-business/wa-settings/
- System Users: https://business.facebook.com/settings/system-users
- Production URL: https://webhook.alazab.com
\`\`\`

---

## 15. التوقيع والموافقة

تم مراجعة جميع النقاط أعلاه والتأكد من جاهزية التطبيق للنشر.

**المراجع الفني:** __________________  
**التاريخ:** __________  
**التوقيع:** __________

**مدير المشروع:** __________________  
**التاريخ:** __________  
**التوقيع:** __________

---

## ملاحظات إضافية

\`\`\`
[مساحة للملاحظات الإضافية أو التعليقات]









\`\`\`

---

✅ **عند إتمام جميع النقاط، التطبيق جاهز للنشر على الإنتاج!**
