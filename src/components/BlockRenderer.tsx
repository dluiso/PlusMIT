import { ContactForm } from './ContactForm'

type AnyBlock = {
  blockType?: string
  eyebrow?: string
  title?: string
  summary?: string
  body?: string
  primaryCta?: { label?: string; url?: string }
  secondaryCta?: { label?: string; url?: string }
  items?: { title?: string; summary?: string; icon?: string; url?: string }[]
  steps?: { title?: string; summary?: string; text?: string; url?: string }[]
  stats?: { value?: string; label?: string }[]
  technologies?: { text?: string }[]
  form?: { slug?: string } | number
  smartFicheUrl?: string
}

function SectionHeader({ block }: { block: AnyBlock }) {
  return (
    <div className="mb-8 max-w-3xl">
      {block.eyebrow ? <p className="mb-3 text-sm font-bold uppercase tracking-wider text-cyan-300">{block.eyebrow}</p> : null}
      {block.title ? <h2 className="text-3xl font-bold md:text-5xl">{block.title}</h2> : null}
      {block.summary ? <p className="mt-4 text-lg leading-8 text-slate-300">{block.summary}</p> : null}
    </div>
  )
}

function CardGrid({ items }: { items?: AnyBlock['items'] }) {
  return (
    <div className="grid-auto">
      {items?.map((item) => (
        <a className="surface grid min-h-48 gap-3 p-5 transition hover:border-cyan-300/50" href={item.url || '#'} key={`${item.title}-${item.url}`}>
          <span className="text-2xl">{item.icon || '◇'}</span>
          <strong className="text-xl">{item.title}</strong>
          <p className="text-sm leading-6 text-slate-300">{item.summary}</p>
        </a>
      ))}
    </div>
  )
}

export function BlockRenderer({ blocks }: { blocks?: AnyBlock[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        if (block.blockType === 'hero') {
          return (
            <section className="container grid min-h-[74vh] items-center py-16" key={index}>
              <div className="max-w-4xl">
                {block.eyebrow ? <p className="mb-4 text-sm font-bold uppercase tracking-wider text-cyan-300">{block.eyebrow}</p> : null}
                <h1 className="text-5xl font-black leading-tight md:text-7xl">{block.title}</h1>
                {block.summary ? <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">{block.summary}</p> : null}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {block.primaryCta?.url ? <a className="button" href={block.primaryCta.url}>{block.primaryCta.label}</a> : null}
                  {block.secondaryCta?.url ? <a className="button secondary" href={block.secondaryCta.url}>{block.secondaryCta.label}</a> : null}
                </div>
              </div>
            </section>
          )
        }

        if (block.blockType === 'contactForm') {
          const formSlug = typeof block.form === 'object' ? block.form?.slug : 'contact'
          return (
            <section className="container grid gap-8 py-14 md:grid-cols-[1fr_1fr]" key={index}>
              <div>
                <SectionHeader block={block} />
              </div>
              <ContactForm formSlug={formSlug || 'contact'} />
            </section>
          )
        }

        if (block.blockType === 'stats') {
          return (
            <section className="container py-14" key={index}>
              <SectionHeader block={block} />
              <div className="grid-auto">
                {block.stats?.map((stat) => (
                  <div className="surface p-6" key={`${stat.value}-${stat.label}`}>
                    <div className="text-4xl font-black text-cyan-300">{stat.value}</div>
                    <div className="mt-2 text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'richText' || block.blockType === 'securityNotice') {
          return (
            <section className="container py-12" key={index}>
              <div className="surface p-6">
                <SectionHeader block={block} />
                {block.body ? <p className="whitespace-pre-line leading-8 text-slate-300">{block.body}</p> : null}
              </div>
            </section>
          )
        }

        if (block.blockType === 'technologyStack') {
          return (
            <section className="container py-14" key={index}>
              <SectionHeader block={block} />
              <div className="flex flex-wrap gap-3">
                {block.technologies?.map((item) => (
                  <span className="surface px-4 py-2 text-sm font-semibold text-slate-200" key={item.text}>
                    {item.text}
                  </span>
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'ctaBanner' || block.blockType === 'recoveryEmergencyCta') {
          return (
            <section className="container py-14" key={index}>
              <div className="surface grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <SectionHeader block={block} />
                </div>
                {block.primaryCta?.url ? <a className="button" href={block.primaryCta.url}>{block.primaryCta.label}</a> : null}
              </div>
            </section>
          )
        }

        return (
          <section className="container py-14" key={index}>
            <SectionHeader block={block} />
            <CardGrid items={block.items || block.steps} />
          </section>
        )
      })}
    </>
  )
}
