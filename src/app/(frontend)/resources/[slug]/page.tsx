import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'posts', where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] }, limit: 1 })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args) {
  const { slug } = await params
  return buildMetadata(await getPost(slug))
}

export default async function ResourcePage({ params }: Args) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  return (
    <article className="container max-w-3xl py-16">
      <h1 className="text-5xl font-black">{post.title}</h1>
      <p className="mt-5 text-xl text-slate-300">{post.excerpt}</p>
      <div className="surface mt-10 whitespace-pre-line p-6 leading-8 text-slate-300">{post.content}</div>
    </article>
  )
}
