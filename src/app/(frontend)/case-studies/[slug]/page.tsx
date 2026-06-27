import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }

async function getStudy(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'case-studies', where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] }, limit: 1 })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getStudy(slug))
}

export default async function CaseStudyPage({ params }: Args) {
  const { slug } = await params
  const study = await getStudy(slug)
  if (!study) notFound()
  return (
    <article className="container py-16">
      <h1 className="text-5xl font-black">{study.title}</h1>
      <div className="grid gap-6 py-10 md:grid-cols-3">
        <section className="surface p-6"><h2 className="text-xl font-bold">Challenge</h2><p className="mt-3 leading-7 text-[var(--color-muted)]">{study.challenge}</p></section>
        <section className="surface p-6"><h2 className="text-xl font-bold">Solution</h2><p className="mt-3 leading-7 text-[var(--color-muted)]">{study.solution}</p></section>
        <section className="surface p-6"><h2 className="text-xl font-bold">Results</h2><p className="mt-3 leading-7 text-[var(--color-muted)]">{study.results}</p></section>
      </div>
    </article>
  )
}
