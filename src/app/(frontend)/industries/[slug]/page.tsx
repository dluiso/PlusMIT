import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }
type ListItem = { id?: string; text?: string }

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
      <article className="container py-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-cyan-300">Industry</p>
        <h1 className="text-5xl font-black">{industry.name}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">{industry.overview}</p>
        <div className="grid-auto mt-10">
          <div className="surface p-6">
            <h2 className="text-2xl font-bold">Common challenges</h2>
            <ul className="mt-4 grid gap-3 text-slate-300">
              {industry.challenges?.map((item: ListItem) => <li key={item.id || item.text}>• {item.text}</li>)}
            </ul>
          </div>
          <div className="surface p-6">
            <h2 className="text-2xl font-bold">Compliance awareness</h2>
            <p className="mt-4 leading-8 text-slate-300">{industry.complianceConsiderations}</p>
          </div>
        </div>
      </article>
    </>
  )
}
