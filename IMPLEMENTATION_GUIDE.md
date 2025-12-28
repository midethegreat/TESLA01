# Tesla Investment Platform - Complete Backend Implementation

## Overview

This document provides a complete guide to the new backend system that replaces Firebase with a custom SQLite-based backend.

## What's New

### Database Layer
- **SQLite Database** - Lightweight, file-based database stored in `data/tesla.db`
- **Automatic Schema Creation** - Database tables are created automatically on first run
- **Persistent Storage** - All user data, documents, and profile information persists

### Authentication System
- **Email Verification** - Users must verify their email before accessing the dashboard
- **JWT Tokens** - Secure token-based authentication with 7-day expiry
- **Password Hashing** - bcryptjs with 10 rounds for security
- **Session Management** - Sessions stored in database for validation

### File Management
- **Document Upload** - Users can upload PDF, Word, Excel, and text files (50MB limit)
- **Profile Images** - Users can upload profile pictures
- **Local Storage** - Files stored in `public/uploads` directory
- **Admin Viewing** - Admin dashboard shows all uploaded files with user information

### Frontend Integration
- **Persistent Sessions** - User data saved to localStorage, survives page refresh
- **Real-time Updates** - Profile changes sync immediately across the app
- **Automatic Restoration** - Auth state restored from localStorage on app load
- **Secure Storage** - Auth tokens and user data encrypted in localStorage

## File Structure

\`\`\`
/server
  /db.ts              - Database initialization and schema
  /config.ts          - Configuration constants
  /auth.ts            - Authentication logic
  /utils.ts           - Utility functions
  /email.ts           - Email sending functionality
  /index.ts           - Express server and API routes

/hooks
  /useAuth.ts         - Authentication hook with persistence
  /useDocuments.ts    - Document management hook
  /useProfile.ts      - Profile management hook

/components
  /Auth.tsx           - Registration component
  /Login.tsx          - Login component
  /DocumentUpload.tsx - File upload component
  /AdminPanel.tsx     - Admin dashboard
  /ProfileSettings.tsx - Profile editor

/lib
  /api.ts             - API client functions
  /storage.ts         - localStorage utilities

/data
  /tesla.db           - SQLite database (created automatically)

/public/uploads       - Directory for uploaded files
\`\`\`

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Create `.env.local` file:
\`\`\`env
VITE_API_URL=http://localhost:5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=noreply@teslainvestment.com
APP_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key-change-in-production
\`\`\`

### 3. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

This will start both frontend (Vite) and backend (Express) servers.

### 4. Access the Application
- Frontend: `http://localhost:3000` or `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Key Features

### Email Verification
1. User registers with email and password
2. Verification email sent automatically
3. User enters code from email
4. Account becomes active and accessible

### Document Management
1. Users upload documents (PDF, Word, Excel, etc.)
2. Documents stored locally in `public/uploads`
3. Admin can view all uploaded documents
4. Users can delete their own documents

### Profile Persistence
1. User changes first name, last name, or country
2. Changes saved to database
3. Changes persisted to localStorage
4. Changes survive page refresh and logout/login

### Real-time Admin Dashboard
1. View all registered users
2. See all uploaded documents with user info
3. Access uploaded files directly
4. Monitor email verification status

## API Reference

### Authentication Endpoints

**POST /api/auth/register**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "country": "Nigeria"
}
\`\`\`

**POST /api/auth/login**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

**POST /api/auth/verify-email**
\`\`\`json
{
  "userId": "user-id-from-register",
  "token": "verification-code-from-email"
}
\`\`\`

**GET /api/auth/me** (Requires Authorization header)

### Document Endpoints

**POST /api/documents/upload** (Form data with file)
- Requires: `Authorization: Bearer {token}`
- Accepts: File upload (max 50MB)

**GET /api/documents** (Requires Authorization header)

**DELETE /api/documents/:id** (Requires Authorization header)

### Profile Endpoints

**POST /api/profile/image** (Form data with file)
- Requires: `Authorization: Bearer {token}`

**GET /api/profile/image** (Requires Authorization header)

**PUT /api/profile**
\`\`\`json
{
  "firstName": "John",
  "lastName": "Doe",
  "country": "Nigeria"
}
\`\`\`

### Admin Endpoints

**GET /api/admin/uploads** (Requires Authorization header)

**GET /api/admin/users** (Requires Authorization header)

## Data Persistence

### localStorage Storage
- `authToken` - JWT authentication token
- `authUser` - Cached user information
- `userProfile` - Profile data
- `userDocuments` - Cached document list

All data is automatically restored on app load, ensuring seamless user experience.

### Database Storage
- User accounts with encrypted passwords
- Email verification tokens
- Document metadata and paths
- Profile images
- Session tokens
- User updates and notifications

## Security Best Practices

1. **Password Security**
   - Hashed with bcryptjs (10 rounds)
   - Never stored in plaintext
   - Minimum 6 characters required

2. **Token Security**
   - JWT tokens with 7-day expiry
   - Tokens validated on each request
   - Session tokens stored in database

3. **Email Verification**
   - Required before account activation
   - Tokens expire after 24 hours
   - Prevents unauthorized registrations

4. **File Upload Security**
   - 50MB file size limit
   - Files stored outside web root
   - User-specific access control

5. **Data Protection**
   - CORS enabled for API safety
   - Input validation on all endpoints
   - SQL injection prevention with prepared statements

## Troubleshooting

### Common Issues

**"Cannot POST /api/auth/register"**
- Backend server not running
- Check if `npm run dev` is executing
- Verify VITE_API_URL in .env.local

**"Email verification failed"**
- Email service not configured
- Check SMTP credentials in .env.local
- Verify email was sent (check spam folder)

**"File upload failed"**
- File size exceeds 50MB limit
- `public/uploads` directory doesn't exist or no write permissions
- Try creating the directory: `mkdir -p public/uploads`

**"Profile changes not saving"**
- Authentication token expired
- User not logged in
- Try logging out and back in

**Database locked error**
- Multiple processes accessing database
- Close all connections and restart
- SQLite has limited concurrent access

## Deployment

### For Production

1. **Update Environment Variables**
   \`\`\`
   NODE_ENV=production
   VITE_API_URL=https://yourdomain.com/api
   JWT_SECRET=generate-secure-key
   \`\`\`

2. **Build the Project**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Deploy to Server**
   - Use pm2 or systemd for process management
   - Set up nginx/Apache reverse proxy
   - Configure SSL/TLS certificates
   - Set up automated backups for database

4. **Database Considerations**
   - SQLite suitable for small to medium deployments
   - For larger scale, migrate to PostgreSQL or MySQL
   - Implement regular backup strategy

## Support & Next Steps

- Check BACKEND_SETUP.md for detailed server configuration
- Review the API endpoints documentation
- Test all features in development before production
- Monitor logs for any errors

Firebase has been completely removed. All authentication, storage, and real-time features now use the custom backend.
