const defaultCookiePrefix = 'payload'

export const PAYLOAD_COOKIE_PREFIX = process.env.PAYLOAD_COOKIE_PREFIX?.trim() || defaultCookiePrefix
export const PAYLOAD_AUTH_COOKIE = `${PAYLOAD_COOKIE_PREFIX}-token`
