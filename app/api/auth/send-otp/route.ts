import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { otpOperations } from '@/lib/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('📧 OTP Request received for:', email);

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.error('❌ Resend API key not configured!');
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    console.log('✅ Resend API key found');

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    console.log('🔢 Generated OTP:', otp);
    console.log('⏰ Expires at:', new Date(expiresAt).toLocaleString());

    // Store OTP in Firestore
    try {
      await otpOperations.create({
        email,
        otp,
        expiresAt,
        verified: false,
        createdAt: new Date().toISOString(),
      });
      console.log('✅ OTP stored in Firestore');
    } catch (firestoreError) {
      console.error('❌ Firestore error:', firestoreError);
      return NextResponse.json(
        { error: 'Failed to store OTP. Please check Firestore permissions.' },
        { status: 500 }
      );
    }

    // Send OTP email
    console.log('📤 Sending email via Resend...');
    try {
      const emailResult = await resend.emails.send({
        from: 'Folia <onboarding@resend.dev>',
        to: email,
        subject: 'Your Login Code for Folia',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #315C3B 0%, #A2C14E 100%); padding: 40px 30px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Folia</h1>
                          <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Your Plant Paradise</p>
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 50px 40px;">
                          <h2 style="margin: 0 0 20px 0; color: #315C3B; font-size: 24px; font-weight: 600;">Your Login Code</h2>
                          <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                            Use the code below to complete your login. This code will expire in <strong>10 minutes</strong>.
                          </p>

                          <!-- OTP Box -->
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                            <tr>
                              <td align="center" style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
                                <div style="font-size: 42px; font-weight: 700; letter-spacing: 8px; color: #315C3B; font-family: 'Courier New', monospace;">
                                  ${otp}
                                </div>
                              </td>
                            </tr>
                          </table>

                          <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                            If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f9fa; padding: 30px 40px; border-top: 1px solid #e0e0e0;">
                          <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; line-height: 1.5;">
                            This email was sent by Folia. If you have any questions, please contact our support team.
                          </p>
                          <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px; text-align: center;">
                            © ${new Date().getFullYear()} Folia. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });

      console.log('✅ Email sent successfully!', emailResult);
    } catch (emailError: any) {
      console.error('❌ Email sending error:', emailError);
      console.error('Error details:', JSON.stringify(emailError, null, 2));
      return NextResponse.json(
        {
          error: 'Failed to send email. Please check your Resend API key.',
          details: emailError.message,
        },
        { status: 500 }
      );
    }

    // Clean up expired OTP sessions
    await otpOperations.deleteExpired();

    console.log('✅ OTP process completed successfully');
    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('❌ Send OTP error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        error: 'Failed to send OTP. Please try again.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
