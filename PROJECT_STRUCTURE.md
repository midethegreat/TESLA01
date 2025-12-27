# Tesla Investment Platform - Professional Project Structure

## Project Overview
A full-stack investment platform built with React + Vite frontend and Node.js backend, featuring user authentication, KYC verification, investment plans, and admin management.

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, React Router DOM
- **Backend**: Node.js, Express, TypeScript
- **Database**: JSON-based file system (data/db.json)
- **Email**: Nodemailer with SMTP
- **Authentication**: JWT tokens with bcrypt password hashing

## Directory Structure

```
teslamain/
├── src/
│   ├── components/          # React components
│   │   ├── Auth.tsx        # Authentication flow with 6-digit email verification
│   │   ├── Dashboard.tsx   # Main user dashboard
│   │   ├── AdminDashboard.tsx  # Admin panel
│   │   ├── AdminKYC.tsx    # KYC approval/rejection interface
│   │   ├── AdminUsers.tsx  # User management
│   │   ├── AdminAnalytics.tsx  # Analytics dashboard
│   │   ├── DocumentUpload.tsx  # KYC document upload
│   │   ├── ProfileSettings.tsx # User profile management
│   │   └── ui/             # Reusable UI components
│   │
│   ├── pages/              # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── AccessDeniedPage.tsx
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts      # Authentication hook
│   │   └── use-toast.ts    # Toast notifications
│   │
│   ├── lib/                # Utility libraries
│   │   ├── api.ts          # Frontend API client
│   │   ├── admin-api.ts    # Admin API client
│   │   └── utils.ts        # Helper functions
│   │
│   └── types.ts            # TypeScript type definitions
│
├── server/                 # Backend server
│   ├── index.ts           # Express server with all API routes
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database operations
│   ├── email.tsx          # Email templates (verification, KYC approval/rejection)
│   ├── config.ts          # Server configuration
│   └── utils.ts           # Server utilities
│
├── data/
│   └── db.json            # JSON database file
│
├── public/
│   └── uploads/           # User uploaded files (KYC documents, profile images)
│
├── App.tsx                # Main app with React Router
├── index.tsx              # App entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## Key Features

### Authentication System
- Email + password registration
- 6-digit verification code sent via email (15-minute expiry)
- JWT-based session management
- Secure password hashing with bcrypt

### KYC Verification
- Users upload: Full Name, DOB, ID Type, Front ID, Back ID, Selfie
- Admin review interface with approve/reject buttons
- Email notifications for approval (congratulations) and rejection (with reason)
- KYC warning dismissed after submission
- Profile locked after KYC approval

### Admin Panel
- **Dashboard**: View stats (total users, KYC pending, email verified)
- **Users Tab**: View all users with search functionality
- **KYC Requests Tab**: Review pending KYC submissions with approve/reject actions
- **Analytics Tab**: User statistics and country distribution

### Investment Features
- Multiple investment plans with different returns
- Deposit system with crypto payment (BTC, ETH, USDT)
- Withdrawal system (requires KYC verification)
- Referral system with tracking
- Transaction history

### Notification System
- Real-time notifications stored in database
- Unread notification counter
- Notification types: KYC approval, KYC rejection
- Mark as read functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with 6-digit code
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### KYC
- `POST /api/kyc/submit` - Submit KYC documents
- `GET /api/admin/kyc-requests` - Get pending KYC requests (admin)
- `POST /api/admin/kyc/:userId/approve` - Approve KYC (admin)
- `POST /api/admin/kyc/:userId/reject` - Reject KYC with reason (admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark notification as read

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get analytics data

## Environment Variables

Create a `.env` file:

```env
PORT=5000
VITE_API_URL=http://localhost:5000
JWT_SECRET=your-secret-key-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=noreply@teslainvest.com
APP_URL=http://localhost:3000
```

## Running the Project

### Development
```bash
# Install dependencies
npm install

# Start backend server (port 5000)
npm run server

# Start frontend dev server (port 3000)
npm run dev
```

### Production Build
```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Email verification required for login
- KYC verification for withdrawals
- Admin role-based access control
- CSRF protection ready
- Secure file upload handling

## Database Schema

### User Object
```typescript
{
  id: string
  email: string
  password: string (hashed)
  firstName: string
  lastName: string
  country: string
  emailVerified: boolean
  kycStatus: "none" | "submitted" | "verified" | "rejected"
  kycVerified: boolean
  createdAt: string
  kyc?: {
    fullName: string
    dob: string
    idType: string
    idFront: string
    idBack: string
    selfie: string
    submittedAt: string
    verifiedAt?: string
    verifiedBy?: string
    rejectedAt?: string
    rejectedBy?: string
    rejectionReason?: string
  }
}
```

### Notification Object
```typescript
{
  id: string
  userId: string
  type: "kyc_approved" | "kyc_rejected"
  title: string
  message: string
  read: boolean
  createdAt: string
}
```

## Admin Credentials (Demo)
- **Admin**: admin@example.com / password123
- **SuperAdmin**: superadmin@example.com / password123

**Note**: Change these credentials in production!

## Deployment Checklist
- [ ] Update JWT_SECRET to strong random value
- [ ] Configure SMTP settings for production email service
- [ ] Change default admin credentials
- [ ] Set up proper database (PostgreSQL/MongoDB) instead of JSON
- [ ] Enable HTTPS
- [ ] Set up proper file storage (AWS S3/Cloudinary)
- [ ] Configure CORS for production domains
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring
- [ ] Set up automated backups

## Contributing
This is a professional-grade investment platform. Follow these guidelines:
1. Write TypeScript for type safety
2. Use functional components with hooks
3. Follow the existing folder structure
4. Add proper error handling
5. Test API endpoints before committing
6. Update this documentation for major changes
