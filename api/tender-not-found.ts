export const config = { runtime: 'edge' };
export default function handler() {
  return new Response('<!doctype html><html lang="en-GB"><head><title>Page not found | LionTech</title><meta name="robots" content="noindex,follow"></head><body><h1>Page not found</h1><p>This tender page is not available.</p><a href="/">Return to LionTech</a></body></html>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex,follow', 'X-Content-Type-Options': 'nosniff' } });
}
