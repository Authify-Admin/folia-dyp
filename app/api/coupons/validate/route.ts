import { NextRequest, NextResponse } from 'next/server';
import { couponOperations } from '@/lib/firestore';
import { computeDiscount } from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal, customerEmail } = await request.json();

    if (!code || orderTotal === undefined) {
      return NextResponse.json(
        { error: 'Coupon code and order total are required' },
        { status: 400 }
      );
    }

    const validation = await couponOperations.validate(code, orderTotal, customerEmail);

    if (!validation.valid) {
      return NextResponse.json(
        { valid: false, message: validation.message },
        { status: 200 }
      );
    }

    const coupon = validation.coupon!;

    // Shared server-side discount math (lib/pricing.ts) — same source of
    // truth the Razorpay order-creation route uses.
    const discountAmount = computeDiscount(coupon, orderTotal);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
