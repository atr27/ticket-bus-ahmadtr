# Deployment Guide for Vercel

## Environment Variables Setup

To fix the authentication errors, you need to configure the following environment variables in your Vercel dashboard:

### Required Environment Variables

1. **DATABASE_URL**
   - Your PostgreSQL database connection string
   - Example: `postgresql://username:password@host:port/database`
   - For production, use a service like Neon, Supabase, or PlanetScale

2. **NEXTAUTH_SECRET**
   - A random secret string for NextAuth.js
   - Generate one using: `openssl rand -base64 32`
   - Example: `your-generated-secret-here`

3. **NEXTAUTH_URL**
   - Your production domain URL
   - Set to: `https://ticket-bus-ahmadtr.vercel.app`

4. **NEXT_PUBLIC_APP_URL**
   - Your production domain URL (public)
   - Set to: `https://ticket-bus-ahmadtr.vercel.app`

### Optional Environment Variables

5. **XENDIT_SECRET_KEY**
   - Your Xendit API secret key for payments

6. **XENDIT_WEBHOOK_TOKEN**
   - Your Xendit webhook verification token

## Steps to Configure in Vercel

1. Go to your Vercel dashboard
2. Select your project: `ticket-bus-ahmadtr`
3. Go to Settings → Environment Variables
4. Add each environment variable listed above
5. Redeploy your application

## Database Setup

Make sure your database is properly set up:

1. Create a PostgreSQL database (recommended: Neon, Supabase, or PlanetScale)
2. Run Prisma migrations: `npx prisma migrate deploy`
3. Optionally seed the database: `npx prisma db seed`

## Common Issues and Solutions

### 500 Internal Server Error on /api/auth/session
- **Cause**: Missing NEXTAUTH_SECRET or NEXTAUTH_URL
- **Solution**: Set both environment variables in Vercel

### Database Connection Errors
- **Cause**: Invalid DATABASE_URL or database not accessible
- **Solution**: Verify your database connection string and ensure the database is running

### Authentication Not Working
- **Cause**: Incorrect NEXTAUTH_URL or missing secret
- **Solution**: Ensure NEXTAUTH_URL matches your domain exactly

## Testing After Deployment

1. Visit your deployed app
2. Try to access any protected route
3. Check if authentication flows work properly
4. Monitor Vercel function logs for any remaining errors

## Local Development

For local development, create a `.env.local` file with:

```env
DATABASE_URL="your-local-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
