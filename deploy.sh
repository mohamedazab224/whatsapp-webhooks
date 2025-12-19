#!/bin/bash

# WhatsApp Hub - Production Deployment Script
# استخدم هذا السكريبت للنشر على VPS

set -e

echo "🚀 بدء عملية النشر..."

# الألوان للرسائل
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# دالة لطباعة رسائل النجاح
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# دالة لطباعة رسائل الخطأ
error() {
    echo -e "${RED}❌ $1${NC}"
}

# دالة لطباعة رسائل التحذير
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    error "Node.js غير مثبت. يرجى تثبيته أولاً."
    exit 1
fi
success "Node.js مثبت: $(node --version)"

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    error "npm غير مثبت."
    exit 1
fi
success "npm مثبت: $(npm --version)"

# التحقق من وجود PM2
if ! command -v pm2 &> /dev/null; then
    warning "PM2 غير مثبت. جاري التثبيت..."
    npm install -g pm2
    success "PM2 تم تثبيته"
fi

# التحقق من وجود ملف .env.local
if [ ! -f .env.local ]; then
    error "ملف .env.local غير موجود. يرجى إنشاؤه من .env.local.example"
    exit 1
fi
success "ملف .env.local موجود"

# تثبيت التبعيات
echo ""
echo "📦 تثبيت التبعيات..."
npm install
success "التبعيات تم تثبيتها"

# بناء التطبيق
echo ""
echo "🔨 بناء التطبيق..."
npm run build
success "التطبيق تم بناؤه بنجاح"

# إيقاف التطبيق القديم إن وجد
echo ""
echo "⏸️  إيقاف التطبيق القديم..."
pm2 delete whatsapp-hub 2>/dev/null || true

# تشغيل التطبيق الجديد
echo ""
echo "▶️  تشغيل التطبيق..."
pm2 start npm --name "whatsapp-hub" -- start

# حفظ قائمة PM2
pm2 save

# إعداد PM2 للتشغيل التلقائي عند بدء النظام
pm2 startup

success "التطبيق يعمل الآن!"

# عرض الحالة
echo ""
echo "📊 حالة التطبيق:"
pm2 status

echo ""
echo "📝 لمشاهدة السجلات:"
echo "   pm2 logs whatsapp-hub"
echo ""
echo "🛑 لإيقاف التطبيق:"
echo "   pm2 stop whatsapp-hub"
echo ""
echo "🔄 لإعادة تشغيل التطبيق:"
echo "   pm2 restart whatsapp-hub"
echo ""
success "النشر اكتمل بنجاح! 🎉"
