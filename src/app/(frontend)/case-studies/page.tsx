import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata({ title: 'Case Studies' })
}

export default async function CaseStudiesPage() {
  const payload = await getPayloadClient()
  const studies = await payload.find({ collection: 'case-studies', where: { status: { equals: 'published' } }, limit: 20 })

  return (
    <section className="container py-16">
      <h1 className="text-5xl font-black">Case Studies</h1>
      <div className="grid-auto mt-10">
        {studies.docs.map((study) => (
          <a className="surface p-5" href={`/case-studies/${study.slug}`} key={study.id}>
            <h2 className="text-xl font-bold">{study.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{study.challenge}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
