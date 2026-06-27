import { describe, expect, it } from 'vitest'
import { leadSubmissionSchema } from '../src/lib/forms'
import { rateLimit, readPositiveInt } from '../src/lib/rate-limit'

describe('leadSubmissionSchema', () => {
  it('normalizes email and accepts valid consent', () => {
    const result = leadSubmissionSchema.parse({
      name: 'Test User',
      email: 'USER@EXAMPLE.COM',
      message: 'This is a valid request message.',
      consent: true,
      website: '',
    })

    expect(result.email).toBe('user@example.com')
  })
})

describe('rateLimit', () => {
  it('returns retry metadata after the limit is reached', () => {
    const key = `test-${Date.now()}`

    expect(rateLimit(key, 2, 1000).allowed).toBe(true)
    expect(rateLimit(key, 2, 1000).allowed).toBe(true)

    const limited = rateLimit(key, 2, 1000)
    expect(limited.allowed).toBe(false)
    expect(limited.remaining).toBe(0)
    expect(limited.resetAt).toBeGreaterThan(Date.now())
  })

  it('uses safe fallbacks for invalid positive integers', () => {
    expect(readPositiveInt('12', 8, 1, 20)).toBe(12)
    expect(readPositiveInt('0', 8, 1, 20)).toBe(8)
    expect(readPositiveInt('25', 8, 1, 20)).toBe(8)
    expect(readPositiveInt('nope', 8, 1, 20)).toBe(8)
  })
})
