const defaultAdminRoute = '/admin'

export function normalizeAdminRoute(value?: string) {
  if (!value) return defaultAdminRoute

  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return defaultAdminRoute

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/g, '') || defaultAdminRoute
}

export const ADMIN_ROUTE = normalizeAdminRoute(process.env.PAYLOAD_ADMIN_ROUTE)

export function adminPath(path = '') {
  if (!path) return ADMIN_ROUTE
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${ADMIN_ROUTE}${normalizedPath}`
}
