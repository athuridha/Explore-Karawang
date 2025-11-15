# 🚀 Quick Deployment Guide

## For First Time Setup

1. **SSH to your server**
   ```bash
   ssh explorekarawang@your-server-ip
   ```

2. **Clone repository**
   ```bash
   cd ~
   git clone https://github.com/athuridha/Explore-Karawang.git htdocs
   cd htdocs
   ```

3. **Run setup script**
   ```bash
   chmod +x setup-server.sh
   ./setup-server.sh
   ```

4. **Configure database credentials**
   ```bash
   nano .env.local
   ```
   Update with your MySQL password

5. **Setup database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE karawang;
   CREATE USER 'explorekarawang'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON karawang.* TO 'explorekarawang'@'localhost';
   EXIT;
   ```

6. **Run migrations**
   ```bash
   mysql -u root -p karawang < scripts/01-create-mysql-tables.sql
   mysql -u root -p karawang < scripts/02-auth-mysql-tables.sql
   mysql -u root -p karawang < scripts/03-seed-admin-user.sql
   mysql -u root -p karawang < scripts/05-create-carousel-table.sql
   mysql -u root -p karawang < scripts/06-create-categories-table.sql
   mysql -u root -p karawang < scripts/07-add-facilities-management.sql
   ```

7. **Done!** Your app is running at `http://your-server-ip:3000`

---

## For Updates

Just run:
```bash
cd ~/htdocs
./deploy.sh
```

---

## Common Commands

```bash
pm2 logs explore-karawang    # View logs
pm2 restart explore-karawang # Restart app
pm2 status                   # Check status
pm2 monit                    # Monitor resources
```

---

## Default Admin Login

- **Email**: admin@explorekarawang.com
- **Password**: admin123

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

---

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)
