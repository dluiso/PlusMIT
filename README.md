# PlusMIT Website and CMS

PlusMIT is a production-oriented Next.js and Payload CMS platform for an editable IT services website. Marketing pages, services, industries, navigation, forms, SEO, theme settings, testimonials, case studies, resources, redirects, and public settings are managed from the CMS.

## Stack

- Next.js App Router with TypeScript
- Payload CMS
- PostgreSQL
- Tailwind CSS
- Docker and Docker Compose
- Zod validation

## Local Development

1. Copy `.env.example` to `.env` and fill placeholders, or run `scripts/install.sh` on Linux.
2. Start services:

```bash
docker compose -f docker-compose.dev.yml up
```

3. Open `http://localhost:3000/setup`.
4. Complete first-run setup, then sign in at `/admin`.

On Windows without Docker, install Node.js 24 and PostgreSQL, set `DATABASE_URL`, then run:

```powershell
npm.cmd install
npm.cmd run dev
```

## Production

Use a fresh Debian 12 VM with Docker Compose. The production domain is `https://plusmit.com`.

```bash
git clone https://github.com/dluiso/PlusMIT.git
cd PlusMIT
chmod +x scripts/*.sh
./scripts/install.sh
```

The installer creates a private `.env`, starts Docker Compose, runs migrations, seeds starter content, and prints the setup URL.

Detailed server instructions are in `docs/deployment.md`.

## Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run test
npm run seed
docker compose build
```

## Environment Variables

Private variables such as `DATABASE_URL`, `PAYLOAD_SECRET`, SMTP credentials, and Turnstile secret keys are server-only. Only `NEXT_PUBLIC_*` values may be sent to the browser.

## Setup Wizard

The `/setup` route is available only before setup completion or when no primary admin exists. It creates the first super admin, writes safe public site settings, optionally seeds content, marks setup completed, and redirects to the configured admin route.

To reset setup in development or recovery, update `site-settings.setupCompleted` directly through a trusted server-side Payload script or database console. Do not expose a public reset route.

## Content Rules

Frontend marketing content is loaded from Payload documents. Seed testimonials and case studies are drafts only. Public testimonial rendering is restricted to published testimonials with permission confirmed.

## Verification Checklist

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `docker compose build`
- `/setup` locks after completion
- `/admin` requires authentication and should also be protected by Cloudflare Access in production
- `/api/public-settings` contains no secrets
- Contact forms create lead submissions
- Sitemap and robots render
