# Testing & Debugging Guide

## Quick Test Checklist

### 1. Backend Connection Test
- [ ] Backend is running and accessible
- [ ] CORS is properly configured
- [ ] API endpoints respond with 200 status

### 2. Authentication Flow
- [ ] User can register with valid email
- [ ] Email verification token is sent
- [ ] User can login with correct credentials
- [ ] Invalid credentials are rejected
- [ ] JWT token is stored in localStorage
- [ ] Token is sent in Authorization header

### 3. Admin Panel
- [ ] Admin login works with demo credentials
- [ ] Token is stored and persists across page reload
- [ ] Dashboard stats load correctly
- [ ] Users list shows all registered users
- [ ] KYC requests show pending approvals
- [ ] Can approve/reject KYC with updates

### 4. KYC System
- [ ] KYC form accepts all fields
- [ ] File uploads work (ID front/back, selfie)
- [ ] Submitted KYC appears in admin dashboard
- [ ] Admin can approve/reject with reason

## Running Tests

### Local Development Mode
```bash
# Terminal 1: Start backend (if local)
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client

# Visit in browser
http://localhost:3000       # Main app
http://localhost:3000/admin # Admin panel
```

### Test Accounts

**User Registration:**
1. Go to `http://localhost:3000`
2. Click "Register"
3. Fill in form with test data
4. Check backend logs for verification token
5. Use token to verify email

**Admin Access:**
1. Go to `http://localhost:3000/admin`
2. Email: `admin@example.com`
3. Password: `password123`

## Debugging with Browser Dev Tools

### 1. Check Network Requests
```
F12 → Network tab
- Monitor all API calls
- Check request/response headers
- Verify status codes (should be 200, 201, 401, etc.)
- Check response body for error messages
```

### 2. Check Console Logs
```
F12 → Console tab
- Look for [v0] debug messages
- Check for JavaScript errors
- Monitor for network errors
```

### 3. Check Local Storage
```
F12 → Application tab → Local Storage → localhost:3000
- authToken should be present after login
- authUser should contain user data
- adminToken should be present after admin login
```

### 4. Simulate Network Issues
```
F12 → Network tab → Throttling dropdown
- Test with "Slow 3G" to see loading states
- Test with "Offline" to see error handling
```

## Common Issues & Solutions

### Issue: CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Verify backend CORS configuration:
   ```javascript
   // In backend server
   app.use(cors({
     origin: "http://localhost:3000",
     credentials: true,
     allowedHeaders: ["Content-Type", "Authorization"]
   }))
   ```
2. Check that `NEXT_PUBLIC_API_URL` is set correctly
3. Ensure backend is running on the correct port

### Issue: 401 Unauthorized
**Error:** `HTTP 401: Unauthorized`

**Solutions:**
1. Check token expiration: `console.log(localStorage.getItem("authToken"))`
2. Verify token is being sent in Authorization header
3. Check backend JWT_SECRET matches frontend
4. Re-login to get fresh token

### Issue: Admin Login Fails
**Error:** `Invalid credentials` but using correct password

**Solutions:**
1. Verify demo credentials haven't been changed:
   - Email: `admin@example.com`
   - Password: `password123`
2. Check backend admin login endpoint
3. Verify JWT_SECRET environment variable
4. Check browser console for detailed error

### Issue: KYC Documents Not Showing
**Error:** Files upload but don't appear in admin panel

**Solutions:**
1. Check file upload path in backend logs
2. Verify upload directory exists: `/public/uploads/`
3. Check file permissions
4. Verify `/api/admin/kyc-requests` returns data

### Issue: Email Verification Not Working
**Error:** Can't verify email after registration

**Solutions:**
1. Check backend logs for verification token
2. Copy exact token from logs to test
3. Verify token format matches
4. Check token hasn't expired (usually 15 mins)

## Debugging with Console Logs

All console logs are prefixed with `[v0]` for easy filtering:

```javascript
// Filter in console
[v0]

// Examples you should see:
[v0] Making API request to: http://localhost:3000/api/auth/login
[v0] Login response received
[v0] Restored auth from storage
[v0] KYC submitted successfully
[v0] Admin login successful
```

## Performance Testing

### API Response Times
Target times for optimal UX:
- **Login:** < 500ms
- **User list:** < 1s
- **KYC list:** < 1s
- **Analytics:** < 2s

### Browser Performance
```
F12 → Lighthouse tab
- Run audit for Performance
- Check for warnings about:
  - Unused JavaScript
  - Large images
  - Slow API calls
```

## Load Testing

### Test with Multiple Users
```bash
# Use browser dev tools to simulate multiple users
# Or use curl to test API directly

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!@",
    "firstName":"Test",
    "lastName":"User",
    "country":"US"
  }'
```

## Automated Testing (Optional)

### Using Jest
```bash
# Install Jest
npm install --save-dev jest @testing-library/react

# Run tests
npm test
```

### Example Test
```typescript
import { render, screen } from "@testing-library/react"
import AdminLogin from "@/app/components/admin/admin-login"

test("Admin login form renders", () => {
  const mockSuccess = jest.fn()
  render(<AdminLogin onSuccess={mockSuccess} />)
  
  expect(screen.getByPlaceholderText(/admin@example.com/i)).toBeInTheDocument()
})
```

## Database Inspection

### Check Local Database
```bash
# If using SQLite
sqlite3 data/db.json

# If using JSON
cat data/db.json | jq .

# Filter by user
cat data/db.json | jq '.users[] | select(.email=="admin@example.com")'
```

## Security Testing

### Test Authorization
1. **Without token:**
   ```bash
   curl http://localhost:3000/api/admin/users
   # Should return 401 Unauthorized
   ```

2. **With invalid token:**
   ```bash
   curl -H "Authorization: Bearer invalid" \
     http://localhost:3000/api/admin/users
   # Should return 401 Unauthorized
   ```

3. **With valid token:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/admin/users
   # Should return 200 OK with user data
   ```

## Deployment Testing

### Test Production Build Locally
```bash
# Create production build
npm run build

# Run production server
npm start

# Test admin panel
http://localhost:3000/admin
```

### Test Environment Variables
```bash
# Create .env.local for testing
NEXT_PUBLIC_API_URL=https://tesla-backend-ipk1.onrender.com

# Restart dev server
npm run dev
```

## Monitoring in Production

### Check Server Logs
```bash
# Vercel deployment logs
vercel logs

# Render deployment logs (if backend on Render)
# Visit dashboard.render.com to view logs
```

### Error Tracking
- Monitor browser console errors
- Set up error tracking service (Sentry, etc.)
- Create logs aggregation dashboard

## Health Checks

### Backend Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Frontend Health
```bash
# Check if app loads
curl http://localhost:3000

# Check if admin panel loads
curl http://localhost:3000/admin
```

## Final Checklist Before Deployment

- [ ] All console errors are resolved
- [ ] No CORS errors
- [ ] No 401/403 errors for valid requests
- [ ] Admin panel fully functional
- [ ] User registration works
- [ ] Email verification works
- [ ] KYC submission works
- [ ] KYC approval/rejection works
- [ ] All analytics loading correctly
- [ ] Performance is acceptable
- [ ] Security tests pass
- [ ] Environment variables are correct
- [ ] Database is accessible
- [ ] Backups are in place
