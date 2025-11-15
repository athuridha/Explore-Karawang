#!/bin/bash

# ============================================
# EXPLORE KARAWANG - INITIAL SERVER SETUP
# ============================================
# Run this script ONCE when first setting up the server

set -e

echo "🚀 Explore Karawang - Initial Server Setup"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as correct user
CURRENT_USER=$(whoami)
echo -e "${YELLOW}Current user: $CURRENT_USER${NC}"

# Step 1: Fix Permissions
echo -e "\n${YELLOW}Step 1: Fixing Permissions...${NC}"
sudo chown -R $CURRENT_USER:$CURRENT_USER ~/htdocs
sudo chmod -R 755 ~/htdocs
mkdir -p ~/.next ~/.pm2
chmod -R 755 ~/.next ~/.pm2
echo -e "${GREEN}✓ Permissions fixed${NC}"

# Step 2: Clone or Update Repository
echo -e "\n${YELLOW}Step 2: Setting up code repository...${NC}"
if [ -d "~/htdocs/.git" ]; then
  echo "Git repository exists, pulling latest..."
  cd ~/htdocs
  git pull origin main
else
  echo "Please clone your repository to ~/htdocs first"
  echo "Example: git clone https://github.com/yourusername/your-repo.git ~/htdocs"
  exit 1
fi
echo -e "${GREEN}✓ Code repository ready${NC}"

# Step 3: Setup Environment Variables
echo -e "\n${YELLOW}Step 3: Setting up environment variables...${NC}"
if [ ! -f ~/htdocs/.env.local ]; then
  echo "Creating .env.local from example..."
  cp ~/htdocs/.env.local.example ~/htdocs/.env.local
  echo -e "${RED}⚠️  IMPORTANT: Edit .env.local with your database credentials!${NC}"
  echo "Run: nano ~/htdocs/.env.local"
else
  echo ".env.local already exists"
fi
echo -e "${GREEN}✓ Environment file ready${NC}"

# Step 4: Install Dependencies
echo -e "\n${YELLOW}Step 4: Installing Node.js dependencies...${NC}"
cd ~/htdocs
npm ci --legacy-peer-deps || npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 5: Create necessary directories
echo -e "\n${YELLOW}Step 5: Creating necessary directories...${NC}"
mkdir -p ~/htdocs/logs
mkdir -p ~/htdocs/public/uploads
chmod -R 777 ~/htdocs/public/uploads
echo -e "${GREEN}✓ Directories created${NC}"

# Step 6: Build Application
echo -e "\n${YELLOW}Step 6: Building Next.js application...${NC}"
cd ~/htdocs
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed - check your code and environment variables${NC}"
    exit 1
fi

# Step 7: Setup MySQL Database
echo -e "\n${YELLOW}Step 7: Database Setup${NC}"
echo "Please ensure MySQL is installed and running"
echo "Run the SQL scripts in ~/htdocs/scripts/ to create tables:"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/01-create-mysql-tables.sql"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/02-auth-mysql-tables.sql"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/03-seed-admin-user.sql"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/05-create-carousel-table.sql"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/06-create-categories-table.sql"
echo "  mysql -u root -p karawang < ~/htdocs/scripts/07-add-facilities-management.sql"

# Step 8: Start with PM2
echo -e "\n${YELLOW}Step 8: Starting application with PM2...${NC}"
cd ~/htdocs
pm2 start ecosystem.config.js
sleep 3

# Step 9: Setup PM2 Startup
echo -e "\n${YELLOW}Step 9: Configuring PM2 auto-start on reboot...${NC}"
pm2 startup
echo "Copy and run the command above as suggested by PM2"
pm2 save
echo -e "${GREEN}✓ PM2 configured for auto-start${NC}"

# Step 10: Show Status
echo -e "\n${YELLOW}Step 10: Checking application status...${NC}"
pm2 status
pm2 logs explore-karawang --lines 20

echo -e "\n${GREEN}=========================================="
echo "✓ Initial Setup Complete!"
echo "=========================================="
echo "📍 Application running on port 3000"
echo ""
echo "Next Steps:"
echo "1. Edit .env.local with your database credentials"
echo "2. Run the MySQL setup scripts (see Step 7 above)"
echo "3. Setup Nginx reverse proxy (see DEPLOYMENT.md)"
echo "4. Setup SSL with Let's Encrypt (see DEPLOYMENT.md)"
echo ""
echo "Useful commands:"
echo "  pm2 logs explore-karawang    - View logs"
echo "  pm2 restart explore-karawang - Restart app"
echo "  pm2 monit                    - Monitor resources"
echo "  ./deploy.sh                  - Deploy updates"
echo "=========================================="

