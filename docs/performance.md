# Performance Notes

The app is built as a production Next.js standalone server behind Docker and a reverse proxy or Cloudflare Tunnel.

Implemented application controls:

- Next.js production build with standalone output.
- Browser source maps disabled in production builds.
- `X-Powered-By` disabled.
- Response compression enabled in Next.js.
- Uploaded media responses include public cache headers.
- Public settings are cached briefly with stale revalidation.
- Analytics scripts only load when enabled and when IDs match expected GA4/GTM formats.

Cloudflare recommendations:

- Enable Brotli.
- Enable HTTP/2 and HTTP/3.
- Cache static assets and uploaded media.
- Use Cloudflare Access for admin/setup routes.
- Add WAF/rate limiting for login, setup, and public form submissions.
- Purge cache after replacing logo, favicon, or public media that must update immediately.

Do not cache authenticated admin/API responses globally. Keep Payload admin and authenticated API responses private.
