/**
 * NOVACREST HOMES LIMITED — Vercel Web Analytics Integration
 */

import { inject } from '@vercel/analytics';

try {
  inject();
  console.log('[Vercel Analytics] Tracking initialized successfully.');
} catch (err) {
  // Silent fallback for non-Vercel environment
}
