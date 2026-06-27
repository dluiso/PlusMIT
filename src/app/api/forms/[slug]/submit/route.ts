import { NextRequest, NextResponse } from 'next/server'
import { hashValue, leadSubmissionSchema } from '@/lib/forms'
import { getPayloadClient } from '@/lib/payload'
import { rateLimit, readPositiveInt } from '@/lib/rate-limit'

const formRateLimit = readPositiveInt(process.env.FORM_RATE_LIMIT, 8, 1, 100)
const formRateWindowMs = readPositiveInt(process.env.FORM_RATE_WINDOW_MS, 10 * 60 * 1000, 1000)
const formBodyLimitBytes = readPositiveInt(process.env.FORM_BODY_LIMIT_BYTES, 64 * 1024, 1024, 1024 * 1024)

function getClientIp(request: NextRequest) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

async function readJsonBody(request: NextRequest) {
  const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10)
  if (Number.isFinite(contentLength) && contentLength > formBodyLimitBytes) {
    return { tooLarge: true, json: null }
  }

  const rawBody = await request.text().catch(() => null)
  if (!rawBody) return { tooLarge: false, json: null }
  if (Buffer.byteLength(rawBody, 'utf8') > formBodyLimitBytes) {
    return { tooLarge: true, json: null }
  }

  try {
    return { tooLarge: false, json: JSON.parse(rawBody) as unknown }
  } catch {
    return { tooLarge: false, json: null }
  }
}

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
  const ip = getClientIp(request)

  const limit = rateLimit(`form:${slug}:${ip}`, formRateLimit, formRateWindowMs)
  if (!limit.allowed) {
    const retryAfter = Math.max(Math.ceil((limit.resetAt - Date.now()) / 1000), 1).toString()
    return NextResponse.json(
      { message: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': retryAfter } },
    )
  }

  const { json, tooLarge } = await readJsonBody(request)
  if (tooLarge) {
    return NextResponse.json({ message: 'The submission is too large.' }, { status: 413 })
  }

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
