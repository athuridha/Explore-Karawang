#!/bin/bash

# Explore Karawang Deployment Script
# Run this script on the server after pushing changes

set -e

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main || {
  echo "⚠️  Git pull failed or already up to date"
}

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Build the application
echo "🔨 Building Next.js application..."
npm run build

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p public/uploads
chmod -R 755 public/uploads

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
if pm2 describe explore-karawang > /dev/null 2>&1; then
  pm2 restart explore-karawang
else
  echo "🚀 Starting new PM2 process..."
  pm2 start ecosystem.config.js
  pm2 save
fi

# Wait for app to start
echo "⏳ Waiting for application to start..."
sleep 3

# Show status
echo "📊 Application status:"
pm2 status explore-karawang

echo ""
echo "✅ Deployment complete!"
echo "📍 Application is running on port 3000"
echo ""
echo "Useful commands:"
echo "  pm2 logs explore-karawang    - View logs"
echo "  pm2 restart explore-karawang - Restart app"
echo "  pm2 monit                    - Monitor resources"

