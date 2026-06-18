import nodemailer from 'nodemailer';
import type { Order, OrderItem, ReturnRequest } from './types';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
};

// Generate order confirmation email HTML
const generateOrderEmailHTML = (order: Order) => {
  const itemsHTML = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.productName}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ₹${item.price.toFixed(2)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Folia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🌿 Folia Plants</h1>
      <p style="margin: 10px 0 0 0; color: #F2EFC7; font-size: 16px;">Thank you for your order!</p>
    </div>

    <!-- Order Confirmation -->
    <div style="padding: 40px 30px;">
      <div style="background-color: #F2EFC7; border-left: 4px solid #A2C14E; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="margin: 0 0 10px 0; color: #315C3B; font-size: 24px;">Order Confirmed!</h2>
        <p style="margin: 0; color: #315C3B; font-size: 16px;">Your order has been successfully placed and is being processed.</p>
      </div>

      <!-- Order Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Order Details</h3>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order ID:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${order.orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Date:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer Name:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${order.customerName}</td>
          </tr>
        </table>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; color: #315C3B; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 12px; text-align: center; color: #315C3B; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; color: #315C3B; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Price</th>
              <th style="padding: 12px; text-align: right; color: #315C3B; font-size: 14px; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 20px 12px 12px 12px; text-align: right; color: #315C3B; font-size: 18px; font-weight: bold;">Total Amount:</td>
              <td style="padding: 20px 12px 12px 12px; text-align: right; color: #A2C14E; font-size: 24px; font-weight: bold;">₹${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Shipping Address</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.6;">
          ${order.shippingAddress}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #315C3B; font-size: 16px;">Need Help?</h4>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have any questions about your order, please contact us at
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #A2C14E; text-decoration: none;">${process.env.EMAIL_USER}</a>
        </p>
      </div>

      <!-- Track Order Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://myfolia.in/track-order" style="display: inline-block; background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Thank you for choosing Folia Plants! 🌱</p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This email was sent to ${order.customerEmail}
      </p>
      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Folia Plants. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate plain text version of email
const generateOrderEmailText = (order: Order) => {
  const itemsText = order.items
    .map(
      (item) =>
        `${item.productName} - Qty: ${item.quantity} - ₹${item.price.toFixed(2)} - Subtotal: ₹${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  return `
FOLIA PLANTS - Order Confirmation

Thank you for your order!

Order Details:
--------------
Order ID: ${order.orderId}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Customer Name: ${order.customerName}

Order Items:
------------
${itemsText}

Total Amount: ₹${order.totalAmount.toFixed(2)}

Shipping Address:
-----------------
${order.shippingAddress}

Need help? Contact us at ${process.env.EMAIL_USER}

Track your order: https://myfolia.in/track-order

Thank you for choosing Folia Plants! 🌱

© ${new Date().getFullYear()} Folia Plants. All rights reserved.
  `;
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order: Order) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Folia Plants" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - ${order.orderId} | Folia Plants`,
      text: generateOrderEmailText(order),
      html: generateOrderEmailHTML(order),
    });

    console.log('✅ Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error };
  }
};

// Generate return request APPROVED email HTML
const generateReturnApprovedEmailHTML = (returnRequest: ReturnRequest, adminResponse: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Request Approved - Folia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🌿 Folia Plants</h1>
      <p style="margin: 10px 0 0 0; color: #F2EFC7; font-size: 16px;">Return Request Update</p>
    </div>

    <!-- Approval Message -->
    <div style="padding: 40px 30px;">
      <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="margin: 0 0 10px 0; color: #15803d; font-size: 24px;">✅ Return Request Approved</h2>
        <p style="margin: 0; color: #166534; font-size: 16px;">We sincerely apologize for any inconvenience caused.</p>
      </div>

      <!-- Return Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Return Details</h3>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Number:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${returnRequest.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Request Date:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${new Date(returnRequest.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer Name:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${returnRequest.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
            <td style="padding: 8px 0; text-align: right; color: #22c55e; font-weight: bold; font-size: 14px;">APPROVED</td>
          </tr>
        </table>
      </div>

      <!-- Admin Response -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Response from Our Team</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.8;">
          ${adminResponse}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #315C3B; font-size: 16px;">Need Further Assistance?</h4>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have any questions about your return request, please don't hesitate to contact us at
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #A2C14E; text-decoration: none;">${process.env.EMAIL_USER}</a>
        </p>
      </div>

      <!-- Track Order Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://myfolia.in/track-order" style="display: inline-block; background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Thank you for your patience and understanding. 🌱</p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This email was sent to ${returnRequest.customerEmail}
      </p>
      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Folia Plants. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate return request REJECTED email HTML
const generateReturnRejectedEmailHTML = (returnRequest: ReturnRequest, adminResponse: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Return Request Update - Folia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🌿 Folia Plants</h1>
      <p style="margin: 10px 0 0 0; color: #F2EFC7; font-size: 16px;">Return Request Update</p>
    </div>

    <!-- Rejection Message -->
    <div style="padding: 40px 30px;">
      <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
        <h2 style="margin: 0 0 10px 0; color: #991b1b; font-size: 24px;">Return Request Status</h2>
        <p style="margin: 0; color: #7f1d1d; font-size: 16px;">We have reviewed your return request.</p>
      </div>

      <!-- Return Details -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Return Details</h3>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Order Number:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${returnRequest.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Request Date:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${new Date(returnRequest.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Customer Name:</td>
            <td style="padding: 8px 0; text-align: right; color: #315C3B; font-weight: bold; font-size: 14px;">${returnRequest.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
            <td style="padding: 8px 0; text-align: right; color: #ef4444; font-weight: bold; font-size: 14px;">NOT APPROVED</td>
          </tr>
        </table>
      </div>

      <!-- Admin Response -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #315C3B; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #A2C14E; padding-bottom: 10px;">Response from Our Team</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.8;">
          ${adminResponse}
        </div>
      </div>

      <!-- Contact Information -->
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #315C3B; font-size: 16px;">Have Questions?</h4>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you would like to discuss this decision or have any questions, please contact us at
          <a href="mailto:${process.env.EMAIL_USER}" style="color: #A2C14E; text-decoration: none;">${process.env.EMAIL_USER}</a>
        </p>
      </div>

      <!-- Track Order Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://myfolia.in/track-order" style="display: inline-block; background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          Track Your Order
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Thank you for choosing Folia Plants! 🌱</p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This email was sent to ${returnRequest.customerEmail}
      </p>
      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Folia Plants. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate plain text version for approved return
const generateReturnApprovedEmailText = (returnRequest: ReturnRequest, adminResponse: string) => {
  return `
FOLIA PLANTS - Return Request Approved

We sincerely apologize for any inconvenience caused.

Return Details:
--------------
Order Number: ${returnRequest.orderNumber}
Request Date: ${new Date(returnRequest.createdAt).toLocaleDateString('en-IN')}
Customer Name: ${returnRequest.customerName}
Status: APPROVED

Response from Our Team:
----------------------
${adminResponse}

Need Further Assistance?
If you have any questions about your return request, please don't hesitate to contact us at ${process.env.EMAIL_USER}

Track your order: https://myfolia.in/track-order

Thank you for your patience and understanding. 🌱

© ${new Date().getFullYear()} Folia Plants. All rights reserved.
  `;
};

// Generate plain text version for rejected return
const generateReturnRejectedEmailText = (returnRequest: ReturnRequest, adminResponse: string) => {
  return `
FOLIA PLANTS - Return Request Update

We have reviewed your return request.

Return Details:
--------------
Order Number: ${returnRequest.orderNumber}
Request Date: ${new Date(returnRequest.createdAt).toLocaleDateString('en-IN')}
Customer Name: ${returnRequest.customerName}
Status: NOT APPROVED

Response from Our Team:
----------------------
${adminResponse}

Have Questions?
If you would like to discuss this decision or have any questions, please contact us at ${process.env.EMAIL_USER}

Track your order: https://myfolia.in/track-order

Thank you for choosing Folia Plants! 🌱

© ${new Date().getFullYear()} Folia Plants. All rights reserved.
  `;
};

// Send return status email (approved or rejected)
export const sendReturnStatusEmail = async (
  returnRequest: ReturnRequest,
  status: 'approved' | 'rejected',
  adminResponse: string
) => {
  try {
    const isApproved = status === 'approved';

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Folia Plants" <${process.env.EMAIL_USER}>`,
      to: returnRequest.customerEmail,
      subject: isApproved
        ? `Sorry for the Discrepancy - Return Request Approved | ${returnRequest.orderNumber}`
        : `Your Return Request Has Been Reviewed | ${returnRequest.orderNumber}`,
      text: isApproved
        ? generateReturnApprovedEmailText(returnRequest, adminResponse)
        : generateReturnRejectedEmailText(returnRequest, adminResponse),
      html: isApproved
        ? generateReturnApprovedEmailHTML(returnRequest, adminResponse)
        : generateReturnRejectedEmailHTML(returnRequest, adminResponse),
    });

    console.log(`✅ Return ${status} email sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error sending return ${status} email:`, error);
    return { success: false, error };
  }
};
