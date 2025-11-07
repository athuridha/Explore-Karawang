# 🚀 Explore Karawang - Deployment Guide

## Prerequisites
- Node.js 18+ installed
- PM2 installed globally: `npm install -g pm2`
- Git configured

## Step 1: SSH ke Server

```bash
ssh explorekarawang@amar-db
cd ~/htdocs
```

## Step 2: Fix Permissions

```bash
# Fix directory permissions
sudo chown -R explorekarawang:explorekarawang ~/htdocs
sudo chmod -R 755 ~/htdocs
mkdir -p ~/.next ~/.pm2
chmod -R 755 ~/.next ~/.pm2
```

## Step 3: Setup Initial Installation

```bash
# Clone atau update repo
git clone <repo-url> . # jika pertama kali
# atau
git pull origin main # jika sudah ada

# Install dependencies
npm ci --legacy-peer-deps

# Build aplikasi
npm run build
```

## Step 4: Setup Environment Variables

Buat file `.env.local`:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=explore_karawang

# API
NEXT_PUBLIC_API_URL=https://explorekarawang.com

# Upload
NEXT_PUBLIC_UPLOAD_DIR=/public/uploads
```

## Step 5: Create Upload Directory

```bash
mkdir -p ~/htdocs/public/uploads
chmod -R 777 ~/htdocs/public/uploads
```

## Step 6: Start dengan PM2

```bash
# Start
pm2 start ecosystem.config.js

# Setup startup on reboot
pm2 startup
pm2 save

# Monitor logs
pm2 logs explore-karawang

# Show status
pm2 status
```

## Step 7: Setup Reverse Proxy (Nginx)

```bash
sudo nano /etc/nginx/sites-available/explorekarawang
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name explorekarawang.com www.explorekarawang.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static files
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_cache_valid 30d;
        expires 30d;
    }

    # Public uploads
    location /uploads {
        proxy_pass http://localhost:3000/uploads;
        proxy_cache_valid 7d;
        expires 7d;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/explorekarawang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Setup SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d explorekarawang.com -d www.explorekarawang.com
```

## Troubleshooting

### Permission Denied di /home
```bash
sudo chown -R explorekarawang:explorekarawang /home/explorekarawang
```

### Out of Memory
```bash
# Increase swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Cannot find module
```bash
rm -rf node_modules package-lock.json
npm ci --legacy-peer-deps
```

### Database Connection Error
```bash
# Verify MySQL is running
sudo systemctl status mysql

# Check credentials in .env.local
cat .env.local
```

## Daily Operations

```bash
# View logs
pm2 logs explore-karawang

# Restart app
pm2 restart explore-karawang

# Deploy new version
cd ~/htdocs
git pull origin main
npm ci --legacy-peer-deps
npm run build
pm2 restart explore-karawang

# Backup database
mysqldump -u root -p explore_karawang > backup-$(date +%Y%m%d).sql

# View PM2 status
pm2 status
pm2 monit
```

## Monitoring

Monitor resource usage:
```bash
pm2 monit
```

View full logs:
```bash
pm2 logs explore-karawang --err
pm2 logs explore-karawang --out
```

Setup log rotation:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
```
