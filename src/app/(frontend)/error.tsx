'use client'

import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className="container grid min-h-screen place-items-center py-20">
      <div className="surface max-w-xl p-8 text-center">
        <h1 className="text-4xl font-black">Something went wrong</h1>
        <p className="mt-4 text-[var(--color-muted)]">The request could not be completed. Please try again later.</p>
        <Link className="button mt-6" href="/">Return Home</Link>
      </div>
    </main>
  )
}
