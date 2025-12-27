# Complete Setup & Deployment Guide

## Project Overview

Tesla Investment Platform with:
- User Registration & Authentication
- Email Verification
- KYC (Know Your Customer) System
- Admin Dashboard for KYC Management
- Analytics & User Management

## Architecture

```
Frontend (Next.js 16)
├── Pages: /admin, /login, /register, /
├── Components: Auth, Admin Dashboard, KYC Form
├── API Routes: /api/auth/*, /api/admin/*, /api/kyc/*
└── Environment: NEXT_PUBLIC_API_URL

Backend (External Render Service)
├── API: https://tesla-backend-ipk1.onrender.com
├── Auth: Register, Login, Email Verification
├── KYC: Submit, Approve, Reject
├── Database: JSON file (db.json)
└── File Storage: /public/uploads/
```

## Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

### Setup

```bash
# 1. Clone/extract project
cd tesla-investment-platform

# 2. Install dependencies
npm install

# 3. Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://tesla-backend-ipk1.onrender.com
JWT_SECRET=your-secure-secret-key-change-in-production
EOF

# 4. Start development server
npm run dev

# 5. Open browser
# Main app: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### First Time Usage

**Register a User:**
1. Go to http://localhost:3000
2. Click "Register" or "Join Us"
3. Fill in form (use real email for testing)
4. Submit registration
5. Check backend logs for verification token
6. Use token to verify email (if email service not configured)

**Access Admin Panel:**
1. Go to http://localhost:3000/admin
2. Login with demo credentials:
   - Email: `admin@example.com`
   - Password: `password123`

## Environment Variables

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://tesla-backend-ipk1.onrender.com

# Authentication
JWT_SECRET=your-secure-secret-key-change-in-production

# Optional: Enable debug logs
DEBUG=tesla:*
```

### Backend (server environment)
```env
# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-secure-secret-key-change-in-production
JWT_EXPIRY=7d

# Email (if configured)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000,https://your-domain.com
```

## File Structure

```
project-root/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── verify-email/route.ts
│   │   │   └── me/route.ts
│   │   ├── admin/
│   │   │   ├── login/route.ts
│   │   │   ├── users/route.ts
│   │   │   ├── kyc-requests/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   └── dashboard/route.ts
│   │   └── kyc/
│   │       └── submit/route.ts
│   ├── admin/
│   │   └── page.tsx (Admin dashboard)
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-dashboard.tsx
│   │   │   ├── admin-login.tsx
│   │   │   ├── admin-users.tsx
│   │   │   ├── admin-kyc.tsx
│   │   │   └── admin-analytics.tsx
│   │   └── ...other components
│   ├── hooks/
│   │   └── use-auth.ts
│   ├── lib/
│   │   ├── api-client.ts
│   │   └── auth-storage.ts
│   ├── types.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
│   └── uploads/ (KYC documents stored here)
├── server.mjs (Backend Express server)
├── data/
│   └── db.json (Database file)
├── package.json
├── tsconfig.json
├── next.config.mjs
├── .env.local (create locally)
└── .gitignore
```

## Deployment Steps

### 1. Deploy Backend (if self-hosted)

**Option A: Deploy to Render**
```bash
# Already deployed at:
# https://tesla-backend-ipk1.onrender.com

# To deploy your own:
# 1. Create account at render.com
# 2. Create new Web Service
# 3. Connect GitHub repo
# 4. Set build command: npm install
# 5. Set start command: node server.mjs
# 6. Add environment variables
# 7. Deploy
```

**Option B: Deploy to Railway/Heroku/DigitalOcean**
```bash
# Follow platform-specific instructions
# Key requirements:
# - Node.js runtime
# - Port from environment variable
# - Persistent file storage for uploads
```

### 2. Deploy Frontend to Vercel

**Option A: Using Git (Recommended)**
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Connect GitHub account
# 4. Import project
# 5. Add environment variables:
#    NEXT_PUBLIC_API_URL=https://your-backend-url.com
# 6. Deploy
```

**Option B: Using Vercel CLI**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Set environment variables when prompted
# 4. Deployment complete!
```

### 3. Configure Admin Credentials

