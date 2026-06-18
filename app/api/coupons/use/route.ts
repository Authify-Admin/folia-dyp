import { NextRequest, NextResponse } from 'next/server';
import { couponOperations } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const { couponId } = await request.json();

    if (!couponId) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    await couponOperations.incrementUsage(couponId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing coupon usage:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon usage' },
      { status: 500 }
    );
  }
}
