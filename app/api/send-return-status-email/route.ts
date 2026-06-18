import { NextRequest, NextResponse } from 'next/server';
import { sendReturnStatusEmail } from '@/lib/email';
import type { ReturnRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { returnRequest, status, adminResponse } = body;

    if (!returnRequest || !status || !adminResponse) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: returnRequest, status, or adminResponse' },
        { status: 400 }
      );
    }

    if (!returnRequest.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid return request data: missing customer email' },
        { status: 400 }
      );
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Invalid status: must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    const result = await sendReturnStatusEmail(
      returnRequest as ReturnRequest,
      status,
      adminResponse
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Return ${status} email sent successfully`,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-return-status-email API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
