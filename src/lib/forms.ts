import { createHash } from 'crypto'
import { z } from 'zod'

export const leadSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180).transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  organization: z.string().trim().max(160).optional().or(z.literal('')),
  industry: z.string().trim().max(120).optional().or(z.literal('')),
  requestedService: z.string().trim().max(180).optional().or(z.literal('')),
  urgency: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional().or(z.literal('')),
  turnstileToken: z.string().optional(),
})

export const hashValue = (value: string) =>
  createHash('sha256').update(`${process.env.CSRF_SECRET || 'dev'}:${value}`).digest('hex')
