import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Query admin by username
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('username', '==', username.trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Don't reveal whether username exists
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();

    // Verify password
    const isValidPassword = await verifyPassword(password, adminData.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    await updateDoc(doc(db, 'admins', adminDoc.id), {
      lastLogin: new Date().toISOString(),
    });

    // Return success with admin data (excluding password)
    return NextResponse.json({
      success: true,
      admin: {
        id: adminDoc.id,
        username: adminData.username,
        role: adminData.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
