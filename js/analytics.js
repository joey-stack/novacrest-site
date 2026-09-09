/**
 * NOVACREST HOMES LIMITED — Vercel Web Analytics Integration
 * Native browser ESM safe initialization
 */

if (typeof window !== 'undefined') {
  try {
    import('https://cdn.jsdelivr.net/npm/@vercel/analytics@1.5.0/+esm')
      .then(mod => {
        if (mod && typeof mod.inject === 'function') {
          mod.inject();
          console.log('[Vercel Analytics] Active & tracking.');
        }
      })
      .catch(() => {
        // Fallback to Vercel native insights script
        if (!document.querySelector('script[src*="_vercel/insights"]')) {
          const script = document.createElement('script');
          script.src = '/_vercel/insights/script.js';
          script.defer = true;
          document.head.appendChild(script);
        }
      });
  } catch (err) {
    // Silent catch
  }
}
