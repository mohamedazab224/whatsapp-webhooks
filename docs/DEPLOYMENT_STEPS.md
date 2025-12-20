# خطوات النشر التفصيلية على السيرفر

## المتطلبات الأساسية

- VPS أو خادم خاص (Ubuntu 20.04+ / Debian 11+)
- Domain name موجّه للسيرفر: `webhook.alazab.com`
- صلاحيات root أو sudo

---

## الخطوة 1: إعداد السيرفر

### تحديث النظام

\`\`\`bash
sudo apt update
sudo apt upgrade -y
\`\`\`

### تثبيت Node.js

\`\`\`bash
# تثبيت Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# التحقق من الإصدار
node --version  # يجب أن يكون v20.x
npm --version
\`\`\`

### تثبيت PM2

\`\`\`bash
sudo npm install -g pm2
\`\`\`

### تثبيت Nginx

\`\`\`bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
\`\`\`

### تثبيت Certbot (SSL)

\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
\`\`\`

---

## الخطوة 2: رفع التطبيق

### الخيار 1: استخدام Git

\`\`\`bash
# إنشاء مجلد للتطبيق
sudo mkdir -p /var/www/whatsapp-hub
sudo chown -R $USER:$USER /var/www/whatsapp-hub

# استنساخ المشروع
cd /var/www/whatsapp-hub
git clone https://github.com/your-username/whatsapp-hub.git .

# أو سحب التحديثات
git pull origin main
\`\`\`

### الخيار 2: رفع يدوي

\`\`\`bash
# على جهازك المحلي
zip -r whatsapp-hub.zip . -x "node_modules/*" ".next/*"

# رفع للسيرفر
scp whatsapp-hub.zip user@your-server:/var/www/

# على السيرفر
cd /var/www
unzip whatsapp-hub.zip -d whatsapp-hub
cd whatsapp-hub
\`\`\`

---

## الخطوة 3: إعداد المتغيرات البيئية

\`\`\`bash
cd /var/www/whatsapp-hub

# نسخ من المثال
cp .env.local.example .env.local

# تعديل الملف
nano .env.local
\`\`\`

املأ المتغيرات:

\`\`\`env
WHATSAPP_PHONE_NUMBER_ID=644995285354639
WHATSAPP_BUSINESS_ACCOUNT_ID=459851797218855
WHATSAPP_API_TOKEN=EAAKSz8Epk...
WHATSAPP_APP_ID=724370950034089
WHATSAPP_APP_SECRET=1099e980daa2...
WHATSAPP_API_VERSION=v21.0
WHATSAPP_CRM_TOKEN=your_crm_token
WHATSAPP_INTEGRATION_TOKEN=your_integration_token
WEBHOOK_VERIFY_TOKEN=uberfix_webhook_secure_2024_token
NEXT_PUBLIC_WEBHOOK_URL=https://webhook.alazab.com
NODE_ENV=production
\`\`\`

احفظ: `Ctrl + X` ثم `Y` ثم `Enter`

---

## الخطوة 4: بناء وتشغيل التطبيق

### استخدام سكريبت النشر التلقائي

\`\`\`bash
chmod +x deploy.sh
./deploy.sh
\`\`\`

### أو يدوياً

\`\`\`bash
# تثبيت التبعيات
npm install

# بناء التطبيق
npm run build

# تشغيل بـ PM2
pm2 start npm --name "whatsapp-hub" -- start
pm2 save
pm2 startup
\`\`\`

---

## الخطوة 5: إعداد Nginx

\`\`\`bash
# نسخ إعدادات Nginx
sudo cp nginx-config-example.conf /etc/nginx/sites-available/webhook.alazab.com

# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/webhook.alazab.com /etc/nginx/sites-enabled/

# اختبار الإعدادات
sudo nginx -t

# إعادة تحميل Nginx
sudo systemctl reload nginx
\`\`\`

---

## الخطوة 6: إعداد SSL

\`\`\`bash
# الحصول على شهادة SSL
sudo certbot --nginx -d webhook.alazab.com

# اتبع التعليمات واختر:
# 1) إدخال بريدك الإلكتروني
# 2) الموافقة على الشروط
# 3) اختيار Redirect (تحويل HTTP → HTTPS)

# التحقق من التجديد التلقائي
sudo certbot renew --dry-run
\`\`\`

---

## الخطوة 7: إعداد Firewall

\`\`\`bash
# السماح بـ SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# التحقق من الحالة
sudo ufw status
\`\`\`

---

## الخطوة 8: اختبار التطبيق

### اختبار محلي

\`\`\`bash
# التحقق من عمل التطبيق
curl http://localhost:3000

# يجب أن ترى HTML للصفحة الرئيسية
\`\`\`

### اختبار عام

افتح المتصفح:

\`\`\`
https://webhook.alazab.com
\`\`\`

يجب أن تظهر الصفحة الرئيسية بشكل صحيح.

---

## الخطوة 9: إعداد Webhook في Meta

1. اذهب إلى: [Meta Developers Console](https://developers.facebook.com/apps/724370950034089/whatsapp-business/wa-settings/)

2. في قسم Webhook:
   - **Callback URL**: `https://webhook.alazab.com/api/webhook`
   - **Verify Token**: `uberfix_webhook_secure_2024_token`
   - اضغط "Verify and Save"

