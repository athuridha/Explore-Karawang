#!/bin/bash

# ============================================
# EXPLORE KARAWANG - QUICK START DEPLOYMENT
# ============================================

echo "🚀 Explore Karawang - Server Deployment"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: SSH
echo -e "${YELLOW}Step 1: Connect to Server${NC}"
echo "ssh explorekarawang@amar-db"
echo "cd ~/htdocs"
read -p "Press Enter when connected..."

# Step 2: Fix Permissions
echo -e "${YELLOW}Step 2: Fixing Permissions...${NC}"
sudo chown -R explorekarawang:explorekarawang ~/htdocs
sudo chmod -R 755 ~/htdocs
mkdir -p ~/.next ~/.pm2
chmod -R 755 ~/.next ~/.pm2
echo -e "${GREEN}✓ Permissions fixed${NC}"

# Step 3: Update Code
echo -e "${YELLOW}Step 3: Updating Code...${NC}"
git pull origin main
echo -e "${GREEN}✓ Code updated${NC}"

# Step 4: Install Dependencies
echo -e "${YELLOW}Step 4: Installing Dependencies...${NC}"
npm ci --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Build
echo -e "${YELLOW}Step 5: Building Next.js...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Step 6: Start PM2
echo -e "${YELLOW}Step 6: Starting PM2...${NC}"
npm run pm2:start
sleep 2

# Step 7: Setup Startup
echo -e "${YELLOW}Step 7: Setting up Startup Scripts...${NC}"
pm2 startup
pm2 save
echo -e "${GREEN}✓ PM2 will auto-start on reboot${NC}"

# Step 8: Status
echo -e "${YELLOW}Step 8: Checking Status...${NC}"
npm run pm2:status

echo -e "${GREEN}========================================"
echo "✓ Deployment Complete!"
echo "========================================"
echo "📍 App running at http://localhost:3000"
echo ""
echo "Useful commands:"
echo "  pm2 logs explore-karawang    - View logs"
echo "  pm2 restart explore-karawang - Restart app"
echo "  pm2 status                   - Check status"
echo "========================================"
