#!/bin/bash
# MWG Hostels Backend - Quick Deploy Script
# This deploys the backend to Railway

echo "🚀 Starting MWG Hostels Backend Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend
cd backend

# Login to Railway
echo "🔑 Logging into Railway..."
railway login

# Link project
echo "🔗 Linking to Railway project..."
railway link

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set MONGODB_URI="mongodb+srv://mwgadmin:%40Qwerty_12345@cluster0.n8satkn.mongodb.net/mwg-hostels?retryWrites=true&w=majority&appName=Cluster0"
railway variables set JWT_SECRET="mwg-super-secret-key-change-in-production-2024"
railway variables set CLOUDINARY_CLOUD_NAME="dsu1po0tg"
railway variables set CLOUDINARY_API_KEY="544812825552175"
railway variables set CLOUDINARY_API_SECRET="TBeMJkwQ-Nd_Ybtg2H9YHlZa2vo"

# Deploy
echo "📦 Deploying to Railway..."
git push

echo "✅ Deployment initiated! Check Railway dashboard for status."
echo "🌐 Backend will be available at: https://sama-production-9e28.up.railway.app/api"
