#!/bin/bash

# Production Deployment Script for Ubuntu 24 Server
# Domain: whatsapp.alazab.com

echo "========================================="
echo "WhatsApp Hub - Production Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
  echo -e "${RED}Error: Do not run this script as root${NC}"
  exit 1
fi

# Set variables
APP_DIR="/var/www/whatsapp-hub"
DOMAIN="whatsapp.alazab.com"

echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
cd $APP_DIR
git pull origin main || {
  echo -e "${RED}Failed to pull latest code${NC}"
  exit 1
}

echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install --production || {
  echo -e "${RED}Failed to install dependencies${NC}"
  exit 1
}

echo -e "${YELLOW}Step 3: Building application...${NC}"
npm run build || {
  echo -e "${RED}Build failed${NC}"
  exit 1
}

echo -e "${YELLOW}Step 4: Creating logs directory...${NC}"
mkdir -p logs

echo -e "${YELLOW}Step 5: Restarting application with PM2...${NC}"
pm2 restart ecosystem.config.js --update-env || {
  echo -e "${YELLOW}Starting fresh PM2 instance...${NC}"
  pm2 start ecosystem.config.js
}

echo -e "${YELLOW}Step 6: Saving PM2 configuration...${NC}"
pm2 save

echo -e "${YELLOW}Step 7: Reloading Nginx...${NC}"
sudo systemctl reload nginx || {
  echo -e "${RED}Failed to reload Nginx${NC}"
  exit 1
}

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Application URL: https://$DOMAIN"
echo "Webhook URL: https://$DOMAIN/api/webhook"
echo ""
echo "Useful commands:"
echo "  pm2 status         - Check app status"
echo "  pm2 logs           - View logs"
echo "  pm2 monit          - Monitor resources"
echo ""
