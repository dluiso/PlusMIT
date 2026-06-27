# Architecture

The app combines Next.js App Router and Payload CMS in one service. Payload owns content, admin authentication, roles, uploads, forms, leads, SEO fields, redirects, globals, and audit logs. Next.js renders public pages from Payload server-side and exposes only narrow public APIs.

## Boundaries

- Private environment variables are read only in server modules.
- Public settings are filtered through `/api/public-settings`.
- CMS globals can contain operational settings, but the frontend receives only explicitly safe fields.
- Marketing copy is seeded into the database and edited in Payload.

## Main Areas

- `src/collections`: Payload collections and access controls.
- `src/globals`: site settings and branding.
- `src/blocks`: flexible page blocks.
- `src/app/(frontend)`: public website routes.
- `src/app/(payload)`: Payload admin and REST API routes.
- `src/app/setup`: first-run setup wizard.
- `src/seed`: starter content process.
