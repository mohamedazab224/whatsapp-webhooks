#!/bin/bash
set -e

echo "🚀 بدء إعداد النشر..."

# المتغيرات
DEPLOY_DIR="/var/www/whatsapp-webhook"
NODE_VERSION="18"
APP_NAME="whatsapp-webhook"

# ألوان للطباعة
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}1. تحديث النظام...${NC}"
sudo apt update
sudo apt upgrade -y

echo -e "${BLUE}2. تثبيت Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs

echo -e "${BLUE}3. تثبيت PM2...${NC}"
sudo npm install -g pm2

echo -e "${BLUE}4. إنشاء مجلد التطبيق...${NC}"
sudo mkdir -p $DEPLOY_DIR
sudo chown $USER:$USER $DEPLOY_DIR

echo -e "${BLUE}5. تثبيت المتعلقات...${NC}"
cd $DEPLOY_DIR
npm install

echo -e "${BLUE}6. بناء Frontend...${NC}"
cd client
npm install
npm run build
cd ..

echo -e "${BLUE}7. إعداد متغيرات البيئة...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${BLUE}✓ تم إنشاء ملف .env - يرجى تحديثه بمفاتيحك${NC}"
fi

echo -e "${BLUE}8. بدء التطبيق مع PM2...${NC}"
pm2 start server.js --name $APP_NAME
pm2 startup
pm2 save

echo -e "${GREEN}✓ اكتمل الإعداد!${NC}"
echo -e "${GREEN}التطبيق متاح على: https://webhook.alazab.com${NC}"
echo -e "${GREEN}عرض السجلات: pm2 logs whatsapp-webhook${NC}"
