# Email Order Confirmation Setup Guide

## Overview
Your Folia e-commerce platform now has an automated email system that sends order confirmation emails to customers whenever they place an order.

## What's Included

### ✅ Features
- **Beautiful HTML Email Template** - Professional, branded order confirmation emails
- **Order Details** - Order ID, date, items purchased, quantities, prices
- **Shipping Information** - Customer's shipping address
- **Total Amount** - Clear display of order total
- **Track Order Link** - Direct link for customers to track their order
- **Contact Information** - Help email for customer support
- **Plain Text Fallback** - Text version for email clients that don't support HTML

## Setup Instructions

### Step 1: Get Gmail App Password

Since you're using Gmail, you need to create an **App Password** (not your regular Gmail password):

1. Go to your Google Account: https://myaccount.google.com
2. Select **Security** from the left menu
3. Under "How you sign in to Google," select **2-Step Verification** (enable it if not already enabled)
4. At the bottom, select **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** - Enter "Folia E-commerce"
7. Click **Generate**
8. Google will display a 16-character password - **Copy this password**

### Step 2: Update Your .env File

Open your `.env` file and update the email configuration:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Paste the 16-character app password here
EMAIL_FROM=Folia Plants <your-actual-email@gmail.com>
```

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=foliaplantsshop@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=Folia Plants <foliaplantsshop@gmail.com>
```

### Step 3: Restart Development Server

After updating the `.env` file:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

## Testing the Email System

### Test with a Real Order

1. Go to your products page: `http://localhost:3002/products`
2. Add a product to cart
3. Go to checkout: `http://localhost:3002/checkout`
4. Fill in the form with **your real email address**
5. Complete the order
6. Check your email inbox for the order confirmation

### Check Console Logs

The system logs email status in the console:

- `✅ Order confirmation email sent successfully` - Email sent
- `⚠️ Failed to send order confirmation email` - Email failed (but order was created)
- `📧 Sending order confirmation email to: [email]` - Sending attempt

## Email Template Preview

The email includes:

```
🌿 Folia Plants
Thank you for your order!

Order Confirmed!
Your order has been successfully placed and is being processed.

Order Details
━━━━━━━━━━━━━━━━
Order ID: ORD-1234567890
Order Date: November 25, 2024
Customer Name: John Doe

Order Items
━━━━━━━━━━━━━━━━
[Product Name]     Qty: 2     ₹500.00     ₹1000.00
[Product Name]     Qty: 1     ₹300.00     ₹300.00

Total Amount: ₹1300.00

Shipping Address
━━━━━━━━━━━━━━━━
[Full shipping address]

[Track Your Order Button]
```

## Files Created

1. **`/lib/email.ts`** - Email service with nodemailer configuration and email templates
2. **`/app/api/send-order-email/route.ts`** - API endpoint for sending emails
3. **Updated `/app/checkout/page.tsx`** - Integrated email sending after order creation
4. **Updated `.env`** - Added email configuration variables

## Troubleshooting

### Email Not Sending

1. **Check .env file** - Make sure all email variables are set correctly
2. **Verify App Password** - Make sure you're using the App Password, not your regular Gmail password
3. **Check Console** - Look for error messages in the terminal/console
4. **Gmail Security** - Ensure 2-Step Verification is enabled on your Google account

### Common Errors

**Error: "Invalid login"**
- ✅ Solution: Use App Password, not regular password

**Error: "Connection timeout"**
- ✅ Solution: Check your internet connection and firewall settings

**Error: "Recipient address rejected"**
- ✅ Solution: Verify the customer email address is valid

### Test Email Configuration

You can test if your email configuration works by checking the console when the server starts. It will show:
- `✅ Email server is ready to send messages` - Configuration is correct
- `❌ Email server error:` - Configuration has issues

## Important Notes

1. **Order Still Created on Email Failure**: If the email fails to send, the order is still created successfully. This prevents losing orders due to email issues.

2. **Email is Asynchronous**: The email is sent after the order is created, so the customer doesn't have to wait for the email to be sent.

3. **Production Considerations**:
   - For production, consider using a dedicated email service (SendGrid, Mailgun, AWS SES)
   - Gmail has sending limits (500 emails/day for free accounts)
   - Store email logs for debugging

4. **Customize the Email**:
   - Edit `/lib/email.ts` to customize the email template
   - Change colors, add your logo, modify text

## Using Other Email Providers

### SendGrid (Recommended for Production)

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=Folia Plants <noreply@yourdomain.com>
```

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=Folia Plants <your-email@outlook.com>
```

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify your `.env` file configuration
3. Ensure your Gmail App Password is correct
4. Test with a simple test order

---

**Ready to test?** Update your `.env` file with your actual Gmail credentials and place a test order! 🚀
