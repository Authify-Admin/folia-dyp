import { NextResponse } from 'next/server';

// GET all orders
export async function GET() {
  try {
    // In a real application, this would fetch from a database
    return NextResponse.json({ success: true, message: 'Orders API endpoint' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'items', 'totalAmount', 'shippingAddress'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // In a real application, this would save to a database
    const newOrder = {
      id: Date.now().toString(),
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
