# Quick Start: Email OTP Authentication

## ⚡ Get Started in 4 Steps

### Step 1: Get Your Resend API Key (2 minutes)

1. **Sign up**: Go to [https://resend.com](https://resend.com) and create a free account
2. **Navigate**: Click **API Keys** in the sidebar
3. **Create**: Click **Create API Key**
   - Name: "Folia Development"
   - Permission: Full Access
4. **Copy**: Copy the API key (starts with `re_`)

**Free tier includes**: 3,000 emails/month, 100 emails/day

---

### Step 2: Add API Key to Your Project (30 seconds)

1. Open `.env.local` file in your project root
2. Find this line:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```
3. Replace with your actual key:
   ```env
   RESEND_API_KEY=re_abc123xyz456def789ghi012jkl345
   ```
4. Save the file

---

### Step 3: Update Firestore Security Rules (1 minute)

**This is critical!** Without this, you'll get "permission denied" errors.

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: folia-b4710
3. **Click**: Firestore Database > Rules tab
4. **Copy & paste** the rules from [firestore.rules](./firestore.rules) file
   OR see full instructions in [FIRESTORE_RULES_UPDATE.md](./FIRESTORE_RULES_UPDATE.md)
5. **Click**: Publish

---

### Step 4: Restart Your Server (10 seconds)

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

---

## ✅ Test It Out!

1. Go to: `http://localhost:3000`
2. Click **Login** button in header
3. Enter your email address
4. Check your email for the 6-digit OTP code
5. Enter the code (and your name if first time)
6. You're logged in! 🎉

---

## 🎯 What You Get

- **Passwordless Login**: No passwords to remember
- **User Profiles**: Each user has a profile page
- **Order History**: Users can see all their orders
- **Auto Pre-fill**: Checkout forms pre-filled for logged-in users
- **Secure**: OTP expires in 10 minutes, one-time use only

---

## 📚 Need More Details?

See the full documentation:
- **Complete Setup Guide**: [EMAIL_OTP_SETUP.md](./EMAIL_OTP_SETUP.md)
- **Implementation Summary**: [AUTHENTICATION_SUMMARY.md](./AUTHENTICATION_SUMMARY.md)

---

## 🚨 Troubleshooting

**Email not received?**
- Check spam folder
- Verify email address spelling
- Check Resend dashboard logs

**Can't login?**
- Make sure you restarted the dev server
- Check `.env.local` has correct API key
- OTP expires after 10 minutes - request a new one

---

**That's it!** Your authentication system is ready to use. 🚀
