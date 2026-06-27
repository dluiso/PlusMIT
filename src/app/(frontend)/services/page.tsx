import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata({ title: 'Services', seo: { description: 'PlusMIT IT services and consulting capabilities.' } })
}

export default async function ServicesIndex() {
  const payload = await getPayloadClient()
  const services = await payload.find({
    collection: 'services',
    where: { status: { equals: 'published' } },
    sort: 'name',
    limit: 50,
  })

  return (
    <section className="section-block section-block--white">
      <div className="container py-16">
      <p className="section-eyebrow">Services</p>
      <h1 className="section-title max-w-4xl">IT services built for resilient operations</h1>
      <div className="modern-card-grid mt-10">
        {services.docs.map((service) => (
          <a className="modern-card" href={`/services/${service.slug}`} key={service.id}>
            <span className="card-icon">+</span>
            <h2 className="text-xl font-bold">{service.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{service.shortSummary}</p>
          </a>
        ))}
      </div>
      </div>
    </section>
  )
}
