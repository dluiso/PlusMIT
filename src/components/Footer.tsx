export function Footer({
  companyName,
  footerText,
  legalLinks,
  socialLinks,
  publicEmail,
  phoneNumber,
  tagline,
}: {
  companyName: string
  footerText?: string
  tagline?: string
  legalLinks?: { label?: string; url?: string }[]
  socialLinks?: { label?: string; url?: string }[]
  publicEmail?: string
  phoneNumber?: string
}) {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] py-10">
      <div className="container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="mb-3 text-lg font-bold">{companyName}</div>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)]">{footerText || tagline}</p>
        </div>
        <div className="grid gap-2 text-sm text-[var(--color-muted)]">
          <strong className="text-[var(--color-text)]">Contact</strong>
          {publicEmail ? <a href={`mailto:${publicEmail}`}>{publicEmail}</a> : null}
          {phoneNumber ? <a href={`tel:${phoneNumber}`}>{phoneNumber}</a> : null}
        </div>
        <div className="grid gap-2 text-sm text-[var(--color-muted)]">
          <strong className="text-[var(--color-text)]">Links</strong>
          {legalLinks?.map((link) => (
            <a key={`${link.label}-${link.url}`} href={link.url || '#'}>
              {link.label}
            </a>
          ))}
          {socialLinks?.map((link) => (
            <a key={`${link.label}-${link.url}`} href={link.url || '#'}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
