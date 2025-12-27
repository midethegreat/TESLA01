# Quick Deployment Instructions

## What You Need to Do

### 1. Deploy Backend to Render (5 minutes) - FREE

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository and connect it
5. Fill in the form:
   - **Name**: `tesla-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Add environment variables:
   - `JWT_SECRET` = (generate a secure random string, 32+ characters)
   - `NODE_ENV` = `production`
7. Click "Create Web Service"
8. Wait for deployment (2-5 minutes) - you'll see a green checkmark
9. Copy your Render backend URL (e.g., `https://tesla-backend-xxxx.onrender.com`)

### 2. Deploy Frontend to Vercel (5 minutes) - FREE

1. Go to [vercel.com](https://vercel.com)  
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select and import your GitHub repository
5. In Environment Variables, add:
   - `NEXT_PUBLIC_API_URL` = `https://tesla-backend-xxxx.onrender.com` (your Render URL)
6. Click "Deploy"
7. Wait for deployment (1-2 minutes)
8. Your frontend URL will be something like `https://your-app.vercel.app`

### 3. Update Backend to Allow Your Frontend

1. Go back to Render dashboard
2. Click your `tesla-backend` service
3. Go to "Environment" tab
4. Add/update `FRONTEND_URL`:
   - `FRONTEND_URL` = `https://your-app.vercel.app` (your Vercel URL)
5. Click "Save Changes" - this triggers a redeploy

### 4. Test Communication

1. Open your Vercel frontend URL
2. Try registering an account
3. Check the Render logs to see requests coming in
4. Verify you can log in

That's it! Your app is live with frontend and backend communicating.

## Important Notes

- **NEXT_PUBLIC_API_URL** must point to your Render backend URL
- **JWT_SECRET** should be a long random string (use [random.org](https://www.random.org/strings/) or similar)
- The frontend can be accessed at your Vercel URL
- The backend API is accessed by the frontend (not directly by you)
- **Free tier note**: Render spins down backends after 15 minutes of inactivity. First request takes ~30 seconds. This is normal.

## Environment Variables Summary

### Backend (on Render)
\`\`\`
PORT=5000
JWT_SECRET=your-super-secret-key-that-is-at-least-32-characters-long
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
\`\`\`

### Frontend (on Vercel)
\`\`\`
NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com
\`\`\`

## Updating After Initial Deploy

If you make changes:
1. Push code to GitHub
2. Render auto-redeploys backend automatically
3. Vercel auto-redeploys frontend automatically
4. No manual steps needed!

## Troubleshooting

**"Failed to connect to server" error:**
- Verify `NEXT_PUBLIC_API_URL` is correct in Vercel (check Vercel Settings → Environment Variables)
- Check Render backend is running (go to Render dashboard, should show green checkmark)
- Make sure URL starts with `https://` (not `http://`)
- Wait 30 seconds if it's the first request (free tier wakes up)

**Backend not receiving requests:**
- Check `NEXT_PUBLIC_API_URL` environment variable in Vercel settings
- Look at Render logs (Render dashboard → select backend → Logs) to see if requests arrive
- Verify no typos in the URL
- Open browser DevTools → Network tab to see what URL the frontend is actually calling

**Can't log in:**
- Try registering a new account first
- Check Render logs for error messages
- Verify `JWT_SECRET` is set in Render (go to Environment tab)

**Slow first request:**
- This is normal on free tier! Render hibernates unused services after 15 minutes
- First request wakes it up (takes ~30 seconds)
- Upgrade to paid tier if you need always-on performance

## What Happens Next

- Your users can access the app at your Vercel URL
- The app communicates with the backend on Render
- Database is stored in a JSON file (works for testing/demos)
- For production with many users, consider adding a real database (PostgreSQL on Render or Supabase)

## Upgrading Later

**Want faster backend?** Upgrade Render from Free ($0) to Starter ($7/month)
- Render dashboard → Pricing → Upgrade Instance Type

**Want more frontend features?** Upgrade Vercel from Free to Pro ($20/month)
- Usually free tier is plenty for most apps

## Support

- Render docs: [render.com/docs](https://render.com/docs)
- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Check deployment logs if something fails (both platforms show detailed logs)
