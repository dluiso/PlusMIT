const securityTxt = [
  'Contact: mailto:admin@plusmit.com',
  'Preferred-Languages: en, es',
  'Canonical: https://plusmit.com/.well-known/security.txt',
  'Policy: https://plusmit.com/privacy-policy',
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