3. اشترك في الأحداث:
   - ✅ `messages`
   - ✅ `message_status`

---

## الخطوة 10: اختبار Webhook

### إرسال رسالة اختبارية

من WhatsApp، أرسل رسالة إلى رقمك الاختباري: `+1 555 728 5727`

### مراقبة Logs

\`\`\`bash
pm2 logs whatsapp-hub

# يجب أن ترى:
[v0] Webhook received: {...}
[v0] Message stored: {...}
\`\`\`

---

## أوامر PM2 المهمة

\`\`\`bash
# عرض الحالة
pm2 status

# عرض Logs
pm2 logs whatsapp-hub

# إعادة التشغيل
pm2 restart whatsapp-hub

# إيقاف
pm2 stop whatsapp-hub

# حذف من PM2
pm2 delete whatsapp-hub

# عرض الموارد المستخدمة
pm2 monit
\`\`\`

---

## استكشاف الأخطاء

### التطبيق لا يعمل

\`\`\`bash
# التحقق من Logs
pm2 logs whatsapp-hub --lines 100

# التحقق من المنفذ
sudo netstat -tulpn | grep 3000

# إعادة التشغيل
pm2 restart whatsapp-hub
\`\`\`

### Nginx لا يعمل

\`\`\`bash
# التحقق من الحالة
sudo systemctl status nginx

# اختبار الإعدادات
sudo nginx -t

# عرض Error logs
sudo tail -f /var/log/nginx/error.log
\`\`\`

### SSL لا يعمل

\`\`\`bash
# التحقق من الشهادة
sudo certbot certificates

# تجديد يدوي
sudo certbot renew

# إعادة تحميل Nginx
sudo systemctl reload nginx
\`\`\`

### Webhook لا يستقبل

1. تأكد من أن Verify Token صحيح
2. تأكد من عمل HTTPS
3. تحقق من Nginx logs:
   \`\`\`bash
   sudo tail -f /var/log/nginx/webhook.alazab.com.access.log
   \`\`\`
4. تحقق من IP Whitelist في Nginx

---

## تحديث التطبيق

\`\`\`bash
cd /var/www/whatsapp-hub

# سحب التحديثات
git pull origin main

# تشغيل سكريبت النشر
./deploy.sh

# أو يدوياً:
npm install
npm run build
pm2 restart whatsapp-hub
\`\`\`

---

## النسخ الاحتياطي

### نسخ احتياطي يدوي

\`\`\`bash
# نسخ احتياطي للتطبيق
cd /var/www
tar -czf whatsapp-hub-backup-$(date +%Y%m%d).tar.gz whatsapp-hub/

# نسخ احتياطي لـ Nginx
sudo cp /etc/nginx/sites-available/webhook.alazab.com ~/nginx-backup.conf
\`\`\`

### نسخ احتياطي تلقائي (Cron)

\`\`\`bash
# فتح crontab
crontab -e

# إضافة السطر التالي (نسخ احتياطي يومي الساعة 2 صباحاً):
0 2 * * * cd /var/www && tar -czf whatsapp-hub-backup-$(date +\%Y\%m\%d).tar.gz whatsapp-hub/
\`\`\`

---

## المراقبة والصيانة

### إعداد Uptime Monitoring

استخدم خدمة مثل:
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com

راقب: `https://webhook.alazab.com/health`

### تنظيف Logs

\`\`\`bash
# تنظيف PM2 logs
pm2 flush

# تنظيف Nginx logs (اختياري)
sudo truncate -s 0 /var/log/nginx/*.log
\`\`\`

### تحديثات الأمان

\`\`\`bash
# تحديث النظام شهرياً
sudo apt update
sudo apt upgrade -y

# تحديث npm packages
cd /var/www/whatsapp-hub
npm audit
npm audit fix
npm update
\`\`\`

---

## الخلاصة

بعد إتمام جميع الخطوات:

✅ التطبيق يعمل على: `https://webhook.alazab.com`
✅ Webhook يستقبل الرسائل من WhatsApp
✅ SSL مُفعّل وآمن
✅ PM2 يدير التطبيق
✅ Nginx يعمل كـ reverse proxy
✅ Firewall محدد ومؤمن

التطبيق الآن جاهز للإنتاج! 🎉