**Before going live, change these credentials:**

In your backend code, update:
```javascript
// server.mjs - Line ~400
if (email === "admin@example.com" && password === "password123") {
  // Change to:
  if (email === "your-secure-email@domain.com" && password === "your-secure-password") {
```

Or better, use environment variables:
```javascript
if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
```

## Running on Different Platforms

### Windows
```bash
# Install Node.js from nodejs.org
# Open PowerShell or CMD
npm install
npm run dev
```

### Mac
```bash
# Install Node.js
brew install node

# Install dependencies and run
npm install
npm run dev
```

### Linux/Ubuntu
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies and run
npm install
npm run dev
```

## Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t tesla-platform .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend-url.com \
  tesla-platform
```

## Database Migration (if switching from JSON to SQL)

```javascript
// If you want to migrate to PostgreSQL/MySQL
// 1. Create new database
// 2. Run migration script
// 3. Update connection string
// 4. Test thoroughly before going live

// Current setup uses JSON file which is fine for <10k users
// For larger scale, migrate to proper database
```

## Monitoring & Maintenance

### Monitor Application
```bash
# Check if frontend is up
curl https://your-domain.com

# Check if admin panel is up
curl https://your-domain.com/admin

# Check backend health
curl https://your-backend-url.com/health
```

### View Logs

**Vercel Logs:**
```bash
vercel logs
```

**Backend Logs (if using Render):**
```
# Visit dashboard.render.com → Select Service → Logs
```

### Backup Data
```bash
# Backup database file regularly
cp data/db.json data/db.json.backup.$(date +%Y%m%d)

# Backup uploaded documents
tar -czf uploads.backup.$(date +%Y%m%d).tar.gz public/uploads/
```

## Troubleshooting Deployment

### Issue: Build Fails on Vercel
**Solutions:**
1. Check build logs: `vercel logs`
2. Ensure all dependencies are in package.json
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Clear build cache: `vercel env pull && npm ci`

### Issue: API Calls Return 404
**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running and accessible
3. Test backend health: `curl backend-url/health`
4. Check CORS configuration

### Issue: Admin Panel Returns 401
**Solutions:**
1. Verify admin credentials
2. Check JWT_SECRET matches between frontend/backend
3. Check token expiration
4. Clear browser cache and try again

### Issue: File Uploads Not Working
**Solutions:**
1. Check upload directory exists: `mkdir -p public/uploads`
2. Verify directory permissions: `chmod 755 public/uploads`
3. Check file size limit in multer config
4. Check disk space available

## Performance Optimization

### Frontend
```javascript
// Enable image optimization
// Use Next.js Image component
import Image from "next/image"

// Enable compression
gzip: true
```

### Backend
```javascript
// Add caching headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600')
  next()
})

// Add compression
const compression = require('compression')
app.use(compression())
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET (use `openssl rand -base64 32`)
- [ ] Enable HTTPS/SSL certificate
- [ ] Implement rate limiting on login endpoints
- [ ] Add input validation on all endpoints
- [ ] Sanitize user inputs to prevent injection
- [ ] Store sensitive data in environment variables
- [ ] Use CORS whitelist for your domain only
- [ ] Implement request logging/monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated: `npm audit fix`

## Post-Deployment Checklist

- [ ] Frontend is accessible at your domain
- [ ] Admin panel works with new credentials
- [ ] User registration flows complete
- [ ] Email verification works
- [ ] KYC submission works
- [ ] Admin can approve/reject KYC
- [ ] All analytics load correctly
- [ ] Performance is acceptable
- [ ] No console errors in browser
- [ ] Database backups are in place
- [ ] Monitoring is set up
- [ ] Error logging is configured

## Support & Documentation

- Main app: `/` (landing page with registration)
- Admin panel: `/admin` (user and KYC management)
- API docs: See code comments in `/app/api/` folders
- Debug logs: Open browser console (F12) and search for `[v0]`

## Next Steps

1. Deploy backend if needed
2. Deploy frontend to Vercel
3. Configure admin credentials
4. Test all features
5. Monitor logs and performance
6. Regular backups and updates

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Maintainer:** Your Team Name
