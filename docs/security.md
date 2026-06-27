# Security

Security controls are implemented at several layers.

- Secrets remain in `.env` and are never returned through public APIs.
- `/api/public-settings` returns only safe public fields and sanitized CSS tokens.
- Payload roles separate Super Admin, Administrator, Content Manager, SEO Manager, Lead Manager, and Viewer.
- Lead forms use server-side Zod validation, rate limiting, honeypot spam checks, optional Turnstile, and hashed minimal metadata.
- Uploads restrict MIME types and file size.
- Security headers are configured in `next.config.mjs`.
- Setup locks after completion and must only be reset through a trusted server-side recovery procedure.

Operational recommendations:

- Put `/admin*`, `/setup*`, and any future fixed admin route behind Cloudflare Access.
- Keep public endpoints available when needed: `/api/public-settings`, public media files, and public form submissions are required by the website.
- If you change `PAYLOAD_ADMIN_ROUTE`, make the same fixed route change in the Next App Router payload admin folder before deploying. Do not make the admin route editable from the CMS.
- Add Cloudflare WAF/rate limiting for login, setup, and form submission paths.
- Use long unique secrets.
- Rotate SMTP and database credentials if exposed.
- Keep Docker host packages updated.
- Back up PostgreSQL and media volumes.
