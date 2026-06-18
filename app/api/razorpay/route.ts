import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { priceOrder, PricingError } from '@/lib/pricing';

/**
 * Create a Razorpay order.
 *
 * The amount is recomputed server-side from live Firestore prices and the
 * validated coupon — the client sends only WHAT it is buying, never what
 * it costs. (Previously the client posted {amount} verbatim, so any shopper
 * could pay ₹1 for a full cart.)
 */
export async function POST(request: NextRequest) {
  try {
    const { items, couponCode, customerEmail } = await request.json();

    const priced = await priceOrder(items, couponCode, customerEmail);
    if (priced.total <= 0) {
      return NextResponse.json(
        { error: 'Order total must be greater than zero' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(priced.total * 100), // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        subtotal: String(priced.subtotal),
        discount: String(priced.discount),
        couponCode: couponCode || '',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof PricingError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
