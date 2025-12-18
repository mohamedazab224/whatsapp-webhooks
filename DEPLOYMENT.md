# تعليمات النشر على السيرفر

## المتطلبات
- Node.js 16+ مثبت
- npm أو yarn
- وصول SSH إلى السيرفر
- Domain مع SSL (لديك بالفعل webhook.alazab.com)

## خطوات النشر

### 1. تحضير السيرفر

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت PM2 لإدارة العمليات
sudo npm install -g pm2

# إنشاء مجلد التطبيق
sudo mkdir -p /var/www/whatsapp-webhook
sudo chown $USER:$USER /var/www/whatsapp-webhook
cd /var/www/whatsapp-webhook
```

### 2. نسخ الملفات

```bash
# من جهازك المحلي
scp -r ./* user@webhook.alazab.com:/var/www/whatsapp-webhook/

# أو استخدم git
cd /var/www/whatsapp-webhook
git clone your-repo .
```

### 3. تثبيت المتعلقات

```bash
cd /var/www/whatsapp-webhook

# تثبيت Backend
npm install

# تثبيت Frontend
cd client
npm install
npm run build
cd ..
```

### 4. إعداد متغيرات البيئة

```bash
# نسخ ملف المثال
cp .env.example .env

# تعديل .env بمفاتيحك الفعلية
nano .env
```

أضف المتغيرات التالية:
```
PORT=8005
WHATSAPP_API_URL=https://graph.instagram.com/v18.0
WHATSAPP_VERIFY_TOKEN=your-verify-token-here
WHATSAPP_ACCESS_TOKEN=your-access-token-here
WHATSAPP_BUSINESS_PHONE_ID=your-phone-id-here
```

### 5. بدء التطبيق

```bash
# اختبار محلي أولاً
npm start

# يجب أن تحصل على: Server running on http://localhost:8005
```

### 6. استخدام PM2 لتشغيل الخادم في الخلفية

```bash
# بدء التطبيق مع PM2
pm2 start server.js --name "whatsapp-webhook"

# جعله يبدأ تلقائياً عند إعادة تشغيل السيرفر
pm2 startup
pm2 save

# عرض الحالة
pm2 status
pm2 logs whatsapp-webhook
```

### 7. تكوين Nginx (بناءً على إعدادك الحالي)

Nginx config موجود بالفعل في السيرفر، تأكد من أنه يشير إلى:

```nginx
upstream nodejs {
    server 127.0.0.1:8005;
}

server {
    listen 8843 ssl http2;
    server_name webhook.alazab.com;

    ssl_certificate /etc/letsencrypt/live/webhook.alazab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/webhook.alazab.com/privkey.pem;

    location / {
        proxy_pass http://nodejs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }
}
```

### 8. اختبار الاتصال

```bash
# اختبر الخادم
curl -k https://webhook.alazab.com/healthz

# يجب أن تحصل على استجابة JSON مع حالة ok
```

## تكوين WhatsApp API

### الحصول على الرموز المطلوبة:

1. اذهب إلى [Meta for Developers](https://developers.facebook.com)
2. أنشئ تطبيق جديد
3. اختر WhatsApp as your product
4. احصل على:
   - Access Token
   - Business Phone ID
   - Verify Token (عرّفه بنفسك)

### إعداد Webhook في WhatsApp:

1. في إعدادات تطبيقك، اذهب إلى "Webhooks"
2. أضف رابط الـ Webhook: \`https://webhook.alazab.com/api/webhook\`
3. استخدم verify token المحدد في .env
4. اختر الأحداث المطلوبة (messages, message_status, etc)

## المراقبة والصيانة

### عرض السجلات:
```bash
pm2 logs whatsapp-webhook

# أو مراقبة مباشرة
pm2 monit
```

### التحديثات:
```bash
cd /var/www/whatsapp-webhook
git pull
npm install
cd client && npm run build && cd ..
pm2 restart whatsapp-webhook
```

### استكشاف الأخطاء:

تحقق من أن:
- ✓ Node.js مثبت: \`node --version\`
- ✓ npm مثبت: \`npm --version\`
- ✓ المنفذ 8005 متاح: \`netstat -tuln | grep 8005\`
- ✓ SSL certificates صحيحة
- ✓ متغيرات البيئة مضبوطة: \`cat .env\`
- ✓ Nginx running: \`sudo systemctl status nginx\`

## الأداء والأمان

- استخدم \`pm2 plus\` للمراقبة المتقدمة
- قم بتفعيل CORS بشكل صحيح للـ whitelisting
- استخدم متغيرات البيئة ولا تضع المفاتيح في الكود
- فعّل Rate Limiting على الـ API endpoints
- احتفظ بـ SSL certificates محدثة (استخدم certbot auto-renew)
```

## استكشاف المشاكل الشائعة

### "Port already in use"
```bash
# العثور على العملية التي تستخدم المنفذ
lsof -i :8005
# أو إنهاء PM2
pm2 delete whatsapp-webhook
```

### "Connection refused"
```bash
# تحقق من Nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# تحقق من Node app
pm2 logs whatsapp-webhook
```

### "SSL Certificate Error"
```bash
# تجديد الشهادة
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```
