# Quick Reference Card

## Start Here

### First Time? Do This:
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Want to Access Admin Panel?
```
Go to: http://localhost:3000/admin
Email: admin@example.com
Password: password123
```

## Key Credentials (CHANGE BEFORE PRODUCTION!)

| Role | Email | Password | Type |
|------|-------|----------|------|
| Admin | admin@example.com | password123 | Demo |
| Superadmin | superadmin@example.com | password123 | Demo |
| Test User | user@test.com | Test123! | Create by registering |

## Main URLs

| Purpose | Local | Production |
|---------|-------|------------|
| Main App | http://localhost:3000 | https://your-domain.com |
| Admin Panel | http://localhost:3000/admin | https://your-domain.com/admin |
| API | http://localhost:3000/api | https://your-domain.com/api |

## API Endpoints

```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/verify-email
  GET    /api/auth/me

KYC:
  POST   /api/kyc/submit
  GET    /api/admin/kyc-requests
  POST   /api/admin/kyc/{userId}/approve
  POST   /api/admin/kyc/{userId}/reject

Admin:
  POST   /api/admin/login
  GET    /api/admin/users
  GET    /api/admin/analytics
  GET    /api/admin/dashboard
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Debugging
npm test                 # Run tests (if configured)
npx tsc --noEmit        # Check TypeScript errors

# Dependencies
npm install              # Install packages
npm update               # Update packages
npm audit fix            # Fix security vulnerabilities
```

## Browser DevTools (F12)

| Tab | Use for |
|-----|---------|
| Console | See [v0] debug logs |
| Network | Check API calls and status codes |
| Application → Local Storage | Check authToken, authUser |
| Lighthouse | Performance testing |

## File Locations

```
Admin Files:
  /app/admin/page.tsx
  /app/components/admin/admin-dashboard.tsx
  /app/components/admin/admin-users.tsx
  /app/components/admin/admin-kyc.tsx
  /app/components/admin/admin-analytics.tsx

API Files:
  /app/api/auth/
  /app/api/admin/
  /app/api/kyc/

Config Files:
  .env.local (create this)
  next.config.mjs
  tsconfig.json
  package.json
```

## Environment Variables Needed

```env
# Required
NEXT_PUBLIC_API_URL=https://tesla-backend-ipk1.onrender.com

# For production
JWT_SECRET=your-secure-secret-key
```

## Test Workflow

1. **Register:** http://localhost:3000 → Click Register
2. **Verify:** Check backend logs for token
3. **Login:** Use registered credentials
4. **Submit KYC:** Go to dashboard → KYC section
5. **Admin Review:** http://localhost:3000/admin → KYC Requests
6. **Approve/Reject:** View docs and approve/reject

## Debugging Checklist

- [ ] Is dev server running? `npm run dev`
- [ ] Is backend accessible? Check `NEXT_PUBLIC_API_URL`
- [ ] Check browser console (F12) for [v0] logs
- [ ] Check network tab (F12) for API responses
- [ ] Check localStorage for authToken (F12 → Application)
- [ ] Try clearing cache (Ctrl+Shift+Del)
- [ ] Check if port 3000 is available
- [ ] Verify environment variables in .env.local

## Before Deploying to Production

1. ✅ Change admin credentials
2. ✅ Update API URL to production
3. ✅ Set JWT_SECRET to random secure string
4. ✅ Test all features work
5. ✅ Check error logs
6. ✅ Enable HTTPS
7. ✅ Set up backups
8. ✅ Configure CORS for domain

## Quick Deploy (Vercel)

```bash
# Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# Then:
# 1. Go to vercel.com
# 2. Import project from GitHub
# 3. Add environment variables
# 4. Deploy
```

## Getting Help

1. **Check Documentation:**
   - ADMIN_PANEL_ACCESS.md
   - TESTING_AND_DEBUGGING_GUIDE.md
   - COMPLETE_SETUP_GUIDE.md

2. **Debug Locally:**
   - Check `[v0]` logs in console (F12)
   - Check Network tab for API errors
   - Verify environment variables

3. **Common Fixes:**
   - CORS Error → Check NEXT_PUBLIC_API_URL
   - 401 Error → Login again to get fresh token
   - Upload Error → Check public/uploads directory exists
   - Admin Login Fails → Verify demo credentials

## Performance Tips

- Use `Next.js Image` component for images
- Enable compression in production
- Cache static files (30 days)
- Minimize JavaScript bundles
- Monitor Core Web Vitals

## Security Reminders

🔒 Never commit credentials to Git
🔒 Use environment variables for secrets
🔒 Change demo credentials before production
🔒 Keep dependencies updated: `npm audit fix`
🔒 Use HTTPS in production
🔒 Implement rate limiting
🔒 Log all admin actions

## Useful Links

- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- TypeScript: https://www.typescriptlang.org/docs/
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

---

**Need more help?** Check the detailed guides in the project root!
