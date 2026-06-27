# PlusMIT security hardening

This document tracks security controls that are split between the application and Cloudflare/DNS.

## Implemented in the app

- Global security headers include CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Strict-Transport-Security`, and `Cross-Origin-Opener-Policy`.
- Production Payload auth cookies default to `Secure` and `SameSite=Lax`.
- Public media uploads are restricted to configured MIME types and served from `MEDIA_DIR`, outside the Next.js public directory.
- Admin routes are redirected to login before Payload renders protected admin pages when no auth cookie is present.

## Cloudflare and DNS actions

### HSTS

Cloudflare can enforce HSTS at the edge. Enable it only after confirming all active subdomains support HTTPS.

Recommended settings:

- Enable HSTS: on
- Max Age: 12 months
- Apply HSTS policy to subdomains: on, after verifying subdomains
- Preload: off initially
- No-Sniff header: already handled by the app

### CAA records

Add CAA records in Cloudflare DNS to restrict certificate issuance. Since the current certificate is issued by Google Trust Services through Cloudflare, use:

```text
plusmit.com.  CAA 0 issue "pki.goog"
plusmit.com.  CAA 0 issuewild "pki.goog"
plusmit.com.  CAA 0 iodef "mailto:admin@plusmit.com"
```

Use the real monitored security/admin mailbox for `iodef`.

### DNSSEC

DNSSEC is enabled at Cloudflare, but the scan did not see validated DNSSEC. Confirm the DS record from Cloudflare is published at Namecheap:

1. Cloudflare: DNS > Settings > DNSSEC.
2. Copy the DS record values.
3. Namecheap: Domain > Advanced DNS or DNSSEC section.
4. Add the DS record exactly as Cloudflare provides it.
5. Wait for propagation and rescan.

### Cloudflare Email Address Obfuscation

ScanTower flagged `/cdn-cgi/scripts/.../email-decode.min.js` as suspicious. That script is injected by Cloudflare Email Address Obfuscation, not by this repo.

To remove it:

1. Cloudflare dashboard > plusmit.com.
2. Scrape Shield.
3. Disable Email Address Obfuscation.
4. Purge cache and rescan.

### CSP

The app currently uses `script-src 'unsafe-inline'` because Next.js and Payload emit inline runtime scripts. Removing it safely requires a nonce-based CSP implementation across the Next/Payload admin shell. Treat that as a separate hardening phase, tested carefully against the admin login, dashboard, media upload, and frontend pages.
