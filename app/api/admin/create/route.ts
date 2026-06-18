import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('📝 Admin creation request for:', username);

    // Validate inputs
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validate username
    if (username.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('username', '==', username.trim()));
    const existingAdmins = await getDocs(q);

    if (!existingAdmins.empty) {
      return NextResponse.json(
        { error: 'An admin with this username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin document
    const adminData = {
      username: username.trim(),
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    const docRef = await addDoc(adminsRef, adminData);

    console.log('✅ Admin created successfully:', docRef.id);

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: docRef.id,
        username: username.trim(),
        role: 'admin',
      },
    });
  } catch (error: any) {
    console.error('❌ Admin creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account. Please try again.' },
      { status: 500 }
    );
  }
}
