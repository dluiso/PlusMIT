const contactEmail = process.env.SECURITY_CONTACT_EMAIL || 'admin@plusmit.com'
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://plusmit.com').replace(/\/$/, '')

const securityTxt = [
  `Contact: mailto:${contactEmail}`,
  'Preferred-Languages: en, es',
  `Canonical: ${siteUrl}/.well-known/security.txt`,
  `Policy: ${siteUrl}/privacy-policy`,
  '',
].join('\n')

export function GET() {
  return new Response(securityTxt, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
