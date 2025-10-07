# MWG Hostels Backend Deployment Guide

## 🚀 Quick Deploy to Heroku

### Prerequisites
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create Heroku account: https://signup.heroku.com/

### Deployment Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create new Heroku app
heroku create mwg-hostels-api

# 3. Add MongoDB Atlas addon
heroku addons:create mongolab:sandbox

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret_here
heroku config:set JWT_REFRESH_SECRET=your_production_refresh_secret_here
heroku config:set EMAIL_USERNAME=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password

# 5. Deploy backend folder
git subtree push --prefix backend heroku main

# 6. Open your API
heroku open
```

## 🌐 Alternative Deployment Options

### Railway.app
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up
```

### Render.com
1. Connect your GitHub repository
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in dashboard

### DigitalOcean App Platform
1. Connect GitHub repository
2. Select backend folder
3. Configure environment variables
4. Deploy automatically

## 📊 Production Monitoring

### Health Checks
- Endpoint: `/api/health`
- Status monitoring
- Uptime tracking

### Logging
- Morgan HTTP logging
- Error tracking
- Performance monitoring

### Security
- Helmet.js protection
- CORS configuration
- Rate limiting
- Input validation

## 🔧 Post-Deployment

1. **Update Frontend API URL**
   - Replace `https://mwg-hostels-api.herokuapp.com/api` with your actual backend URL
   - Test all API endpoints

2. **Configure MongoDB Atlas**
   - Create production database
   - Set up proper user permissions
   - Configure network access

3. **Set up Email Service**
   - Configure Gmail App Password or use SendGrid
   - Test email verification flow

4. **Domain Configuration**
   - Optional: Add custom domain to Heroku
   - Update CORS origins

## 📈 Scaling Considerations

- **Database**: Upgrade MongoDB plan as users grow
- **Hosting**: Scale Heroku dynos based on traffic
- **CDN**: Add Cloudflare for global performance
- **Monitoring**: Implement error tracking (Sentry)
- **Caching**: Add Redis for session management