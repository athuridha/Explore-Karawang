#!/bin/bash

# Explore Karawang Deployment Script

set -e

echo "🚀 Starting deployment..."

# Stop existing process
echo "⏹️  Stopping existing PM2 process..."
pm2 stop explore-karawang 2>/dev/null || true

# Update code
echo "📥 Pulling latest code..."
git pull origin main || true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci 

# Build
echo "🔨 Building Next.js app..."
npm run build

# Create logs directory if it doesn't exist
mkdir -p ~/logs

# Start with PM2
echo "🚀 Starting with PM2..."
pm2 start ecosystem.config.js --no-daemon &

# Wait a bit
sleep 2

# Show status
pm2 status explore-karawang

echo "✅ Deployment complete!"
echo "📍 App running at http://localhost:3000"
