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

- Put `/admin` and `/setup` behind Cloudflare Access.
- Use long unique secrets.
- Rotate SMTP and database credentials if exposed.
- Keep Docker host packages updated.
- Back up PostgreSQL and media volumes.
