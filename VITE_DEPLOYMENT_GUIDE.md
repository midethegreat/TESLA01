# Vite Deployment Guide

This project now uses **Vite** with **React Router** for professional client-side routing.

## Features

✅ **Vite Build System** - Fast, modern bundler
✅ **React Router v7** - Proper client-side routing without page reloads
✅ **Protected Routes** - Authentication-based route protection
✅ **SPA Architecture** - Single-page application with seamless navigation
✅ **Optimized Build** - Code splitting and vendor chunking

## Development

```bash
# Install dependencies
npm install

# Run development server (frontend + backend)
npm run dev

# Run only frontend
npm run dev:client

# Run only backend
npm run dev:server
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Vercel Deployment

The project is configured for Vercel deployment with:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA Rewrites: All routes redirect to `/index.html`

## Routes

- `/` - Landing page
- `/register` - Registration page
- `/login` - Login page
- `/dashboard` - User dashboard (protected)
- `/reset-password` - Password reset
- `/admin` - Admin panel
- `/access-denied` - Access denied page

## Backend Server

The backend Express server runs on port 5000 and handles:
- Authentication APIs
- User management
- File uploads
- Database operations

In production, make sure to:
1. Deploy backend separately (Railway, Render, etc.)
2. Update API proxy target in environment variables
3. Set CORS origins for production domains

## Environment Variables

Create a `.env` file with:

```env
# Backend server port
PORT=5000

# Frontend dev server port
VITE_PORT=3000

# API endpoints (if backend is deployed separately)
VITE_API_URL=https://your-backend-url.com

# Other environment variables
GEMINI_API_KEY=your_key_here
```

## Troubleshooting

**Issue**: Routes not working after deployment
**Solution**: Ensure `vercel.json` has proper rewrites configured

**Issue**: API calls failing
**Solution**: Check proxy configuration in `vite.config.ts`

**Issue**: Build errors
**Solution**: Run `npm run build` locally to debug before deploying
