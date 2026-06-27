import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container grid min-h-screen place-items-center py-20">
      <div className="surface max-w-xl p-8 text-center">
        <h1 className="text-4xl font-black">Page not found</h1>
        <p className="mt-4 text-[var(--color-muted)]">The requested page is not published or does not exist.</p>
        <Link className="button mt-6" href="/">Return Home</Link>
      </div>
    </main>
  )
}
