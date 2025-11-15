# 🌍 Explore Karawang

A modern web application to discover tourist destinations and culinary spots in Karawang, Indonesia. Built with Next.js 14, TypeScript, and MySQL.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## ✨ Features

- 🏞️ **Tourist Destinations** - Discover nature, historical, and recreational spots
- 🍜 **Culinary Guide** - Explore traditional and modern restaurants
- 🎨 **Admin Dashboard** - Manage content with an intuitive interface
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Authentication** - Secure admin login system
- 🖼️ **Image Upload** - Easy image management for destinations and culinary
- 🗺️ **Google Maps Integration** - Direct links to locations
- 🎯 **Category Management** - Organize content by categories
- ⭐ **Ratings & Reviews** - Display ratings for destinations and restaurants

## 🚀 Quick Start (Development)

### Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/athuridha/Explore-Karawang.git
   cd Explore-Karawang
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Setup database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE karawang;
   EXIT;
   
   # Run migrations
   mysql -u root -p karawang < scripts/01-create-mysql-tables.sql
   mysql -u root -p karawang < scripts/02-auth-mysql-tables.sql
   mysql -u root -p karawang < scripts/03-seed-admin-user.sql
   mysql -u root -p karawang < scripts/05-create-carousel-table.sql
   mysql -u root -p karawang < scripts/06-create-categories-table.sql
   mysql -u root -p karawang < scripts/07-add-facilities-management.sql
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=karawang
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

### Default Admin Login

- **Email**: admin@explorekarawang.com
- **Password**: admin123

**⚠️ Change this password immediately!**

## 📦 Production Deployment

### Deploy to VPS

See detailed guides:
- [QUICK-START.md](./QUICK-START.md) - Quick deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment documentation

**Quick commands:**

```bash
# First time setup
./setup-server.sh

# Deploy updates
./deploy.sh
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Radix UI** - Accessible component primitives

### Backend
- **Next.js API Routes** - Serverless functions
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing

### Deployment
- **PM2** - Process manager
- **Nginx** - Reverse proxy
- **Let's Encrypt** - SSL certificates

## 📁 Project Structure

```
explore-karawang/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── culinary/          # Culinary pages
│   └── destinations/      # Destinations pages
├── components/            # React components
│   ├── admin/            # Admin components
│   └── ui/               # UI components (shadcn)
├── lib/                   # Utilities
│   ├── mysql.ts          # Database connection
│   ├── auth.ts           # Authentication
│   └── utils.ts          # Helper functions
├── public/               # Static files
│   └── uploads/          # User uploads
├── scripts/              # Database migrations
├── types/                # TypeScript types
├── ecosystem.config.js   # PM2 configuration
├── deploy.sh            # Deployment script
└── setup-server.sh      # Initial setup script
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run start            # Start production server

# PM2 (Production)
npm run pm2:start        # Start with PM2
npm run pm2:stop         # Stop PM2 process
npm run pm2:restart      # Restart PM2 process
npm run pm2:logs         # View PM2 logs
npm run pm2:status       # Check PM2 status

# Linting
npm run lint             # Run ESLint
```

## 🗄️ Database Schema

### Main Tables
- `destinations` - Tourist destinations
- `culinary` - Restaurants and food spots
- `categories` - Categories for destinations/culinary
- `carousel` - Homepage carousel images
- `facilities` - Facilities management
- `users` - Admin users

See SQL files in `scripts/` for detailed schema.

## 🔐 Environment Variables

```env
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=karawang
```

## 📸 Screenshots

> Add screenshots of your application here

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - [GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Karawang tourism board for inspiration

## 📞 Support

For support, email support@explorekarawang.com or open an issue on GitHub.

---

Made with ❤️ in Karawang, Indonesia

# Explore-Karawang
