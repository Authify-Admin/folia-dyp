import { NextResponse } from 'next/server';
import { couponOperations } from '@/lib/firestore';

export async function GET() {
  try {
    const allCoupons = await couponOperations.getAll();

    // Filter for active, non-expired coupons that haven't reached usage limit
    const activeCoupons = allCoupons.filter((coupon) => {
      // Must be active
      if (!coupon.isActive) return false;

      // Check expiration
      if (coupon.expiresAt) {
        const expiryDate = new Date(coupon.expiresAt);
        if (expiryDate < new Date()) return false;
      }

      // Check usage limit
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return false;
      }

      return true;
    });

    return NextResponse.json({ coupons: activeCoupons });
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}
