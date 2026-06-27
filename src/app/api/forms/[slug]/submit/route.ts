import { NextRequest, NextResponse } from 'next/server'
import { hashValue, leadSubmissionSchema } from '@/lib/forms'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'

async function verifyTurnstile(token: string | undefined) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })

  const data = await response.json().catch(() => ({ success: false }))
  return Boolean(data.success)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (!rateLimit(`${slug}:${ip}`)) {
    return NextResponse.json({ message: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  const json = await request.json().catch(() => null)
  const parsed = leadSubmissionSchema.safeParse(json)

  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ message: 'Please review the form fields and try again.' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  const forms = await payload.find({
    collection: 'forms',
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    limit: 1,
  })
  const form = forms.docs[0]

  if (!form) {
    return NextResponse.json({ message: 'This form is not available.' }, { status: 404 })
  }

  if (form.turnstileEnabled && !(await verifyTurnstile(parsed.data.turnstileToken))) {
    return NextResponse.json({ message: 'Spam protection failed. Please try again.' }, { status: 400 })
  }

  await payload.create({
    collection: 'lead-submissions',
    data: {
      formSource: form.id,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || undefined,
      organization: parsed.data.organization || undefined,
      industry: parsed.data.industry || undefined,
      requestedService: parsed.data.requestedService || undefined,
      urgency: parsed.data.urgency || undefined,
      message: parsed.data.message,
      ipHash: hashValue(ip),
      userAgentHash: hashValue(request.headers.get('user-agent') || ''),
      status: 'new',
    },
    overrideAccess: true,
  })

  return NextResponse.json({
    message: form.confirmationMessage || 'Thank you. Your request was received.',
  })
}
