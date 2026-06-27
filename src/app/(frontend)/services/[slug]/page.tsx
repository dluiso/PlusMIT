import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }
type ListItem = { id?: string | null; text?: string }

async function getService(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getService(slug))
}

export default async function ServicePage({ params }: Args) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: service.name, href: `/services/${slug}` }]} />
      <article className="section-block section-block--white">
        <div className="container py-12">
          <p className="section-eyebrow">Service</p>
          <h1 className="section-title max-w-4xl">{service.heroTitle || service.name}</h1>
          <p className="section-summary mt-6 max-w-3xl">{service.heroSubtitle || service.shortSummary}</p>
          <div className="grid gap-6 py-12 md:grid-cols-[1.2fr_0.8fr]">
            <div className="modern-card">
              <h2 className="text-2xl font-bold">How PlusMIT helps</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-[var(--color-muted)]">{service.longDescription}</p>
            </div>
            <div className="modern-card">
              <h2 className="text-2xl font-bold">Deliverables</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-[var(--color-muted)]">
                {service.deliverables?.map((item: ListItem) => <li key={item.id || item.text}>{item.text}</li>)}
              </ul>
            </div>
          </div>
          <div className="modern-card-grid">
            <div className="modern-card">
              <h2 className="text-2xl font-bold">Benefits</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-[var(--color-muted)]">
                {service.benefits?.map((item: ListItem) => <li key={item.id || item.text}>{item.text}</li>)}
              </ul>
            </div>
            <div className="modern-card">
              <h2 className="text-2xl font-bold">Technologies</h2>
              <ul className="mt-4 grid list-disc gap-3 pl-5 text-[var(--color-muted)]">
                {service.technologiesUsed?.map((item: ListItem) => <li key={item.id || item.text}>{item.text}</li>)}
              </ul>
            </div>
          </div>
          {service.cta?.url ? (
            <a className="button mt-10" href={service.cta.url}>
              {service.cta.label || 'Request Assessment'}
            </a>
          ) : null}
        </div>
      </article>
    </>
  )
}
