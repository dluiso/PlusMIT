import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  return buildMetadata({ title: 'Resources' })
}

export default async function ResourcesPage() {
  const payload = await getPayloadClient()
  const posts = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } }, sort: '-publishedDate', limit: 20 })

  return (
    <section className="container py-16">
      <h1 className="text-5xl font-black">Resources</h1>
      <div className="grid-auto mt-10">
        {posts.docs.map((post) => (
          <a className="surface p-5" href={`/resources/${post.slug}`} key={post.id}>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
