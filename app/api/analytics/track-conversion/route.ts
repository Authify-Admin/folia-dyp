import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json();

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    // Track conversion for each product in the order
    const updatePromises = productIds.map(async (productId: string) => {
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        console.warn(`Product ${productId} not found`);
        return;
      }

      // Initialize analytics if it doesn't exist
      const productData = productDoc.data();
      if (!productData.analytics) {
        await updateDoc(productRef, {
          analytics: {
            clicks: 0,
            addedToCart: 0,
            conversions: 1,
          }
        });
      } else {
        // Increment conversions
        await updateDoc(productRef, {
          'analytics.conversions': increment(1)
        });
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}
