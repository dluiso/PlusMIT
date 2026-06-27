'use client'

import { FormEvent, useState } from 'react'

type FormField = {
  name?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  required?: boolean | null
  options?: { label?: string }[] | null
}

const defaultFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'organization', label: 'Organization', type: 'text' },
  { name: 'requestedService', label: 'Requested Service', type: 'text' },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
]

const requiredSubmissionFields = new Set(['name', 'email', 'message'])

function normalizeFields(fields?: FormField[] | null) {
  const configured = fields?.filter((field) => field.name && field.label) || []
  const merged = configured.length ? [...configured] : [...defaultFields]
  const names = new Set(merged.map((field) => field.name))

  for (const field of defaultFields) {
    if (field.name && requiredSubmissionFields.has(field.name) && !names.has(field.name)) {
      merged.push(field)
    }
  }

  return merged
}

function FieldControl({ field }: { field: FormField }) {
  const name = field.name || ''
  const label = field.label || name
  const required = Boolean(field.required)

  if (field.type === 'textarea') {
    return (
      <label className="field">
        <span>{label}</span>
        <textarea name={name} required={required} minLength={name === 'message' ? 10 : undefined} rows={5} />
      </label>
    )
  }

  if (field.type === 'select') {
    return (
      <label className="field">
        <span>{label}</span>
        <select name={name} required={required}>
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.label}>{option.label}</option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 text-sm text-[var(--color-muted)]">
        <input name={name} type="checkbox" required={required} className="mt-1" />
        <span>{label}</span>
      </label>
    )
  }

  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={field.type || 'text'} required={required} minLength={name === 'name' ? 2 : undefined} />
    </label>
  )
}

export function ContactForm({ fields, formSlug = 'contact' }: { fields?: FormField[] | null; formSlug?: string }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const renderedFields = normalizeFields(fields)

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
      {renderedFields.map((field) => (
        <FieldControl field={field} key={field.name} />
      ))}
      <label className="flex items-start gap-3 text-sm text-[var(--color-muted)]">
        <input name="consent" type="checkbox" required className="mt-1" />
        <span>I consent to this information being used to respond to my request.</span>
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
