import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }
type ListItem = { id?: string | null; text?: string }

async function getIndustry(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'industries',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getIndustry(slug))
}

export default async function IndustryPage({ params }: Args) {
  const { slug } = await params
  const industry = await getIndustry(slug)
  if (!industry) notFound()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: industry.name, href: `/industries/${slug}` }]} />
      <article className="section-block section-block--soft">
        <div className="container py-12">
          <p className="section-eyebrow">Industry</p>
          <h1 className="section-title max-w-4xl">{industry.name}</h1>
          <p className="section-summary mt-6 max-w-3xl">{industry.overview}</p>
          <div className="modern-card-grid mt-10">
            <div className="modern-card">
              <h2 className="text-2xl font-bold">Common challenges</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-[var(--color-muted)]">
                {industry.challenges?.map((item: ListItem) => <li key={item.id || item.text}>{item.text}</li>)}
              </ul>
            </div>
            <div className="modern-card">
              <h2 className="text-2xl font-bold">Compliance awareness</h2>
              <p className="mt-4 leading-8 text-[var(--color-muted)]">{industry.complianceConsiderations}</p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
