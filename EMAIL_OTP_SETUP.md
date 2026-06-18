# Email OTP Authentication Setup Guide

This guide will help you set up secure email-based OTP (One-Time Password) authentication for your Folia e-commerce application using Resend.

## What is Email OTP Authentication?

Email OTP is a passwordless authentication method that:
- ✅ **More Secure**: No passwords to steal or forget
- ✅ **Better UX**: Users don't need to remember passwords
- ✅ **Email Verified**: Automatically verifies user's email address
- ✅ **Modern**: Used by many modern apps like Slack, Notion

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **Sign Up** and create a free account
3. Verify your email address
4. Complete the onboarding process

### Resend Free Tier:
- ✅ 3,000 emails per month (free forever)
- ✅ 100 emails per day
- ✅ Perfect for testing and small applications

## Step 2: Get Your Resend API Key

1. Log in to [Resend Dashboard](https://resend.com/overview)
2. Click on **API Keys** in the left sidebar
3. Click **Create API Key** button
4. Give it a name (e.g., "Folia Production" or "Folia Development")
5. Select **Full Access** permission
6. Click **Add**
7. **Copy the API key** - you won't be able to see it again!

The API key will look like: `re_123abc456def789ghi012jkl345mno678`

## Step 3: Add API Key to Your Project

1. Open `.env.local` file in your project root
2. Find this line:

```env
RESEND_API_KEY=your_resend_api_key_here
```

3. Replace with your actual Resend API key:

```env
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
```

**Example:**
```env
RESEND_API_KEY=re_abcdef1234567890abcdef1234567890
```

**Important:**
- ⚠️ Never commit this key to Git (`.env.local` is already in `.gitignore`)
- ⚠️ Keep this key secret - anyone with it can send emails on your behalf

## Step 4: Configure Email Domain (Optional but Recommended)

By default, emails will be sent from `onboarding@resend.dev`. For production, you should use your own domain.

### Add Your Domain to Resend:

1. Go to **Domains** in Resend Dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `folia.com`)
4. Follow the DNS setup instructions
5. Add the DNS records to your domain provider
6. Wait for verification (usually takes a few minutes)

### Update Email Sender in Code:

Once your domain is verified, update the sender email in `/app/api/auth/send-otp/route.ts`:

**Change from:**
```typescript
from: 'Folia <onboarding@resend.dev>',
```

**To:**
```typescript
from: 'Folia <noreply@yourdomain.com>',
```

## Step 5: Restart Your Development Server

**IMPORTANT:** Environment variables are only loaded when the server starts.

```bash
# Stop your current dev server (Ctrl+C in terminal)
npm run dev
```

## Step 6: Test the Authentication Flow

### Testing Login/Signup:

1. Go to your website: `http://localhost:3000`
2. Click **Login** in the header
3. Enter your email address
4. Click **Send Verification Code**
5. Check your email inbox for the OTP code
6. Enter your name (for first-time users)
7. Enter the 6-digit OTP code
8. Click **Verify & Continue**
9. You should be redirected to your profile page

### What to Check:

✅ OTP email arrives in inbox (check spam folder if not)
✅ Email has professional design with Folia branding
✅ OTP code is 6 digits
✅ Code expires after 10 minutes
✅ Can resend code after 60 seconds
✅ Profile shows user information after login
✅ Orders are linked to user account

## How It Works

### Authentication Flow:

```
1. User enters email → Send OTP API called
2. 6-digit OTP generated → Stored in Firestore with 10min expiry
3. Email sent via Resend → User receives OTP
4. User enters OTP + name → Verify OTP API called
5. OTP validated → User created/logged in
6. User redirected to profile → Session stored in localStorage
```

### Security Features:

- 🔒 **OTP Expiry**: Codes expire after 10 minutes
- 🔒 **One-Time Use**: OTPs are marked as used after verification
- 🔒 **Rate Limiting**: 60 second cooldown between resend requests
- 🔒 **Auto Cleanup**: Expired OTPs automatically deleted
- 🔒 **Secure Storage**: OTPs stored in Firestore, never in localStorage

## Files Created/Modified

### New Files:

1. **`/contexts/AuthContext.tsx`**: Authentication state management
2. **`/app/auth/page.tsx`**: Login/signup page with OTP verification
3. **`/app/profile/page.tsx`**: User profile with order history
4. **`/app/api/auth/send-otp/route.ts`**: API to send OTP emails
5. **`/app/api/auth/verify-otp/route.ts`**: API to verify OTP codes

### Modified Files:

1. **`/lib/types.ts`**: Added User and OTPSession types
2. **`/lib/firestore.ts`**: Added user and OTP operations
3. **`/components/layout/Navbar.tsx`**: Shows Profile/Login based on auth state
4. **`/app/checkout/page.tsx`**: Links orders to user accounts
5. **`/app/providers.tsx`**: Added AuthProvider

## Features Implemented

### 1. Passwordless Login
- Users login with email only (no passwords)
- Secure 6-digit OTP sent via email
- Professional email template with branding

