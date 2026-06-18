import { NextRequest, NextResponse } from 'next/server';
import { userOperations, orderOperations } from '@/lib/firestore';
import { verifyPassword, validateEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Login request for:', email);

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Normalize first so casing/whitespace differences from signup never
    // lock anyone out, then validate the canonical form.
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Get user by email
    const user = await userOperations.getByEmail(normalizedEmail);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await userOperations.updateLastLogin(user.id);

    // Link any existing orders placed with this email (before account creation)
    const linkedCount = await orderOperations.linkOrdersByEmail(normalizedEmail, user.id);
    if (linkedCount > 0) {
      console.log(`🔗 Linked ${linkedCount} existing order(s) to account on login`);
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ Login successful for:', email);

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
