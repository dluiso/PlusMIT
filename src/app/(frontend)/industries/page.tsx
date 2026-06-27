import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata({ title: 'Industries', seo: { description: 'Industry-focused PlusMIT services.' } })
}

export default async function IndustriesIndex() {
  const payload = await getPayloadClient()
  const industries = await payload.find({ collection: 'industries', where: { status: { equals: 'published' } }, sort: 'name', limit: 50 })

  return (
    <section className="container py-16">
      <p className="mb-3 text-sm font-bold uppercase tracking-wider text-cyan-300">Industries</p>
      <h1 className="text-5xl font-black">Support for public, regulated, and growing organizations</h1>
      <div className="grid-auto mt-10">
        {industries.docs.map((industry) => (
          <a className="surface p-5" href={`/industries/${industry.slug}`} key={industry.id}>
            <h2 className="text-xl font-bold">{industry.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{industry.overview}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
