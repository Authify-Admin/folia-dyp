import { NextRequest, NextResponse } from 'next/server';
import { otpOperations, userOperations } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, name } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Get OTP session from Firestore
    const otpSession = await otpOperations.getByEmail(email);

    if (!otpSession) {
      return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    // Check if OTP is expired
    if (Date.now() > otpSession.expiresAt) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Verify OTP
    if (otpSession.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // Mark OTP as verified
    await otpOperations.markVerified(otpSession.id);

    // Check if user exists
    let user = await userOperations.getByEmail(email);

    if (!user) {
      // Create new user
      if (!name) {
        return NextResponse.json({ error: 'Name is required for new users' }, { status: 400 });
      }

      const userId = await userOperations.create({
        email,
        name,
        // OTP-created accounts have no password; an empty string never
        // matches a bcrypt hash, so password login stays unavailable.
        password: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });

      user = await userOperations.getById(userId);
    } else {
      // Update last login
      await userOperations.updateLastLogin(user.id);
      // Refresh user data
      user = await userOperations.getById(user.id);
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user,
      isNewUser: !user.phone, // Simple check if user has completed profile
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
