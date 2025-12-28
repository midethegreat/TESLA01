# Deployment Guide

Follow these steps to deploy your Next.js investment app to Vercel:

### 1. Repository Setup
- Push your code to a GitHub, GitLab, or Bitbucket repository.
- Ensure all files are in the root directory.

### 2. Vercel Deployment
- Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
- Import your repository.
- **Framework Preset**: Next.js (Automatic).
- **Root Directory**: Leave as `./`.
- Click **"Deploy"**.

### 3. Admin Credentials
- **Email**: `09051435773`
- **Password**: `oluwafolaranmi`
- Access the admin page via the designated route (usually `/admin` or configured hash).

### 4. Verification System
- Verification codes are simulated to be sent to the user's email. Check server logs in the Vercel dashboard to see simulation outputs.

### 5. Profile Uploads
- Fixed profile upload logic to handle FormData correctly in Next.js Route Handlers.
