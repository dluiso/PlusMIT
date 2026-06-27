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
    <section className="container py-16">
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-cyan-300">Services</p>
      <h1 className="text-5xl font-black">IT services built for resilient operations</h1>
      <div className="grid-auto mt-10">
        {services.docs.map((service) => (
          <a className="surface p-5" href={`/services/${service.slug}`} key={service.id}>
            <h2 className="text-xl font-bold">{service.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{service.shortSummary}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
