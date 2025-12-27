# Tesla Investment Platform

A modern investment platform built with React, Next.js, and TypeScript. Features user authentication, KYC verification, investment plans, and an admin dashboard.

## Features

- **User Authentication**: Secure registration and login with email verification
- **Investment Plans**: Multiple investment tiers with different returns and terms
- **KYC Verification**: Document upload and verification system
- **Dashboard**: User dashboard with portfolio tracking and investment history
- **Admin Panel**: Comprehensive admin interface for user and KYC management
- **Real-time Data**: Live cryptocurrency prices and market data
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Express.js, Node.js (deployed separately)
- **Database**: SQLite (backend)
- **Authentication**: JWT tokens
- **File Upload**: Multer for document uploads

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

```env
VITE_API_URL=https://tesla-backend-ipk1.onrender.com
```

See `.env.example` for more configuration options.

## Building for Production

```bash
npm run build
npm run preview
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## Project Structure

```
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API clients
├── app/                # Next.js app directory
├── public/             # Static assets
├── types.ts            # TypeScript type definitions
├── constants.tsx       # Application constants
└── App.tsx             # Main App component
```

## Key Components

- **Auth**: User registration and login
- **Dashboard**: User investment dashboard
- **AdminPage**: Admin dashboard for user/KYC management
- **KYCVerification**: Document verification flow
- **InvestmentPlans**: Investment plan listings
- **Calculator**: Investment return calculator

## API Integration

The app connects to a backend API deployed at: `https://tesla-backend-ipk1.onrender.com`

All API calls are automatically routed through the configured backend URL via the `lib/api.ts` client.

## Support

For issues or questions, please check:
1. [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment troubleshooting
2. Browser console for error messages
3. Backend logs on the Render dashboard

## License

Private - Tesla Investment Platform
