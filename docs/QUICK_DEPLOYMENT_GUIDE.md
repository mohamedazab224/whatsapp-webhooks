# دليل النشر السريع - Quick Deployment Guide
## خطوات النشر على whatsapp.alazab.com

---

## الخطوات الأساسية (15 دقيقة)

### 1. تحضير السيرفر

\`\`\`bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت PM2 و Nginx و Certbot
sudo npm install -g pm2
sudo apt install -y nginx certbot python3-certbot-nginx
\`\`\`

### 2. رفع الكود

\`\`\`bash
# إنشاء المجلد
sudo mkdir -p /var/www/whatsapp-hub
sudo chown -R $USER:$USER /var/www/whatsapp-hub

# رفع الملفات (اختر طريقة)
# طريقة 1: Git
cd /var/www/whatsapp-hub
git clone <your-repo> .

# طريقة 2: ZIP
scp whatsapp-hub.zip user@server:/var/www/
cd /var/www && unzip whatsapp-hub.zip -d whatsapp-hub
\`\`\`

### 3. إعداد Environment

\`\`\`bash
cd /var/www/whatsapp-hub
cp .env.production .env.local

# تعديل المتغيرات
nano .env.local
# غير NEXT_PUBLIC_WEBHOOK_URL و NEXT_PUBLIC_APP_URL
# إلى https://whatsapp.alazab.com
\`\`\`

### 4. بناء وتشغيل

\`\`\`bash
npm install --production
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

### 5. إعداد Nginx

\`\`\`bash
sudo cp nginx.conf /etc/nginx/sites-available/whatsapp.alazab.com
sudo ln -s /etc/nginx/sites-available/whatsapp.alazab.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### 6. تفعيل SSL

\`\`\`bash
sudo certbot --nginx -d whatsapp.alazab.com
\`\`\`

### 7. Firewall

\`\`\`bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
\`\`\`

### 8. إعداد Webhook في Meta

1. اذهب إلى: https://developers.facebook.com/apps/724370950034089/whatsapp-business/wa-settings/
2. Callback URL: `https://whatsapp.alazab.com/api/webhook`
3. Verify Token: `uberfix_webhook_secure_2024_token`
4. Subscribe to: messages, message_status

---

## الاختبار

\`\`\`bash
# فحص التطبيق
pm2 status
curl https://whatsapp.alazab.com

# فحص Webhook
curl "https://whatsapp.alazab.com/api/webhook?hub.mode=subscribe&hub.verify_token=uberfix_webhook_secure_2024_token&hub.challenge=test"

# مراقبة Logs
pm2 logs whatsapp-hub
\`\`\`

---

## التحديث السريع

\`\`\`bash
cd /var/www/whatsapp-hub
./deploy-production.sh
\`\`\`

---

## أوامر مهمة

\`\`\`bash
pm2 status          # الحالة
pm2 logs            # Logs
pm2 restart all     # إعادة التشغيل
pm2 monit           # المراقبة
sudo systemctl reload nginx  # إعادة تحميل Nginx
\`\`\`

---

**✅ التطبيق الآن جاهز على: https://whatsapp.alazab.com**
