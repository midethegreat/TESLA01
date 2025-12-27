# Tesla Investment Platform - Deployment Guide

This guide explains how to deploy both the frontend and backend of your Tesla Investment Platform.

## Overview

Your application consists of:
- **Frontend**: Next.js application (React with TypeScript)
- **Backend**: Express.js REST API server

## Part 1: Deploy Backend to Render (FREE)

Render.com offers a generous free tier perfect for Express backends.

### Step 1: Prepare Your Repository

1. Ensure your project is on GitHub
2. Make sure all code is committed and pushed
3. Verify `package.json` has the correct start script: `"start": "node server.mjs"`

### Step 2: Set Up Render

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (click "GitHub" button)
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Click "Connect"

### Step 3: Configure the Web Service

In the deployment form, fill in:

- **Name**: `tesla-backend` (or your preferred name)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Select `Free` (free tier)

### Step 4: Add Environment Variables

1. Scroll down to **Environment Variables** section
2. Add these variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `JWT_SECRET` | Generate a secure random string (e.g., use [generate-random.org](https://www.random.org/strings/)) - minimum 32 characters |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Leave blank for now - you'll update after Vercel deployment |

**Important**: Do NOT use the default JWT_SECRET in production. Generate a secure one.

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will build and deploy automatically (2-5 minutes)
3. Once deployment completes, you'll see a green checkmark
4. Copy your backend URL from the top (looks like: `https://tesla-backend-xxxx.onrender.com`)

⚠️ **Free tier note**: Render's free tier spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds. For production, upgrade to paid tier.

## Part 2: Deploy Frontend to Vercel (FREE)

### Step 1: Connect Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select and import your GitHub repository
5. Framework will auto-detect as "Next.js"

### Step 2: Configure Environment Variables

1. In the "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Paste your Render backend URL (e.g., `https://tesla-backend-xxxx.onrender.com`) |

The variable must start with `NEXT_PUBLIC_` to be accessible in the browser.

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy automatically (1-2 minutes)
3. You'll get a URL like `https://your-app-name.vercel.app`

## Part 3: Update Backend Configuration

Now that your frontend is deployed, update the backend to allow only your frontend domain:

1. Go back to Render dashboard
2. Click on your `tesla-backend` service
3. Go to **Environment** tab
4. Edit `FRONTEND_URL` and set it to your Vercel URL:
   \`\`\`
   https://your-app-name.vercel.app
   \`\`\`
5. Click "Save Changes" - this will trigger a redeployment

## Part 4: Verify Communication

Once both are deployed:

1. **Open your app**: Visit your Vercel URL in a browser
2. **Test registration**: Create a new account
3. **Check backend logs**: 
   - Go to Render dashboard → select `tesla-backend`
   - Click "Logs" tab to see if requests are being received
4. **Test login**: Log in with the account you just created

If everything works, you should see API requests in the Render logs.

## Troubleshooting

### "Failed to connect to server" or "Network Error"

**Check these:**

1. Backend URL is correct in `NEXT_PUBLIC_API_URL` on Vercel
2. Backend is deployed and running on Render (check status)
3. URL includes `https://` (not `http://`)
4. Wait 30 seconds if it's the first request to a free tier backend (it spins up)

**Debug:**
1. Open your Vercel app in browser
2. Open DevTools → Network tab
3. Try to register/login
4. Look for failed API requests
5. Check the exact URL it's trying to reach

### "Connection Refused" or "Backend is Down"

1. Go to your Render dashboard
2. Check if the service shows a green checkmark (deployed)
3. If not, check the "Build" logs for errors
4. Verify start command is `npm start`

### "CORS Error"

This means backend is blocking your frontend domain.

1. Check that `FRONTEND_URL` is set correctly on Render
2. Go to `server.ts` and verify CORS middleware is present
3. Redeploy backend after changing `FRONTEND_URL`

### First Request is Slow

Free tier backends spin down after 15 minutes of inactivity. First request wakes them up (~30 seconds). This is normal for free tier.

## Updating Your App

### Update Backend

1. Make changes to your code
2. Commit and push to GitHub
3. Render automatically redeploys when you push (if configured with GitHub integration)

### Update Frontend

1. Make changes to your code
2. Commit and push to GitHub
3. Vercel automatically redeploys when you push

## Upgrading from Free Tier

### Render Backend Upgrade

- Free: $0/month (spins down after 15 minutes)
- Starter: $7/month (always running)

To upgrade: Go to Render dashboard → Pricing tab

### Vercel Frontend Upgrade

- Free: $0/month (sufficient for most apps)
- Pro: $20/month (more advanced features)

Vercel free tier is excellent and rarely needs upgrade unless you need advanced features.

## Database Persistence

Currently, the backend uses a JSON file (`data/db.json`) for data storage. This works but:

- Data is lost when Render restarts
- Not suitable for concurrent users

### Add Render PostgreSQL (FREE)

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Select free tier database
3. Get connection string
4. Update backend to use PostgreSQL

### Or Use Supabase (FREE PostgreSQL)

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project (free tier available)
3. Get PostgreSQL connection string from Settings
4. Update backend database code

## Security Checklist

- [ ] Use a secure JWT_SECRET (minimum 32 characters, random)
- [ ] Set `FRONTEND_URL` to your actual Vercel domain
- [ ] Use HTTPS URLs only
- [ ] Do not commit environment variables to GitHub
- [ ] Review CORS settings in `server.ts`
- [ ] Plan database migration for production

## Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Add Vercel URL to Render's `FRONTEND_URL`
4. Test end-to-end flow (register, login, etc.)
5. Monitor logs for any issues
6. Plan database migration if needed
7. Upgrade to paid tiers when ready

## Support

- **Render issues**: Check Render docs at [docs.render.com](https://docs.render.com)
- **Vercel issues**: Check Vercel docs at [vercel.com/docs](https://vercel.com/docs)
- **CORS issues**: Check browser DevTools → Network tab for actual requests
- **Backend logs**: Check Render dashboard → Logs for debugging
\`\`\`

Now I'll create a quick deployment summary:
