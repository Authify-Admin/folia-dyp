import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';
import type { Order } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();

    if (!order || !order.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      );
    }

    const result = await sendOrderConfirmationEmail(order);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Order confirmation email sent successfully',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-order-email API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
