import { NextRequest, NextResponse } from 'next/server';
import { userOperations, orderOperations } from '@/lib/firestore';
import { hashPassword, validatePassword, validateEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    console.log('📝 Signup request for:', email);

    // Validate inputs
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Store one canonical form so login (also normalized) always matches,
    // and validate that canonical form.
    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userOperations.getByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = await userOperations.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    // Get the created user (without password)
    const user = await userOperations.getById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Link any existing orders placed with this email (before account creation)
    const linkedCount = await orderOperations.linkOrdersByEmail(normalizedEmail, userId);
    if (linkedCount > 0) {
      console.log(`🔗 Linked ${linkedCount} existing order(s) to new account`);
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log('✅ User created successfully:', userId);

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Account created successfully',
    });
  } catch (error: any) {
    console.error('❌ Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
