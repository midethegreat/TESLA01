# Admin Panel Access Guide

## Overview
The Tesla Investment Platform includes a secure admin dashboard for managing users, KYC verification, and viewing analytics.

## Local Development

### Starting the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the admin panel:**
   - Navigate to: `http://localhost:3000/admin`
   - Or use direct link in your browser

### Admin Login Credentials

**Demo Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Demo Superadmin Account:**
- Email: `superadmin@example.com`
- Password: `password123`

⚠️ **IMPORTANT:** Change these credentials before production deployment!

## Live Server Deployment

### Production Access URL
```
https://your-domain.com/admin
```

### Setting Up Production Credentials

1. **Update admin credentials in backend:**
   - Modify the admin login endpoint on your backend server
   - Store admin credentials securely (hashed passwords, environment variables)
   - Never commit credentials to version control

2. **Set environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   JWT_SECRET=your-secure-secret-key
   ```

3. **Deploy to Vercel/Netlify:**
   ```bash
   npm run build
   # Deploy the build folder
   ```

## Admin Dashboard Features

### 1. Dashboard Tab
- **Total Users:** Count of all registered users
- **Email Verified:** Number of users who verified their email
- **KYC Pending:** Number of pending KYC requests

### 2. Users Tab
- View all registered users
- Check email verification status
- Monitor KYC status per user
- See registration date and location

### 3. KYC Requests Tab
- View all pending KYC submissions
- Review submitted documents:
  - ID Front
  - ID Back
  - Selfie
- **Approve KYC:** Verify the user's identity
- **Reject KYC:** Reject with reason for resubmission

### 4. Analytics Tab
- Overall statistics and trends
- Registration by country chart
- KYC verification rates
- User growth tracking

## Security Best Practices

### For Development
- Use demo credentials only in development
- Never push real credentials to version control
- Use environment variables for sensitive data

### For Production
- Change all default admin passwords immediately
- Use strong, unique passwords (20+ characters)
- Enable 2FA if your system supports it
- Use environment variables for JWT_SECRET
- Implement rate limiting on login endpoints
- Log all admin actions for audit purposes
- Regularly rotate admin credentials
- Use HTTPS only for all communications

## Troubleshooting

### Admin Panel Not Loading
1. Check if backend API is running and accessible
2. Verify `NEXT_PUBLIC_API_URL` environment variable
3. Check browser console for errors (F12 → Console tab)
4. Ensure credentials are correct

### KYC Documents Not Showing
1. Verify backend has proper file upload handling
2. Check document paths are correct
3. Ensure CORS is properly configured

### Authentication Errors
1. Clear browser cache and cookies
2. Check JWT token expiration (set to 7 days)
3. Verify admin credentials in backend
4. Check if backend admin login endpoint is working

## API Endpoints

All endpoints require Bearer token authentication (except `/api/admin/login`).

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/users` | GET | Get all users |
| `/api/admin/kyc-requests` | GET | Get pending KYC requests |
| `/api/admin/kyc/{userId}/approve` | POST | Approve user KYC |
| `/api/admin/kyc/{userId}/reject` | POST | Reject user KYC with reason |
| `/api/admin/analytics` | GET | Get system analytics |
| `/api/admin/dashboard` | GET | Get dashboard statistics |

## Example cURL Commands

### Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get Users
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Approve KYC
```bash
curl -X POST http://localhost:3000/api/admin/kyc/{userId}/approve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

## Environment Variables

```env
# Frontend
NEXT_PUBLIC_API_URL=https://tesla-backend-ipk1.onrender.com

# Backend
JWT_SECRET=your-secure-secret-key
PORT=5000
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review debug logs in browser console (F12)
3. Check backend logs for API errors
4. Contact support at: support@teslaplatform.com
