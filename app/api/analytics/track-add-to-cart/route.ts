import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc, increment } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Initialize analytics if it doesn't exist
    const productData = productDoc.data();
    if (!productData.analytics) {
      await updateDoc(productRef, {
        analytics: {
          clicks: 0,
          addedToCart: 1,
          conversions: 0,
        }
      });
    } else {
      // Increment addedToCart
      await updateDoc(productRef, {
        'analytics.addedToCart': increment(1)
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking add to cart:', error);
    return NextResponse.json(
      { error: 'Failed to track add to cart' },
      { status: 500 }
    );
  }
}
