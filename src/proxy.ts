import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_ROUTE, adminPath } from './lib/admin-route'
import { PAYLOAD_AUTH_COOKIE } from './lib/payload-cookie'

const publicAdminPaths = [
  adminPath('/create-first-user'),
  adminPath('/forgot'),
  adminPath('/login'),
  adminPath('/reset'),
  adminPath('/unauthorized'),
  adminPath('/verify'),
]

function isAdminPath(pathname: string) {
  return pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`)
}

function isPublicAdminPath(pathname: string) {
  return publicAdminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isAdminPath(pathname) || isPublicAdminPath(pathname)) {
    return NextResponse.next()
  }

  if (request.cookies.has(PAYLOAD_AUTH_COOKIE)) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = adminPath('/login')
  loginUrl.search = ''
  loginUrl.searchParams.set('redirect', `${pathname}${search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
