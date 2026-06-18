# Razorpay Payment Gateway Setup Guide

This guide will help you integrate Razorpay payment gateway into your Folia e-commerce application.

## Step 1: Create a Razorpay Account

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your Razorpay account
3. Complete the KYC verification (required for live payments)

## Step 2: Get Your API Keys

### For Testing (Recommended to start with)

1. In Razorpay Dashboard, make sure you're in **Test Mode** (toggle on top-left)
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys** if you don't have them already
4. You'll see two keys:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Show" to reveal)
5. **Copy both keys** - you'll need them in the next step

### For Production (After testing)

1. Switch to **Live Mode** in Razorpay Dashboard
2. Complete your business verification
3. Go to **Settings** → **API Keys**
4. Generate Live Keys (starts with `rzp_live_`)

## Step 3: Add Your API Keys to .env.local

1. Open the `.env.local` file in your project root
2. Find these two lines:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

3. Replace with your actual Razorpay keys:

**For Test Mode:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_aBcDeFgHiJkLmN
RAZORPAY_KEY_SECRET=XyZ123456789aBcDeFgHiJkLmN
```

**For Live Mode:**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_aBcDeFgHiJkLmN
RAZORPAY_KEY_SECRET=XyZ123456789aBcDeFgHiJkLmN
```

**Example (with test keys):**
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
RAZORPAY_KEY_SECRET=abcdefghijklmnop1234567890
```

## Step 4: Restart Your Development Server

**IMPORTANT:** Environment variables are only loaded when the server starts.

1. Stop your current dev server (press `Ctrl+C` in terminal)
2. Restart it:

```bash
npm run dev
```

## Step 5: Test the Payment Flow

### Using Test Cards (Test Mode Only)

Razorpay provides test card numbers that you can use:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Failed Payment:**
- Card Number: `4111 1111 1111 1234`
- This will simulate a payment failure

### Testing Steps:

1. Go to your website: `http://localhost:3000`
2. Add products to cart
3. Go to checkout: `http://localhost:3000/checkout`
4. Fill in customer details
5. Select **Online Payment** method
6. Click **Pay ₹XXX.XX** button
7. Razorpay checkout modal will open
8. Select payment method:
   - **Card**: Use test card numbers above
   - **UPI**: Use `success@razorpay` (test mode)
   - **Net Banking**: Select any bank and it will succeed
   - **Wallets**: All wallets work in test mode
9. Complete the payment
10. You should see "Order Placed Successfully!" screen
11. Check Firebase Firestore - order should have status `completed`

### Testing Cash on Delivery:

1. Go to checkout
2. Select **Cash on Delivery** method
3. Click **Place Order**
4. Order will be created with status `pending`

## Step 6: Verify in Razorpay Dashboard

1. Go to Razorpay Dashboard
2. Navigate to **Transactions** → **Payments**
3. You should see your test payment listed
4. Click on it to see payment details

## Payment Flow Explained

### Online Payment (Razorpay):
1. User fills checkout form
2. Selects "Online Payment" method
3. Clicks "Pay" button
4. API creates Razorpay order (`/api/razorpay`)
5. Razorpay checkout modal opens
6. User completes payment
7. On success, order created in Firestore with status `completed`
8. Product inventory is reduced
9. Cart is cleared

### Cash on Delivery:
1. User fills checkout form
2. Selects "Cash on Delivery" method
3. Clicks "Place Order"
4. Order created in Firestore with status `pending`
5. Product inventory is reduced
6. Cart is cleared
7. Admin can update status to `completed` after delivery

## Supported Payment Methods

### Online Payment (via Razorpay):
- **Credit/Debit Cards**: Visa, Mastercard, Rupay, Amex
- **UPI**: Google Pay, PhonePe, Paytm, BHIM
- **Net Banking**: All major Indian banks
- **Wallets**: Paytm, PhonePe, Mobikwik, Freecharge
- **EMI**: Available on eligible cards

### Offline Payment:
- **Cash on Delivery**: Pay when you receive

## Important Notes

### Security:
- **NEVER commit `.env.local` to Git** - it's already in `.gitignore`
- **NEVER expose `RAZORPAY_KEY_SECRET`** - it's only used server-side
- Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the client (safe)

### Test vs Live Mode:
- **Test Mode**: Use test keys, no real money is charged
- **Live Mode**: Real transactions, requires business verification
- Always test thoroughly in Test Mode before going live

### Going Live Checklist:
- [ ] Complete Razorpay KYC verification
- [ ] Add business bank account details
- [ ] Test all payment methods in Test Mode
- [ ] Replace test keys with live keys in `.env.local`
- [ ] Restart server after updating keys
- [ ] Do a small test transaction with live keys
- [ ] Set up webhook for payment status updates (advanced)

## Troubleshooting

### Error: "Razorpay is not defined"
**Solution:** Make sure you restarted the dev server after adding keys

### Error: "Invalid key_id or key_secret"
**Solution:**
- Verify you copied the keys correctly from Razorpay Dashboard
- Make sure there are no extra spaces
- Test mode keys start with `rzp_test_`
- Live mode keys start with `rzp_live_`

### Error: "Failed to create Razorpay order"
**Solution:**
- Check if both environment variables are set correctly
- Check server console logs for detailed error
- Verify your Razorpay account is active

### Payment modal doesn't open
**Solution:**
- Check browser console for errors
- Make sure Razorpay script is loaded (check Network tab)
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly

### Payment succeeds but order not created
**Solution:**
- Check browser console for errors
- Verify Firebase Firestore permissions
- Check that `orderOperations.create()` is working

## Webhook Setup (Optional - Advanced)

For production, you should set up webhooks to handle payment status updates:

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `payment.authorized`, `payment.failed`, `payment.captured`
4. Save webhook secret
5. Create `/app/api/razorpay/webhook/route.ts` to handle webhook events

## Razorpay Fees

- **Domestic Cards**: 2% per transaction
- **International Cards**: 3% per transaction
- **UPI**: 2% per transaction
- **Net Banking**: 2% per transaction
- **Wallets**: 2% per transaction

Check latest pricing: https://razorpay.com/pricing/

## Support and Documentation

- Razorpay Docs: https://razorpay.com/docs/
- Payment Gateway Integration: https://razorpay.com/docs/payment-gateway/web-integration/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Support: https://razorpay.com/support/

## Quick Reference

### Where to Add Your Keys:
**File:** `.env.local` (in project root)

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

### After Adding Keys:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Test Payment:
- URL: `http://localhost:3000/checkout`
- Test Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`

---

**You're all set!** Start testing your payment integration. 🎉
