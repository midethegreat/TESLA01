# Tesla Investment Platform - Backend Setup

This document explains how to set up and run the backend server for the Tesla Investment Platform.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:5000

# SMTP Configuration (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

SENDER_EMAIL=noreply@teslainvestment.com
APP_URL=http://localhost:3000

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-key-change-in-production
```

## Running the Server

### Development Mode

```bash
npm run dev
```

This starts both the frontend (Vite) and backend server.

### Production Build

```bash
npm run build
npm run preview
```

## Database

The backend uses SQLite with the following tables:

- **users** - User accounts with email verification status
- **email_tokens** - Email verification tokens
- **documents** - Uploaded documents (PDF, Word, etc.)
- **profile_images** - User profile pictures
- **sessions** - User session tokens
- **user_updates** - Real-time notifications and updates

The database file is stored at `data/tesla.db` and is created automatically on first run.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/verify-email` - Verify email with token
- `GET /api/auth/me` - Get current authenticated user

### Documents
- `POST /api/documents/upload` - Upload a document (requires auth)
- `GET /api/documents` - Get user's documents (requires auth)
- `DELETE /api/documents/:id` - Delete a document (requires auth)

### Profile
- `POST /api/profile/image` - Upload profile image (requires auth)
- `GET /api/profile/image` - Get user's profile image (requires auth)
- `PUT /api/profile` - Update profile information (requires auth)

### Admin
- `GET /api/admin/uploads` - Get all uploaded documents (requires auth)
- `GET /api/admin/users` - Get all registered users (requires auth)

### Real-time
- `GET /api/updates` - Get user updates (requires auth)

## File Storage

Uploaded files are stored in the `public/uploads` directory. The server serves them as static files.

## Email Verification

Users receive a verification email after registration. The email contains a verification code that must be entered to activate the account.

To use Gmail for sending emails:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password from Google Account Security settings
3. Use the App Password in the `SMTP_PASS` environment variable

## Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT-based authentication
- HTTP-only session tokens
- Input validation and sanitization
- CORS configuration for API safety
- Email verification requirement before login

## Data Persistence

- User data persists in SQLite database
- Profile changes are saved automatically
- Session tokens are stored and validated
- File uploads are stored on disk

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, the server will fail to start. Either:
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`
- Change the PORT in the environment variables

### Email Not Sending
- Check SMTP credentials in .env.local
- Verify Gmail has App Password enabled
- Check firewall/network settings

### Database Issues
- Delete `data/tesla.db` to reset the database
- The database will be recreated on next server start
- Ensure `data/` directory has write permissions

## Deployment

For production deployment:
1. Update environment variables with production values
2. Generate a secure JWT_SECRET
3. Configure SMTP for production email service
4. Set VITE_API_URL to production domain
5. Use a production database if needed (easy migration from SQLite)
