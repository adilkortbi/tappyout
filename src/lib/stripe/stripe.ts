import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (must use NEXT_PUBLIC_ prefix for client-side access)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;