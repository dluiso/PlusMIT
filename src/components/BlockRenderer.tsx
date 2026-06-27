import Image from 'next/image'
import { ContactForm } from './ContactForm'
import { getMediaInfo, type MediaValue } from '@/lib/media'

type FormField = {
  name?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox'
  required?: boolean | null
  options?: { label?: string }[] | null
}

type CardItem = {
  title?: string
  summary?: string
  icon?: string
  text?: string
  url?: string
}

type AnyBlock = {
  blockType?: string
  eyebrow?: string
  title?: string
  summary?: string
  body?: string
  primaryCta?: { label?: string; url?: string }
  secondaryCta?: { label?: string; url?: string }
  items?: CardItem[]
  steps?: CardItem[]
  rows?: CardItem[]
  options?: CardItem[]
  stats?: { value?: string; label?: string }[]
  technologies?: { text?: string }[]
  form?: { slug?: string; fields?: FormField[]; confirmationMessage?: string } | number
  image?: MediaValue
  backgroundImage?: MediaValue
  smartFicheUrl?: string
}

function SectionHeader({ block }: { block: AnyBlock }) {
  return (
    <div className="mb-8 max-w-3xl">
      {block.eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
          {block.eyebrow}
        </p>
      ) : null}
      {block.title ? <h2 className="text-3xl font-bold md:text-5xl">{block.title}</h2> : null}
      {block.summary ? <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">{block.summary}</p> : null}
    </div>
  )
}

function CardGrid({ items }: { items?: CardItem[] }) {
  if (!items?.length) return null

  return (
    <div className="grid-auto">
      {items.map((item, index) => (
        <a
          className="surface grid min-h-48 gap-3 p-5 transition hover:border-[var(--color-primary)]"
          href={item.url || '#'}
          key={`${item.title || item.text || 'item'}-${item.url || index}`}
        >
          <span className="text-2xl text-[var(--color-primary)]">{item.icon || '+'}</span>
          <strong className="text-xl">{item.title || item.text}</strong>
          {item.summary ? <p className="text-sm leading-6 text-[var(--color-muted)]">{item.summary}</p> : null}
        </a>
      ))}
    </div>
  )
}

function MediaPanel({ image, priority = false }: { image?: MediaValue; priority?: boolean }) {
  const media = getMediaInfo(image, priority ? 'hero' : 'card')
  if (!media?.url) return null

  return (
    <div className="relative min-h-80 overflow-hidden rounded-[var(--radius-ui)] border border-[var(--color-border)] bg-[var(--color-subtle)]">
      <Image
        alt={media.alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={priority ? '(min-width: 768px) 45vw, 100vw' : '(min-width: 768px) 35vw, 100vw'}
        src={media.url}
      />
    </div>
  )
}

function Timeline({ steps }: { steps?: CardItem[] }) {
  if (!steps?.length) return null

  return (
    <div className="grid gap-4">
      {steps.map((step, index) => (
        <div className="surface grid gap-3 p-5 md:grid-cols-[auto_1fr]" key={`${step.title || step.text}-${index}`}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-bold text-[var(--color-bg)]">
            {index + 1}
          </span>
          <div>
            <h3 className="text-xl font-bold">{step.title || step.text}</h3>
            {step.summary ? <p className="mt-2 leading-7 text-[var(--color-muted)]">{step.summary}</p> : null}
          </div>
        </div>
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
          const hasImage = Boolean(getMediaInfo(block.backgroundImage, 'hero')?.url)

          return (
            <section className="container grid min-h-[74vh] items-center py-16" key={index}>
              <div className={hasImage ? 'grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]' : ''}>
                <div className="max-w-4xl">
                  {block.eyebrow ? (
                    <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                      {block.eyebrow}
                    </p>
                  ) : null}
                  <h1 className="text-5xl font-black leading-tight md:text-7xl">{block.title}</h1>
                  {block.summary ? (
                    <p className="mt-6 max-w-3xl text-xl leading-9 text-[var(--color-muted)]">{block.summary}</p>
                  ) : null}
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {block.primaryCta?.url ? <a className="button" href={block.primaryCta.url}>{block.primaryCta.label}</a> : null}
                    {block.secondaryCta?.url ? <a className="button secondary" href={block.secondaryCta.url}>{block.secondaryCta.label}</a> : null}
                  </div>
                </div>
                <MediaPanel image={block.backgroundImage} priority />
              </div>
            </section>
          )
        }

        if (block.blockType === 'splitHero' || block.blockType === 'imageText') {
          return (
            <section className="container grid gap-8 py-14 md:grid-cols-[1fr_0.9fr] md:items-center" key={index}>
              <div>
                <SectionHeader block={block} />
              </div>
              <MediaPanel image={block.image} />
            </section>
          )
        }

        if (block.blockType === 'contactForm') {
          const form = typeof block.form === 'object' ? block.form : null
          return (
            <section className="container grid gap-8 py-14 md:grid-cols-[1fr_1fr]" key={index}>
              <div>
                <SectionHeader block={block} />
              </div>
              <ContactForm fields={form?.fields} formSlug={form?.slug || 'contact'} />
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
                    <div className="text-4xl font-black text-[var(--color-primary)]">{stat.value}</div>
                    <div className="mt-2 text-[var(--color-muted)]">{stat.label}</div>
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
                {block.body ? <p className="whitespace-pre-line leading-8 text-[var(--color-muted)]">{block.body}</p> : null}
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
                  <span className="surface px-4 py-2 text-sm font-semibold text-[var(--color-muted)]" key={item.text}>
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

        if (block.blockType === 'processTimeline') {
          return (
            <section className="container py-14" key={index}>
              <SectionHeader block={block} />
              <Timeline steps={block.steps} />
            </section>
          )
        }

        return (
          <section className="container py-14" key={index}>
            <SectionHeader block={block} />
            <CardGrid items={block.items || block.steps || block.rows || block.options} />
          </section>
        )
      })}
    </>
  )
}