### 2. User Profile
- View and edit profile information
- See order history
- Quick statistics (total orders, total spent)
- Logout functionality

### 3. Order Management
- Orders automatically linked to logged-in users
- View all past orders in profile
- Filter by order status
- Pre-fill checkout form with user details

### 4. Navbar Integration
- Shows "Login" button when logged out
- Shows "Profile" button when logged in
- User icon for better UX
- Loading state during auth check

## Email Template Customization

The OTP email has a professional design with:
- Folia branding and gradient header
- Large, easy-to-read OTP code
- 10-minute expiry reminder
- Security notice
- Mobile-responsive design

### To Customize Email Template:

Edit `/app/api/auth/send-otp/route.ts` and modify the HTML in the `html` field.

**Current colors:**
- Primary: `#315C3B` (Dark Green)
- Secondary: `#A2C14E` (Light Green)
- Background: `#f5f5f5` (Light Gray)

## Troubleshooting

### Error: "Failed to send OTP"

**Possible causes:**
1. Invalid Resend API key
2. Free tier email limit reached (3000/month)
3. Network issues

**Solutions:**
- Check API key in `.env.local`
- Verify API key in Resend Dashboard
- Check Resend dashboard for email logs
- Restart dev server after adding API key

### Email Not Received

**Check:**
1. **Spam folder**: OTP emails might be filtered
2. **Email address**: Make sure it's typed correctly
3. **Resend logs**: Check Resend Dashboard > Logs for delivery status
4. **Domain verification**: If using custom domain, ensure DNS is configured

### Error: "Invalid OTP"

**Possible causes:**
1. OTP has expired (10 minutes)
2. Wrong OTP code entered
3. OTP already used

**Solutions:**
- Click "Resend code" to get a new OTP
- Check email for the latest OTP
- Make sure you're entering all 6 digits

### User Not Staying Logged In

**Check:**
- Browser localStorage enabled
- No incognito/private mode
- No browser extensions blocking localStorage

### Orders Not Showing in Profile

**Possible causes:**
1. Orders placed before implementing user auth
2. Email mismatch between order and user account

**Solution:**
The profile page shows orders by both `userId` and `customerEmail`, so old orders should appear if the email matches.

## Production Checklist

Before going live:

- [ ] Set up custom domain in Resend
- [ ] Update sender email from `onboarding@resend.dev` to your domain
- [ ] Test email deliverability with real email addresses
- [ ] Configure SPF, DKIM, and DMARC records for your domain
- [ ] Set up email monitoring in Resend Dashboard
- [ ] Consider upgrading Resend plan if expecting >3000 emails/month
- [ ] Add proper error logging and monitoring
- [ ] Test authentication flow on mobile devices
- [ ] Add terms of service and privacy policy pages

## Firestore Collections

### `users` Collection:
```typescript
{
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}
```

### `otpSessions` Collection:
```typescript
{
  id: string;
  email: string;
  otp: string;  // 6-digit code
  expiresAt: number;  // Unix timestamp
  verified: boolean;
  createdAt: string;
}
```

### `orders` Collection (Updated):
```typescript
{
  id: string;
  orderId: string;
  userId?: string;  // NEW: Links to user account
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}
```

## Security Best Practices

1. **Rate Limiting**: Consider adding rate limiting to prevent abuse
2. **IP Blocking**: Block repeated failed attempts from same IP
3. **Email Verification**: OTP automatically verifies email
4. **Session Management**: Consider adding session expiry
5. **HTTPS Only**: Always use HTTPS in production
6. **Environment Variables**: Never expose API keys client-side
7. **Firestore Rules**: Set up proper security rules

### Recommended Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/update their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }

    // Orders can be read by the user who created them
    match /orders/{orderId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         resource.data.customerEmail == request.auth.token.email);
    }

    // OTP sessions should not be directly readable
    match /otpSessions/{sessionId} {
      allow read, write: if false;  // Only via backend
    }
  }
}
```

## Cost Estimation

### Resend Pricing:
- **Free**: 3,000 emails/month, 100 emails/day
- **Pro**: $20/month for 50,000 emails
- **Enterprise**: Custom pricing

### Typical Usage:
- 1 OTP per login attempt = 1 email
- Average user logins 1-2 times per month
- 1,500 users = ~3,000 emails/month (fits free tier!)

## Support and Resources

- **Resend Docs**: https://resend.com/docs
- **Resend API Reference**: https://resend.com/docs/api-reference
- **Resend Email Templates**: https://resend.com/docs/send-with-react
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction

## Quick Reference

### Environment Variables:
**File:** `.env.local`
```env
RESEND_API_KEY=re_your_api_key_here
```

### Test Authentication:
1. Go to: `http://localhost:3000/auth`
2. Enter email
3. Check inbox for OTP
4. Enter OTP + name
5. Login complete!

### View Profile:
- URL: `http://localhost:3000/profile`
- Shows: User info + order history

---

**You're all set!** Your users can now login securely using email OTP. 🎉
