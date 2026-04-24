import Stripe from 'stripe';

// Use a dummy key for build time if STRIPE_SECRET_KEY is not set or is a placeholder
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
const isValidKey = stripeKey.startsWith('sk_test_') || stripeKey.startsWith('sk_live_');
const isPlaceholder = stripeKey.includes('test_key_replace') || stripeKey.includes('dummy');

// For build time, use a minimal valid format that won't trigger GitHub secret detection
const buildTimeKey = 'sk_test_' + '0'.repeat(99);

export const stripe = new Stripe(
  isValidKey && !isPlaceholder ? stripeKey : buildTimeKey,
  {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
  }
);
