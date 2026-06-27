import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata({ title: 'Industries', seo: { description: 'Industry-focused PlusMIT services.' } })
}

export default async function IndustriesIndex() {
  const payload = await getPayloadClient()
  const industries = await payload.find({ collection: 'industries', where: { status: { equals: 'published' } }, sort: 'name', limit: 50 })

  return (
    <section className="section-block section-block--soft">
      <div className="container py-16">
      <p className="section-eyebrow">Industries</p>
      <h1 className="section-title max-w-4xl">Support for public, regulated, and growing organizations</h1>
      <div className="modern-card-grid mt-10">
        {industries.docs.map((industry) => (
          <a className="modern-card" href={`/industries/${industry.slug}`} key={industry.id}>
            <span className="card-icon">+</span>
            <h2 className="text-xl font-bold">{industry.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{industry.overview}</p>
          </a>
        ))}
      </div>
      </div>
    </section>
  )
}
