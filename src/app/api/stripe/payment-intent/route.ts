import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key_here')) {
      console.error('Stripe secret key is not configured properly');
      return NextResponse.json(
        { error: 'Stripe is not configured properly. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const { amount, currency = 'eur', items = [], discountCode = null } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Prepare metadata with order items (Stripe metadata values must be strings, max 500 chars each)
    const metadata: Record<string, string> = {};

    // Store each item's essential data in metadata
    items.forEach((item: { name: string; price: number; quantity: number; image: string; nfcUrl: string }, index: number) => {
      metadata[`item_${index}_name`] = item.name || '';
      metadata[`item_${index}_price`] = String(item.price || 0);
      metadata[`item_${index}_quantity`] = String(item.quantity || 1);
      metadata[`item_${index}_image`] = (item.image || '').substring(0, 500);
      metadata[`item_${index}_nfcUrl`] = (item.nfcUrl || '').substring(0, 500);
    });
    metadata['item_count'] = String(items.length);
    if (discountCode) {
      metadata['discount_code'] = discountCode;
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Payment setup failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}