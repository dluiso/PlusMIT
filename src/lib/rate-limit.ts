const hits = new Map<string, { count: number; resetAt: number }>()

export function readPositiveInt(value: string | undefined, fallback: number, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(value || '', 10)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback
  return parsed
}

export function rateLimit(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now()

  if (hits.size > 1000) {
    for (const [hitKey, hit] of hits) {
      if (hit.resetAt < now) hits.delete(hitKey)
    }
  }

  const current = hits.get(key)

  if (!current || current.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: Math.max(limit - 1, 0), resetAt: now + windowMs }
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  return { allowed: true, remaining: Math.max(limit - current.count, 0), resetAt: current.resetAt }
}
