# ✅ VPS Deployment Checklist

## Pre-Deployment

- [ ] Repository pushed to GitHub/GitLab
- [ ] All environment variables documented
- [ ] Database schema files in `scripts/` folder
- [ ] `.gitignore` configured correctly
- [ ] Scripts have correct permissions (chmod +x)

## Server Requirements

- [ ] Ubuntu/Debian Linux VPS
- [ ] Root or sudo access
- [ ] Node.js 18+ installed
- [ ] MySQL/MariaDB 8.0+ installed
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Git installed
- [ ] Nginx installed (for production)
- [ ] Domain pointed to server IP (optional)

## Initial Setup Steps

1. [ ] SSH to server
   ```bash
   ssh explorekarawang@your-server-ip
   ```

2. [ ] Clone repository
   ```bash
   cd ~
   git clone https://github.com/yourusername/explore-karawang.git htdocs
   cd htdocs
   ```

3. [ ] Make scripts executable
   ```bash
   chmod +x setup-server.sh deploy.sh
   ```

4. [ ] Run setup script
   ```bash
   ./setup-server.sh
   ```

5. [ ] Configure `.env.local`
   ```bash
   nano .env.local
   ```
   - [ ] Set MYSQL_HOST
   - [ ] Set MYSQL_USER
   - [ ] Set MYSQL_PASSWORD
   - [ ] Set MYSQL_DATABASE

6. [ ] Create MySQL database
   ```bash
   mysql -u root -p
   CREATE DATABASE karawang;
   CREATE USER 'explorekarawang'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON karawang.* TO 'explorekarawang'@'localhost';
   EXIT;
   ```

7. [ ] Run all SQL migrations
   ```bash
   mysql -u root -p karawang < scripts/01-create-mysql-tables.sql
   mysql -u root -p karawang < scripts/02-auth-mysql-tables.sql
   mysql -u root -p karawang < scripts/03-seed-admin-user.sql
   mysql -u root -p karawang < scripts/05-create-carousel-table.sql
   mysql -u root -p karawang < scripts/06-create-categories-table.sql
   mysql -u root -p karawang < scripts/07-add-facilities-management.sql
   ```

8. [ ] Install dependencies
   ```bash
   npm ci --legacy-peer-deps
   ```

9. [ ] Build application
   ```bash
   npm run build
   ```

10. [ ] Create necessary directories
    ```bash
    mkdir -p logs public/uploads
    chmod -R 777 public/uploads
    ```

11. [ ] Start with PM2
    ```bash
    pm2 start ecosystem.config.js
    pm2 save
    ```

12. [ ] Setup PM2 startup
    ```bash
    pm2 startup
    # Run the command suggested by PM2
    ```

## Nginx Configuration (Production)

13. [ ] Create Nginx config
    ```bash
    sudo nano /etc/nginx/sites-available/explorekarawang
    ```

14. [ ] Enable site
    ```bash
    sudo ln -s /etc/nginx/sites-available/explorekarawang /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

15. [ ] Setup SSL (Let's Encrypt)
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

## Security

16. [ ] Change default admin password
17. [ ] Update MySQL password from default
18. [ ] Enable firewall
    ```bash
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw enable
    ```

## Testing

19. [ ] Test application locally: `http://server-ip:3000`
20. [ ] Test with domain: `http://yourdomain.com`
21. [ ] Test HTTPS: `https://yourdomain.com`
22. [ ] Test admin login
23. [ ] Test image upload
24. [ ] Test all CRUD operations
25. [ ] Check mobile responsiveness

## Monitoring

26. [ ] Setup PM2 monitoring
    ```bash
    pm2 monit
    ```

27. [ ] Setup log rotation
    ```bash
    pm2 install pm2-logrotate
    ```

28. [ ] Test logs
    ```bash
    pm2 logs explore-karawang
    ```

## Backup

29. [ ] Setup database backup cron job
30. [ ] Backup uploads directory
31. [ ] Document backup procedure

## Documentation

32. [ ] Update README with live URL
33. [ ] Document any custom configurations
34. [ ] Share credentials securely with team

## Post-Deployment

35. [ ] Monitor error logs for first 24 hours
36. [ ] Test all features in production
37. [ ] Update DNS if needed
38. [ ] Announce launch! 🎉

---

## Quick Commands Reference

```bash
# View logs
pm2 logs explore-karawang

# Restart
pm2 restart explore-karawang

# Status
pm2 status

# Deploy updates
./deploy.sh

# Backup database
mysqldump -u explorekarawang -p karawang > backup.sql

# Check disk space
df -h

# Check memory
free -h

# Monitor resources
pm2 monit
```

---

## Troubleshooting

If something goes wrong:

1. Check PM2 logs: `pm2 logs explore-karawang --err`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check database connection: `mysql -u explorekarawang -p`
4. Verify environment variables: `cat .env.local`
5. Check disk space: `df -h`
6. Check memory: `free -h`

---

**Need Help?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
