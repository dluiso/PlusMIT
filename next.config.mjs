import { withPayload } from '@payloadcms/next/withPayload'

const isDev = process.env.NODE_ENV !== 'production'
const hsts = 'max-age=31536000'

const csp = [
  "default-src 'self'",
  [
    'script-src',
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://challenges.cloudflare.com',
  ].join(' '),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    'connect-src',
    "'self'",
    ...(isDev ? ['ws:', 'http://localhost:*'] : []),
    'https://www.google-analytics.com',
    'https://region1.google-analytics.com',
    'https://challenges.cloudflare.com',
  ].join(' '),
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  output: 'standalone',
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  typedRoutes: false,
  async headers() {
    return [
      {
        source: '/api/media/file/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: hsts },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
