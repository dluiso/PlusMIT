import Link from 'next/link'

export function Footer({
  companyName,
  footerText,
  legalLinks,
  socialLinks,
  publicEmail,
  phoneNumber,
  tagline,
  copyrightText,
}: {
  companyName: string
  footerText?: string
  tagline?: string
  copyrightText?: string
  legalLinks?: { label?: string; url?: string }[]
  socialLinks?: { label?: string; url?: string }[]
  publicEmail?: string
  phoneNumber?: string
}) {
  return (
    <footer className="bg-[#071a35] text-white">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.7fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-3 text-lg font-black">
            <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-ui)] bg-[var(--color-primary)] text-white">+</span>
            {companyName}
          </div>
          <p className="max-w-sm text-sm leading-7 text-blue-100/75">{footerText || tagline}</p>
        </div>
        <div className="grid content-start gap-2 text-sm text-blue-100/80">
          <strong className="mb-2 text-white">Explore</strong>
          <Link href="/">Home</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#industries">Industries</Link>
        </div>
        <div className="grid content-start gap-2 text-sm text-blue-100/80">
          <strong className="mb-2 text-white">Company</strong>
          {publicEmail ? <a href={`mailto:${publicEmail}`}>{publicEmail}</a> : null}
          {phoneNumber ? <a href={`tel:${phoneNumber}`}>{phoneNumber}</a> : null}
          <Link href="/contact">Contact</Link>
          <Link href="/request-assessment">Request Assessment</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <div className="grid content-start gap-2 text-sm text-blue-100/80">
          <strong className="mb-2 text-white">Legal</strong>
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
      <div className="border-t border-white/10 py-5">
        <div className="container flex flex-wrap justify-between gap-3 text-xs text-blue-100/55">
          <span>{copyrightText || `(c) ${new Date().getFullYear()} ${companyName} - Enterprise IT Solutions.`}</span>
          <span>Modern IT operations, secured.</span>
        </div>
      </div>
    </footer>
  )
}
