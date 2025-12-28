# Admin Dashboard Implementation Guide

## Overview

The Tesla Investment Platform includes a comprehensive admin and superadmin system for managing users, KYC verification, and analytics. This guide explains how the system works and how to access it.

## Architecture

### Role-Based Access Control

There are two admin roles in the system:

1. **Admin** - Can manage users and review KYC submissions
2. **SuperAdmin** - Has all admin privileges plus additional system insights (API keys, advanced analytics)

### Database Integration

The system uses a JSON-based database (`data/db.json`) to store:
- User profiles and authentication data
- KYC submissions and verification status
- Referral tracking
- Profile images and documents

## Accessing the Admin Panel

### Admin URL
Navigate to: `http://localhost:3000/#/admin`

### Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`
- Role: Admin (can manage users and KYC)

**SuperAdmin Account:**
- Email: `superadmin@example.com`
- Password: `password123`
- Role: SuperAdmin (full system access)

## Admin Features

### 1. Users Tab
View all registered users with detailed information:
- Email address
- Full name (First & Last)
- Gender
- Phone number
- Country
- Date joined
- Number of successful referrals (verified users only)
- KYC verification status
- Email verification status
- API Key (SuperAdmin only)

**Search Functionality:** Filter users by email or name in real-time

### 2. KYC Requests Tab
Review pending KYC submissions:
- User full name and date of birth
- ID type submitted
- Front ID image
- Back ID image
- Selfie with ID image
- Submission date and time

**Actions:**
- **Approve:** Verify the user's KYC - they can then proceed with investments
- **Reject:** Decline the KYC with a reason - user can resubmit

**Important:** Once KYC is approved:
- User's profile becomes locked (cannot edit personal information)
- All KYC information cannot be changed
- User is marked as KYC verified

### 3. Analytics Tab
View real-time statistics:
- Total registered users
- Email-verified users count
- KYC-verified users count
- Pending KYC submissions count
- Registration breakdown by country (with visual representation)

## User Flow with Admin System

### Registration Process
1. User registers with email and password
2. User receives verification email with token
3. User verifies email to activate account
4. User completes profile settings
5. User submits KYC documents

### KYC Verification Process
1. User submits KYC with:
   - Full name
   - Date of birth
   - ID type (Passport, Driver's License, etc.)
   - Front ID photo
   - Back ID photo
   - Selfie holding ID
2. Admin reviews submission in KYC Requests tab
3. Admin either approves or rejects
4. User is notified of status
5. If approved, user's profile is locked for security

### Referral System
- Users receive a unique referral link based on their user ID
- When others register using the referral link, they are linked as referrals
- Only verified (email confirmed) referrals count toward the user's referral count
- SuperAdmin can see detailed referral metrics in analytics

## Security Best Practices

### For Production
1. **Change Demo Credentials** - Update `server.mjs` lines 489-505 with secure credentials
2. **Use Environment Variables** - Store admin credentials in `.env` file
3. **Enable HTTPS** - All admin traffic should be encrypted
4. **Rate Limiting** - Implement login attempt limits
5. **Audit Logging** - Track all admin actions

### Access Control
- Admin panel is only accessible via `#/admin` route
- Regular users cannot access admin features
- JWT tokens are required for all admin API calls
- Token expiration: 7 days

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login

### User Management
- `GET /api/admin/users` - Get all users with referral counts
- `GET /api/admin/dashboard` - Get dashboard statistics

### KYC Management
- `GET /api/admin/kyc-requests` - Get pending KYC submissions
- `POST /api/admin/kyc/:userId/approve` - Approve user's KYC
- `POST /api/admin/kyc/:userId/reject` - Reject KYC with reason

### Analytics
- `GET /api/admin/analytics` - Get analytics data

## User Data Displayed in Admin Dashboard

For each user, the admin can see:
- **Email** - Unique email address
- **Name** - First and last name
- **Gender** - User's gender (if provided)
- **Phone** - Phone number (if provided)
- **Country** - Country of residence
- **Date Joined** - Account creation date
- **Referrals** - Count of successfully referred users (verified emails only)
- **KYC Status** - Not Submitted / Submitted / Verified / Rejected
- **Email Verified** - Yes/No status
- **API Key** (SuperAdmin only) - User's unique system ID

## Monitoring and Troubleshooting

### Common Tasks

**To verify a user's KYC:**
1. Go to KYC Requests tab
2. Review all submitted documents
3. Click "Approve" if documents are valid

**To view a specific user's details:**
1. Go to Users tab
2. Use the search box to find by email or name
3. View all associated information including referrals

**To check analytics:**
1. Go to Analytics tab
2. View registration trends by country
3. Monitor KYC verification progress

### Server Logs
The server logs all actions with `[v0]` prefix for debugging:
\`\`\`
[v0] Admin login error: ...
[v0] KYC approved for user: ...
[v0] User registered: ...
\`\`\`

## Database Schema

### User Object
\`\`\`json
{
  "id": "unique_id",
  "email": "user@example.com",
  "password": "hashed_password",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "phone": "+1234567890",
  "country": "USA",
  "city": "New York",
  "zipCode": "10001",
  "address": "123 Main St",
  "emailVerified": true,
  "kycStatus": "verified",
  "kycVerified": true,
  "referrerId": "referrer_id",
  "createdAt": "2025-01-01T12:00:00Z",
  "profileImage": "/uploads/image.jpg",
  "kyc": {
    "fullName": "John Doe",
    "dob": "1990-01-01",
    "idType": "passport",
    "idFront": "/uploads/id_front.jpg",
    "idBack": "/uploads/id_back.jpg",
    "selfie": "/uploads/selfie.jpg",
    "submittedAt": "2025-01-05T12:00:00Z",
    "verifiedAt": "2025-01-06T12:00:00Z",
    "verifiedBy": "admin"
  }
}
\`\`\`

## Deployment Notes

When deploying to production:

1. Update JWT secret in `server.mjs`:
   \`\`\`javascript
   const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production"
   \`\`\`

2. Update admin credentials (do not use demo credentials):
   \`\`\`javascript
   if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
     // Login logic
   }
   \`\`\`

3. Enable HTTPS for all admin routes

4. Set up regular database backups

5. Monitor server logs for suspicious activities

## Support

For issues or questions about the admin system, check the server logs for `[v0]` prefixed messages that indicate the exact point of failure.
