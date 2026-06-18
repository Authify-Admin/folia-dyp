import { NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const adminStatus = await isAdmin();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated', isAdmin: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      isAdmin: adminStatus,
      user: adminStatus ? {
        id: user.id,
        email: user.email,
        name: user.name,
      } : null,
    });
  } catch (error: any) {
    console.error('❌ Admin verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify admin status', isAdmin: false },
      { status: 500 }
    );
  }
}
