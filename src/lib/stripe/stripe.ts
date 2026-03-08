import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(
  process.env.STRIPE_PUBLISHABLE_KEY!
);