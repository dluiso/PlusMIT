import { describe, expect, it } from 'vitest'
import { leadSubmissionSchema } from '../src/lib/forms'

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
