export function Footer({
  companyName,
  footerText,
  legalLinks,
  socialLinks,
  publicEmail,
  phoneNumber,
}: {
  companyName: string
  footerText?: string
  legalLinks?: { label?: string; url?: string }[]
  socialLinks?: { label?: string; url?: string }[]
  publicEmail?: string
  phoneNumber?: string
}) {
  return (
    <footer className="mt-20 border-t border-white/10 py-10">
      <div className="container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="mb-3 text-lg font-bold">{companyName}</div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            {footerText ||
              'Modern IT support, cloud, automation, web implementation, hosting, and recovery services for organizations that need dependable technology operations.'}
          </p>
        </div>
        <div className="grid gap-2 text-sm text-slate-300">
          <strong className="text-slate-100">Contact</strong>
          {publicEmail ? <a href={`mailto:${publicEmail}`}>{publicEmail}</a> : null}
          {phoneNumber ? <a href={`tel:${phoneNumber}`}>{phoneNumber}</a> : null}
        </div>
        <div className="grid gap-2 text-sm text-slate-300">
          <strong className="text-slate-100">Links</strong>
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
