# دليل الإعداد الشامل

## خطوة بخطوة: إعداد WhatsApp Business API

### 1. إنشاء حساب Facebook Business

1. انتقل إلى [Meta Business Suite](https://business.facebook.com/)
2. أنشئ حساب أعمال جديد
3. أكمل معلومات الشركة

### 2. إنشاء تطبيق WhatsApp Business

1. اذهب إلى [Facebook for Developers](https://developers.facebook.com/)
2. انقر على "Create App"
3. اختر "Business" كنوع التطبيق
4. املأ التفاصيل المطلوبة
5. من لوحة التطبيق، اضغط "Add Product"
6. اختر "WhatsApp" وأكمل الإعداد

### 3. الحصول على رقم هاتف تجريبي

WhatsApp يوفر رقم تجريبي للاختبار:

1. من لوحة WhatsApp، اذهب إلى "API Setup"
2. سترى رقم هاتف تجريبي
3. يمكنك إضافة حتى 5 أرقام للاختبار
4. أضف رقمك للاختبار

### 4. الحصول على Access Token

#### Token مؤقت (للاختبار):
1. في صفحة "API Setup"
2. انسخ الـ "Temporary access token"
3. صالح لمدة 24 ساعة

#### Token دائم (للإنتاج):
1. اذهب إلى "System Users" في Business Settings
2. أنشئ System User جديد
3. اختر "Admin" كدور
4. Generate Token واختر الصلاحيات المطلوبة:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. احفظ الـ Token بأمان

### 5. إعداد Webhook

#### للتطوير المحلي (باستخدام ngrok):

1. ثبت ngrok:
```bash
npm install -g ngrok
```

2. شغّل التطبيق:
```bash
npm run dev
```

3. في terminal جديد، شغّل ngrok:
```bash
ngrok http 3000
```

4. انسخ الـ HTTPS URL من ngrok (مثل: `https://xxxx-xx-xx-xx-xx.ngrok.io`)

5. في لوحة WhatsApp:
   - اذهب إلى "Configuration" > "Webhook"
   - Callback URL: `https://xxxx.ngrok.io/api/webhook`
   - Verify Token: ضع نفس القيمة الموجودة في `.env.local`
   - اضغط "Verify and Save"

6. اشترك في Webhook fields:
   - ✓ messages

#### للإنتاج:

استخدم domain الحقيقي الخاص بك:
```
https://yourdomain.com/api/webhook
```

### 6. اختبار الإعداد

1. أرسل رسالة WhatsApp من رقمك إلى الرقم التجريبي
2. يجب أن تظهر الرسالة في لوحة التحكم
3. جرب إرسال رسالة من التطبيق

### 7. الترقية للإنتاج

لاستخدام التطبيق مع عملاء حقيقيين:

1. **أكمل App Review**:
   - اذهب إلى "App Review" > "Permissions and Features"
   - اطلب مراجعة لـ `whatsapp_business_messaging`

2. **احصل على رقم هاتف حقيقي**:
   - اذهب إلى WhatsApp > Phone Numbers
   - أضف رقم هاتف أعمال حقيقي
   - أكمل عملية التحقق

3. **انقل إلى حساب Business حقيقي**:
   - حوّل من Test Mode إلى Production Mode
   - استخدم Access Token دائم

## استكشاف الأخطاء

### خطأ: Webhook Verification Failed

- تأكد من أن Verify Token صحيح
- تأكد من أن الـ URL يعمل ويمكن الوصول إليه
- تحقق من Console logs

### خطأ: Message Not Received

- تأكد من اشتراك Webhook في حدث `messages`
- تحقق من صلاحيات Access Token
- راجع Webhook logs في Facebook Dashboard

### خطأ: Cannot Send Message

- تأكد من صحة Access Token
- تأكد من صحة Phone Number ID
- تحقق من أن الرقم المستلم مسجل (في Test Mode)

## نصائح مهمة

1. احتفظ بنسخة احتياطية من الـ Access Token
2. لا تشارك الـ tokens في GitHub
3. استخدم HTTPS دائماً
4. راقب Webhook logs بانتظام
5. اختبر جميع الميزات قبل النشر
