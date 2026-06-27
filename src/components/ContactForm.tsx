'use client'

import { FormEvent, useState } from 'react'

export function ContactForm({ formSlug = 'contact' }: { formSlug?: string }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')
    const formData = new FormData(event.currentTarget)
    const payload: Record<string, unknown> = Object.fromEntries(formData.entries())
    payload.consent = formData.get('consent') === 'on'

    const response = await fetch(`/api/forms/${formSlug}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setState('error')
      setMessage(data?.message || 'The form could not be submitted. Please review the fields.')
      return
    }

    setState('success')
    setMessage(data?.message || 'Thank you. Your request was received.')
    event.currentTarget.reset()
  }

  return (
    <form className="surface grid gap-4 p-5" onSubmit={submit}>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="field">
        <span>Name</span>
        <input name="name" required minLength={2} />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" type="tel" />
      </label>
      <label className="field">
        <span>Organization</span>
        <input name="organization" />
      </label>
      <label className="field">
        <span>Requested Service</span>
        <select name="requestedService">
          <option value="">Select a service</option>
          <option>Help Desk and Managed IT Support</option>
          <option>Network Administration</option>
          <option>Cloud Services</option>
          <option>ECM and Laserfiche Automation</option>
          <option>Website or Database Recovery</option>
          <option>Managed Web Hosting</option>
        </select>
      </label>
      <label className="field">
        <span>Message</span>
        <textarea name="message" required minLength={10} rows={5} />
      </label>
      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input name="consent" type="checkbox" required className="mt-1" />
        <span>I consent to PlusMIT using this information to respond to my request.</span>
      </label>
      <button className="button" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending...' : 'Submit Request'}
      </button>
      {message ? (
        <p className={state === 'error' ? 'text-sm text-red-300' : 'text-sm text-emerald-300'}>{message}</p>
      ) : null}
    </form>
  )
}
