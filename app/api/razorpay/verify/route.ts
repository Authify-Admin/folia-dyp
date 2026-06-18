import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Verify a Razorpay payment signature before the client is allowed to
 * record the order as paid. Razorpay signs `order_id|payment_id` with the
 * key secret (HMAC-SHA256); anything that doesn't match is a forgery or a
 * corrupted callback.
 */
export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const provided = String(razorpay_signature);
    const verified =
      expected.length === provided.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));

    if (!verified) {
      console.error('Razorpay signature verification failed for', razorpay_order_id);
      return NextResponse.json(
        { verified: false, error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { verified: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
