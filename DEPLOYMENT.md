# Tesla Investment Platform - Deployment Guide

## Quick Start

This app is configured to work with the backend deployed at: **https://tesla-backend-ipk1.onrender.com**

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- The backend service running at the URL above

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update environment variables in `.env.local`:**
   ```env
   VITE_API_URL=https://tesla-backend-ipk1.onrender.com
   ```

   For local development (optional):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# App will be available at http://localhost:3000
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and select your repository
4. Add the environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://tesla-backend-ipk1.onrender.com`
5. Click "Deploy"

### Option 2: Netlify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://tesla-backend-ipk1.onrender.com`
4. Deploy

### Option 3: Manual (Any Server)

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder is ready to be served. You can upload it to any static hosting service.

3. Make sure your hosting service has the environment variable set:
   - `VITE_API_URL=https://tesla-backend-ipk1.onrender.com`

## Backend Configuration

The frontend is pre-configured to connect to:
- **Production Backend:** https://tesla-backend-ipk1.onrender.com
- **Local Backend:** http://localhost:5000 (development only)

Ensure your backend has CORS enabled for your frontend domain.

## API Endpoints

All API calls automatically prefix the requests with the `VITE_API_URL`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `GET /api/auth/me` - Get current user
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `DELETE /api/documents/:id` - Delete document
- `POST /api/profile/image` - Upload profile image
- `PUT /api/profile` - Update profile
- `GET /api/admin/*` - Admin endpoints (requires admin token)

## Troubleshooting

### Backend Connection Issues

If you see "Failed to connect to backend" errors:

1. **Check the backend URL:**
   ```bash
   # Test the backend is running
   curl https://tesla-backend-ipk1.onrender.com/api/health
   ```

2. **Verify environment variable:**
   - Make sure `VITE_API_URL` is set correctly in your deployment platform

3. **Check CORS:**
   - Ensure the backend allows requests from your frontend domain

4. **Local development:**
   - Make sure the backend server is running on port 5000
   - Check that Vite proxy is properly configured in vite.config.ts

### Build Errors

- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- Check Node.js version (should be 18+):
  ```bash
  node --version
  ```

## Production Checklist

- [ ] Backend service is running and accessible
- [ ] Environment variables are set in deployment platform
- [ ] Build completes without errors
- [ ] Test login/registration flow
- [ ] Test document upload (KYC verification)
- [ ] Test admin dashboard access
- [ ] Check console for any API errors
- [ ] Monitor backend logs for issues
- [ ] Set up monitoring/error tracking (Sentry, etc.)

## Support

For issues or questions:
1. Check backend logs on Render dashboard
2. Check browser console for error details
3. Verify backend service status
4. Review CORS configuration on backend
