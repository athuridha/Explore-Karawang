# 🚀 Explore Karawang - Deployment Guide

## Prerequisites
- VPS with Ubuntu/Debian Linux
- Node.js 18+ installed
- MySQL/MariaDB installed and running
- PM2 installed globally: `npm install -g pm2`
- Nginx installed (optional, for production)
- Git installed and configured

---

## 🔧 Initial Server Setup (Run Once)

### 1. Connect to Your VPS

```bash
ssh explorekarawang@your-server-ip
cd ~
```

### 2. Clone Repository

```bash
cd ~
git clone https://github.com/yourusername/explore-karawang.git htdocs
cd htdocs
```

### 3. Run Setup Script

```bash
chmod +x setup-server.sh
./setup-server.sh
```

This script will:
- Fix directory permissions
- Install dependencies
- Create necessary directories (logs, uploads)
- Build the application
- Setup PM2

### 4. Configure Environment Variables

Edit the `.env.local` file with your database credentials:

```bash
nano .env.local
```

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=explorekarawang
MYSQL_PASSWORD=your_secure_password_here
MYSQL_DATABASE=karawang
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 5. Setup MySQL Database

Create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE karawang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'explorekarawang'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON karawang.* TO 'explorekarawang'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Run the SQL migration scripts:

```bash
cd ~/htdocs
mysql -u root -p karawang < scripts/01-create-mysql-tables.sql
mysql -u root -p karawang < scripts/02-auth-mysql-tables.sql
mysql -u root -p karawang < scripts/03-seed-admin-user.sql
mysql -u root -p karawang < scripts/05-create-carousel-table.sql
mysql -u root -p karawang < scripts/06-create-categories-table.sql
mysql -u root -p karawang < scripts/07-add-facilities-management.sql
```

### 6. Setup Upload Directory Permissions

```bash
mkdir -p ~/htdocs/public/uploads
chmod -R 777 ~/htdocs/public/uploads
```

### 7. Start Application

```bash
cd ~/htdocs
pm2 start ecosystem.config.js
pm2 save
```

Setup PM2 to start on system boot:

```bash
pm2 startup
# Copy and run the command that PM2 suggests
```

---

## 🔄 Deploying Updates

After making changes to your code and pushing to Git:

```bash
ssh explorekarawang@your-server-ip
cd ~/htdocs
./deploy.sh
```

The `deploy.sh` script will:
1. Pull latest code from Git
2. Install/update dependencies
3. Build the application
4. Restart PM2 process

---

## 🌐 Setup Nginx Reverse Proxy (Production)

### 1. Install Nginx (if not already installed)

```bash
sudo apt update
sudo apt install nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/explorekarawang
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name explorekarawang.com www.explorekarawang.com;

    # Max upload size
    client_max_body_size 10M;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000/_next/static;
        proxy_cache_valid 30d;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Public uploads
    location /uploads {
        proxy_pass http://localhost:3000/uploads;
        proxy_cache_valid 7d;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

### 3. Enable Site and Test

```bash
sudo ln -s /etc/nginx/sites-available/explorekarawang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d explorekarawang.com -d www.explorekarawang.com
```

Follow the prompts. Certbot will automatically configure SSL and update your Nginx config.

---

## 📊 Monitoring & Management

### View Logs

```bash
# Real-time logs
pm2 logs explore-karawang

# View error logs
pm2 logs explore-karawang --err

# View output logs
pm2 logs explore-karawang --out

# View last 100 lines
pm2 logs explore-karawang --lines 100
```

### Check Status

```bash
pm2 status
pm2 monit
```

### Restart Application

```bash
pm2 restart explore-karawang
```

### Stop Application

```bash
pm2 stop explore-karawang
```

### Delete from PM2

```bash
pm2 delete explore-karawang
```

---

## 🔧 Troubleshooting

### Permission Denied Errors

```bash
sudo chown -R explorekarawang:explorekarawang ~/htdocs
chmod -R 755 ~/htdocs
chmod -R 777 ~/htdocs/public/uploads
```

### Port 3000 Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Restart PM2
pm2 restart explore-karawang
```

### MySQL Connection Error

1. Check MySQL is running:
```bash
sudo systemctl status mysql
```

2. Verify credentials in `.env.local`
```bash
cat ~/htdocs/.env.local
```

3. Test MySQL connection:
```bash
mysql -u explorekarawang -p karawang
```

### Out of Memory During Build

Increase Node.js memory:

```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

Or add swap space:

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

Make swap permanent:
```bash
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstag
```

### Build Fails

1. Clear Next.js cache:
```bash
rm -rf ~/htdocs/.next
```

2. Reinstall dependencies:
```bash
rm -rf ~/htdocs/node_modules ~/htdocs/package-lock.json
npm install --legacy-peer-deps
```

3. Rebuild:
```bash
npm run build
```

### Cannot Upload Images

Check upload directory permissions:
```bash
ls -la ~/htdocs/public/uploads
chmod -R 777 ~/htdocs/public/uploads
```

---

## 🔐 Security Recommendations

1. **Change default admin password** after first login
2. **Use strong MySQL passwords**
3. **Keep Node.js and dependencies updated**
4. **Enable firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```
5. **Setup regular backups** of database and uploads
6. **Use SSL/HTTPS** in production (Let's Encrypt)

---

## 📦 Backup & Restore

### Backup Database

```bash
mysqldump -u explorekarawang -p karawang > backup-$(date +%Y%m%d-%H%M%S).sql
```

### Backup Uploads

```bash
tar -czf uploads-backup-$(date +%Y%m%d-%H%M%S).tar.gz ~/htdocs/public/uploads
```

### Restore Database

```bash
mysql -u explorekarawang -p karawang < backup-20241116-120000.sql
```

### Restore Uploads

```bash
tar -xzf uploads-backup-20241116-120000.tar.gz -C ~/htdocs/public/
```

---

## 📝 Log Rotation

PM2 handles log rotation automatically. To configure:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

---

## 🆘 Support

For issues:
1. Check logs: `pm2 logs explore-karawang`
2. Check PM2 status: `pm2 status`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Check system resources: `htop` or `pm2 monit`
