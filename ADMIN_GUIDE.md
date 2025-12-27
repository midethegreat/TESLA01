# Tesla Investment Platform - Admin & SuperAdmin Guide

## Overview

This document provides complete instructions on accessing and using the admin panel to manage users, verify KYC documents, and view analytics for the Tesla Investment Platform.

## Table of Contents
1. [Admin Access](#admin-access)
2. [Admin Roles](#admin-roles)
3. [Dashboard Features](#dashboard-features)
4. [User Management](#user-management)
5. [KYC Verification](#kyc-verification)
6. [Analytics & Reporting](#analytics--reporting)
7. [Demo Credentials](#demo-credentials)

---

## Admin Access

### Accessing the Admin Panel

To access the admin panel, you have two options:

**Option 1: Direct URL Access**
```
http://localhost:3000/#/admin
```

**Option 2: Navigate to Admin Page**
- The admin panel can be accessed directly by navigating to the `/admin` route in your browser

### Admin Panel URL Structure
- **Development**: `http://localhost:3000/#/admin`
- **Production**: `https://yourdomain.com/#/admin`

---

## Admin Roles

### Admin
- View all users and their profiles
- Review and approve/reject KYC documents
- View basic analytics and user statistics
- Cannot modify other admin accounts

### SuperAdmin
- All Admin permissions plus:
- Full access to all system data
- Ability to view all administrative actions
- Complete analytics and reporting access
- Can manage other admin accounts (future feature)

---

## Dashboard Features

### Main Dashboard
The admin dashboard provides an overview of the system with the following widgets:

1. **Total Users** - Count of all registered users
2. **Email Verified** - Users who have verified their email addresses
3. **KYC Verified** - Users who have completed and approved KYC
4. **Pending KYC** - Users with KYC submissions awaiting review
5. **Registration by Country** - Visual representation of user distribution

### Navigation Menu
The admin dashboard includes navigation to:
- **Dashboard** - Overview and statistics
- **Users** - User management and profile viewing
- **KYC Requests** - KYC document review queue
- **Analytics** - Detailed analytics and reporting
- **Logout** - Sign out of admin panel

---

## User Management

### Viewing Users

1. Navigate to the **Users** section from the admin dashboard
2. View a table of all registered users with:
   - User ID
   - Email address
   - Full name
   - Country of residence
   - Email verification status
   - KYC status
   - Registration date

### User Details
- Click on any user row to view detailed profile information
- View uploaded profile pictures
- See referral information and referral count
- Check user's investment plans and account status

### User Status Indicators
- **Email Status**: ✓ Verified or ✗ Not Verified
- **KYC Status**: 
  - Not Submitted - User hasn't uploaded KYC
  - In Review - KYC documents pending admin review
  - Verified - KYC approved
  - Rejected - KYC rejected with reason

---

## KYC Verification

### KYC Review Process

1. Navigate to **KYC Requests** from the admin dashboard
2. View all pending KYC submissions with:
   - User information
   - Full name and date of birth
   - ID type (Passport, Driver's License, etc.)
   - Submission date

### Reviewing KYC Documents

For each KYC submission, you can view:

1. **ID Front** - Front side of the government-issued ID
2. **ID Back** - Back side of the government-issued ID
3. **Selfie with ID** - User's selfie holding their ID

### Approving KYC

1. Review all three documents
2. Click **Approve** button
3. User's KYC status changes to "Verified"
4. User's profile information becomes locked for editing
5. User receives notification of approval

### Rejecting KYC

1. If documents are incomplete or invalid
2. Click **Reject** button
3. Enter a reason for rejection (e.g., "ID not clearly visible")
4. User receives notification with rejection reason
5. User can resubmit KYC documents

### KYC Status Flow

```
Not Submitted → In Review → Verified
                    ↓
                 Rejected → In Review → Verified
```

---

## Analytics & Reporting

### Dashboard Analytics

The analytics section provides:

1. **User Statistics**
   - Total registered users
   - Email verified count
   - KYC verified count
   - Pending KYC count

2. **Geographic Distribution**
   - Users by country (visual bar chart)
   - Top countries by registration

3. **Verification Metrics**
   - Email verification rate (%)
   - KYC verification rate (%)
   - Average time to verification

4. **Account Activity**
   - Recent registrations
   - Recent KYC submissions
   - Recent profile updates

---

## Demo Credentials

### Admin Access

```
Email: admin@example.com
Password: password123
Role: Admin
```

### SuperAdmin Access

```
Email: superadmin@example.com
Password: password123
Role: SuperAdmin
```

---

## Security Best Practices

### For Admin Users
1. **Change Default Passwords** - Update demo passwords immediately after first login
2. **Use Strong Passwords** - Minimum 12 characters with mixed case and numbers
3. **Logout After Use** - Always logout when finished with admin panel
4. **Secure Storage** - Do not share admin credentials
5. **Regular Audits** - Review access logs periodically

### Data Protection
- All admin actions are logged for audit trails
- User data is encrypted in transit and at rest
- Admin panel is only accessible via HTTPS in production
- Session tokens expire after 24 hours

---

## Common Admin Tasks

### Task: Verify a User's KYC
1. Login to admin panel with credentials
2. Click "KYC Requests"
3. Find the user in the pending list
4. Review all three documents
5. Click "Approve" if valid
6. User's profile is now locked

### Task: View User Statistics
1. From admin dashboard, view the main statistics cards
2. See total users, verified users, and pending KYC
3. Scroll down to see registration by country chart

### Task: Reject KYC Documents
1. Navigate to KYC Requests
2. Find user with invalid documents
3. Click "Reject" button
4. Enter reason (e.g., "Blurry ID image")
5. User will see rejection reason and can resubmit

### Task: Monitor System Health
1. Check "Dashboard" for overview
2. Monitor email verification rate
3. Check pending KYC count
4. Review geographic distribution

---

## Troubleshooting

### Cannot Login to Admin Panel
- Verify you're using correct credentials
- Clear browser cache and cookies
- Check if admin account is active in the database
- Ensure server is running on port 5000

### KYC Documents Not Displaying
- Check if images were uploaded successfully during KYC submission
- Verify image file permissions
- Ensure uploads folder exists at `/uploads`

### Analytics Not Loading
- Refresh the page
- Check if server is responding
- Verify database connection is active

### Session Expired
- Admin sessions expire after 24 hours
- Logout and login again
- Clear stored token: `localStorage.removeItem('adminToken')`

---

## API Endpoints (For Developers)

### Admin Authentication
```
POST /api/admin/login
Body: { email, password }
Response: { token, admin }
```

### Get Dashboard Stats
```
GET /api/admin/dashboard
Headers: { Authorization: "Bearer token" }
```

### Get All Users
```
GET /api/admin/users
Headers: { Authorization: "Bearer token" }
```

### Get KYC Requests
```
GET /api/admin/kyc-requests
Headers: { Authorization: "Bearer token" }
```

### Approve KYC
```
POST /api/admin/kyc/:userId/approve
Headers: { Authorization: "Bearer token" }
```

### Reject KYC
```
POST /api/admin/kyc/:userId/reject
Body: { reason }
Headers: { Authorization: "Bearer token" }
```

### Get Analytics
```
GET /api/admin/analytics
Headers: { Authorization: "Bearer token" }
```

---

## Support & Contact

For issues or questions:
1. Check the Troubleshooting section above
2. Review server logs for detailed error messages
3. Contact the development team for assistance

---

**Last Updated**: December 2025
**Version**: 1.0
