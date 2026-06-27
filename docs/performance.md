# Performance Notes

The app is built as a production Next.js standalone server behind Docker and a reverse proxy or Cloudflare Tunnel.

Implemented application controls:

- Next.js production build with standalone output.
- Browser source maps disabled in production builds.
- `X-Powered-By` disabled.
- Response compression enabled in Next.js.
- Uploaded media responses use long-lived public cache headers.
- Next Image is configured for AVIF/WebP output and long image optimizer cache TTL.
- Public settings are cached briefly with stale revalidation.
- Analytics and consent client JavaScript only render when analytics is enabled and IDs match expected GA4/GTM formats.

Cloudflare recommendations:

- Enable Brotli.
- Enable HTTP/2 and HTTP/3.
- Cache static assets and uploaded media.
- Keep Rocket Loader disabled for this Next.js/Payload app.
- Use Cloudflare Access for admin/setup routes.
- Add WAF/rate limiting for login, setup, and public form submissions.
- Purge cache after replacing logo, favicon, or public media that must update immediately.

Do not cache authenticated admin/API responses globally. Keep Payload admin and authenticated API responses private.

Recommended Cloudflare cache rules:

1. Cache static assets and uploaded media:

```text
(http.host eq "plusmit.com" and (
  starts_with(http.request.uri.path, "/_next/static/") or
  starts_with(http.request.uri.path, "/api/media/file/") or
  ends_with(http.request.uri.path, ".webp") or
  ends_with(http.request.uri.path, ".avif") or
  ends_with(http.request.uri.path, ".png") or
  ends_with(http.request.uri.path, ".jpg") or
  ends_with(http.request.uri.path, ".jpeg") or
  ends_with(http.request.uri.path, ".gif") or
  ends_with(http.request.uri.path, ".svg") or
  ends_with(http.request.uri.path, ".ico") or
  ends_with(http.request.uri.path, ".css") or
  ends_with(http.request.uri.path, ".js")
))
```

Use "Eligible for cache" with a one-month edge TTL as a conservative starting point.

2. Bypass dynamic app routes:

```text
(http.host eq "plusmit.com" and (
  starts_with(http.request.uri.path, "/admin") or
  starts_with(http.request.uri.path, "/setup") or
  starts_with(http.request.uri.path, "/graphql") or
  (
    starts_with(http.request.uri.path, "/api/")
    and not starts_with(http.request.uri.path, "/api/media/file/")
  )
))
```

Use "Bypass cache". Keep this rule above broader public-page cache rules.
