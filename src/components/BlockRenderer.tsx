import Image from 'next/image'
import { ContactForm } from './ContactForm'
import { getMediaInfo, type MediaValue } from '@/lib/media'
import { getPayloadClient } from '@/lib/payload'

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

type ContactItem = {
  icon?: string
  label?: string
  value?: string
}

type ColorChoice = 'default' | 'primary' | 'secondary' | 'muted' | 'light' | 'dark' | 'custom'

type DesignControls = {
  cardColumns?: 'auto' | 'two' | 'three' | 'four'
  cardDensity?: 'compact' | 'comfortable' | 'spacious'
  customBackgroundColor?: string
  customEyebrowColor?: string
  customSummaryColor?: string
  customTitleColor?: string
  eyebrowColor?: ColorChoice
  mediaAspectRatio?: 'auto' | 'natural' | 'wide' | 'cinematic' | 'square' | 'tall'
  mediaBackgroundColor?: string
  mediaFit?: 'cover' | 'contain' | 'fill'
  mediaFrame?: 'none' | 'card' | 'border' | 'shadow'
  mediaObjectPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  mediaPadding?: 'none' | 'small' | 'medium' | 'large'
  mediaSize?: 'small' | 'medium' | 'large'
  mobileCtaLayout?: 'stack' | 'inline' | 'hideSecondary'
  mobileLayout?: 'inherit' | 'stack' | 'textFirst' | 'mediaFirst'
  mobileMedia?: 'show' | 'hide'
  mobileSpacing?: 'compact' | 'standard'
  summaryColor?: ColorChoice
  summarySize?: 'small' | 'medium' | 'large'
  titleColor?: ColorChoice
  titleSize?: 'auto' | 'small' | 'medium' | 'large' | 'display'
}

type AnyBlock = {
  backgroundImage?: MediaValue
  badges?: { label?: string; value?: string }[]
  blockType?: string
  body?: string
  contactItems?: ContactItem[]
  design?: DesignControls
  eyebrow?: string
  form?: { slug?: string; fields?: FormField[]; confirmationMessage?: string } | number
  highlightText?: string
  image?: MediaValue
  itemLimit?: number
  items?: CardItem[]
  layoutVariant?: 'default' | 'compact' | 'centered' | 'split' | 'dashboard' | 'contact'
  maxWidth?: 'narrow' | 'standard' | 'wide'
  mediaPosition?: 'left' | 'right' | 'top' | 'bottom' | 'background' | 'none'
  options?: CardItem[]
  overlayOpacity?: number
  primaryCta?: { label?: string; url?: string }
  rows?: CardItem[]
  secondaryCta?: { label?: string; url?: string }
  sectionId?: string
  smartFicheUrl?: string
  spacing?: 'compact' | 'standard' | 'spacious'
  stats?: { value?: string; label?: string }[]
  steps?: CardItem[]
  summary?: string
  technologies?: { text?: string }[]
  textAlign?: 'left' | 'center' | 'right'
  theme?: 'default' | 'white' | 'soft' | 'dark' | 'blue' | 'splitDarkBlue'
  title?: string
  viewAllCta?: { label?: string; url?: string }
} & DesignControls

type BlockRendererProps = {
  blocks?: AnyBlock[]
  composerPreview?: boolean
  selectedBlockIndex?: number
}

const colorPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function asLimit(value: unknown, fallback: number) {
  return typeof value === 'number' && value > 0 ? Math.min(value, 24) : fallback
}

function titleWithHighlight(title?: string, highlight?: string) {
  if (!title) return null
  if (!highlight || !title.includes(highlight)) return title
  const [before, after] = title.split(highlight)
  return (
    <>
      {before}
      <span className="text-[var(--color-primary)]">{highlight}</span>
      {after}
    </>
  )
}

function safeColor(value?: string) {
  return typeof value === 'string' && colorPattern.test(value) ? value : undefined
}

function blockDesign(block: AnyBlock): DesignControls {
  return block.design || block
}

function colorClass(value?: ColorChoice) {
  if (!value || value === 'default' || value === 'custom') return undefined
  return `design-color--${value}`
}

function colorStyle(choice: unknown, custom?: string) {
  const color = choice === 'custom' ? safeColor(custom) : undefined
  return color ? { color } : undefined
}

function sectionClass(block: AnyBlock) {
  const design = blockDesign(block)
  return cx(
    'section-block',
    `section-block--${block.theme || 'default'}`,
    `section-block--${block.spacing || 'standard'}`,
    `mobile-layout--${design.mobileLayout || 'stack'}`,
    `mobile-media--${design.mobileMedia || 'show'}`,
    `mobile-spacing--${design.mobileSpacing || 'standard'}`,
    `mobile-cta--${design.mobileCtaLayout || 'stack'}`,
  )
}

function composerSectionProps(index: number, selectedBlockIndex?: number, composerPreview = false) {
  if (!composerPreview) return {}

  return {
    'data-composer-block': String(index),
    className: cx(index === selectedBlockIndex && 'composer-preview-block--selected'),
  }
}

function sectionStyle(block: AnyBlock) {
  const backgroundColor = safeColor(blockDesign(block).customBackgroundColor)
  return backgroundColor ? { backgroundColor } : undefined
}

function mediaStyle(design: DesignControls, aspectRatio?: string) {
  const backgroundColor = safeColor(design.mediaBackgroundColor)
  if (!backgroundColor && !aspectRatio) return undefined

  return {
    ...(backgroundColor ? { backgroundColor } : {}),
    ...(aspectRatio ? { aspectRatio } : {}),
  }
}

function innerClass(block: AnyBlock) {
  return cx(
    'section-inner',
    block.maxWidth === 'wide' && 'section-inner--wide',
    block.maxWidth === 'narrow' && 'section-inner--narrow',
    block.textAlign === 'center' && 'text-center',
    block.textAlign === 'right' && 'text-right',
  )
}

function SectionHeader({ block, heading = 'h2' }: { block: AnyBlock; heading?: 'h1' | 'h2' }) {
  const Heading = heading
  const centered = block.textAlign === 'center'
  const design = blockDesign(block)
  const titleSize = design.titleSize === 'auto' || !design.titleSize ? 'medium' : design.titleSize
  const summarySize = design.summarySize || 'medium'

  return (
    <div className={cx('section-heading', centered && 'mx-auto')}>
      {block.eyebrow ? (
        <p
          className={cx('section-eyebrow', colorClass(design.eyebrowColor))}
          style={colorStyle(design.eyebrowColor, design.customEyebrowColor)}
        >
          {block.eyebrow}
        </p>
      ) : null}
      {block.title ? (
        <Heading
          className={cx(
            heading === 'h1' ? 'hero-title' : 'section-title',
            `${heading === 'h1' ? 'hero-title' : 'section-title'}--${titleSize}`,
            colorClass(design.titleColor),
          )}
          style={colorStyle(design.titleColor, design.customTitleColor)}
        >
          {titleWithHighlight(block.title, block.highlightText)}
        </Heading>
      ) : null}
      {block.summary ? (
        <p
          className={cx('section-summary', `section-summary--${summarySize}`, colorClass(design.summaryColor))}
          style={colorStyle(design.summaryColor, design.customSummaryColor)}
        >
          {block.summary}
        </p>
      ) : null}
    </div>
  )
}

function CtaRow({ block }: { block: AnyBlock }) {
  return (
    <div className={cx('cta-row', block.textAlign === 'center' && 'justify-center', block.textAlign === 'right' && 'justify-end')}>
      {block.primaryCta?.url ? (
        <a className="button" href={block.primaryCta.url}>
          {block.primaryCta.label || 'Learn more'} <span aria-hidden="true">-&gt;</span>
        </a>
      ) : null}
      {block.secondaryCta?.url ? (
        <a className="button secondary" href={block.secondaryCta.url}>
          {block.secondaryCta.label || 'Explore'}
        </a>
      ) : null}
    </div>
  )
}

function CardGrid({ block, items, featuredIndex }: { block: AnyBlock; items?: CardItem[]; featuredIndex?: number }) {
  if (!items?.length) return null
  const design = blockDesign(block)

  return (
    <div
      className={cx(
        'modern-card-grid',
        `modern-card-grid--${design.cardColumns || 'auto'}`,
        `modern-card-grid--${design.cardDensity || 'comfortable'}`,
      )}
    >
      {items.map((item, index) => {
        const content = (
          <>
            <span className="card-icon" aria-hidden="true">
              {item.icon || '+'}
            </span>
            <strong className="card-title">{item.title || item.text}</strong>
            {item.summary ? <p className="card-summary">{item.summary}</p> : null}
          </>
        )

        return item.url ? (
          <a
            className={cx('modern-card', featuredIndex === index && 'modern-card--featured')}
            href={item.url}
            key={`${item.title || item.text || 'item'}-${item.url || index}`}
          >
            {content}
          </a>
        ) : (
          <div
            className={cx('modern-card', featuredIndex === index && 'modern-card--featured')}
            key={`${item.title || item.text || 'item'}-${index}`}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}

function MediaPanel({
  design,
  image,
  priority = false,
}: {
  design?: DesignControls
  image?: MediaValue
  priority?: boolean
}) {
  const mediaDesign = design || {}
  const mediaFit = mediaDesign.mediaFit || 'cover'
  const preferredSize = mediaFit === 'contain' ? undefined : priority ? 'hero' : 'card'
  const media = getMediaInfo(image, preferredSize)
  const naturalAspectRatio =
    mediaDesign.mediaAspectRatio === 'natural' && media?.width && media?.height
      ? `${media.width} / ${media.height}`
      : undefined

  return (
    <div
      className={cx(
        'media-panel',
        `media-panel--${mediaDesign.mediaSize || 'medium'}`,
        `media-panel--fit-${mediaDesign.mediaFit || 'cover'}`,
        `media-panel--aspect-${mediaDesign.mediaAspectRatio || 'auto'}`,
        `media-panel--frame-${mediaDesign.mediaFrame || 'card'}`,
        `media-panel--pad-${mediaDesign.mediaPadding || 'none'}`,
      )}
      style={mediaStyle(mediaDesign, naturalAspectRatio)}
    >
      {media?.url ? (
        <Image
          alt={media.alt}
          className={cx(
            'media-panel__image',
            `media-panel__image--${mediaDesign.mediaFit || 'cover'}`,
            `media-panel__image--pos-${mediaDesign.mediaObjectPosition || 'center'}`,
          )}
          fill
          priority={priority}
          sizes={priority ? '(min-width: 960px) 42vw, 100vw' : '(min-width: 960px) 38vw, 100vw'}
          src={media.url}
        />
      ) : (
        <div className="media-panel__placeholder">
          <span>Your image / dashboard hero</span>
        </div>
      )}
    </div>
  )
}

function DashboardHeroVisual({ block }: { block: AnyBlock }) {
  const badges = block.badges?.length
    ? block.badges
    : [
        { label: 'Systems', value: 'All operational' },
        { label: 'Backups', value: 'Verified' },
      ]

  return (
    <div className="dashboard-visual">
      <div className="dashboard-visual__badges">
        {badges.slice(0, 2).map((badge) => (
          <div className="dashboard-visual__badge" key={`${badge.label}-${badge.value}`}>
            <span>{badge.label}</span>
            <strong>{badge.value}</strong>
          </div>
        ))}
      </div>
      <MediaPanel design={blockDesign(block)} image={block.backgroundImage} priority />
    </div>
  )
}

function StatsRow({ stats }: { stats?: { value?: string; label?: string }[] }) {
  if (!stats?.length) return null
  return (
    <div className="stats-row">
      {stats.map((stat) => (
        <div className="stat-item" key={`${stat.value}-${stat.label}`}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

function Timeline({ steps }: { steps?: CardItem[] }) {
  if (!steps?.length) return null

  return (
    <div className="timeline-list">
      {steps.map((step, index) => (
        <div className="surface timeline-item" key={`${step.title || step.text}-${index}`}>
          <span className="timeline-index">{index + 1}</span>
          <div>
            <h3>{step.title || step.text}</h3>
            {step.summary ? <p>{step.summary}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

async function getCollectionCards(blockType?: string, limit = 8): Promise<CardItem[]> {
  const payload = await getPayloadClient()

  if (blockType === 'servicesGrid') {
    const result = await payload.find({
      collection: 'services',
      where: { status: { equals: 'published' } },
      sort: 'name',
      limit,
    })
    return result.docs.map((service) => ({
      title: service.name,
      summary: service.shortSummary,
      icon: service.serviceIcon || '+',
      url: `/services/${service.slug}`,
    }))
  }

  if (blockType === 'industryCards') {
    const result = await payload.find({
      collection: 'industries',
      where: { status: { equals: 'published' } },
      sort: 'name',
      limit,
    })
    return result.docs.map((industry) => ({
      title: industry.name,
      summary: industry.overview,
      icon: '+',
      url: `/industries/${industry.slug}`,
    }))
  }

  if (blockType === 'testimonials') {
    const result = await payload.find({
      collection: 'testimonials',
      where: {
        and: [{ status: { equals: 'published' } }, { permissionConfirmed: { equals: true } }],
      },
      sort: '-createdAt',
      limit,
    })
    return result.docs.map((testimonial) => ({
      title: testimonial.clientName,
      summary: testimonial.quote,
      icon: '*****',
    }))
  }

  if (blockType === 'resourceList') {
    const result = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit,
    })
    return result.docs.map((post) => ({
      title: post.title,
      summary: post.excerpt,
      icon: '+',
      url: `/resources/${post.slug}`,
    }))
  }

  return []
}

async function resolveItems(block: AnyBlock) {
  const manual = block.items || block.steps || block.rows || block.options
  if (manual?.length) return manual
  return getCollectionCards(block.blockType, asLimit(block.itemLimit, block.blockType === 'industryCards' ? 6 : 8))
}

function SectionBackground({ block }: { block: AnyBlock }) {
  const media = block.mediaPosition === 'background' ? getMediaInfo(block.backgroundImage, 'hero') : null
  if (!media?.url) return null
  const opacity = Math.min(Math.max(block.overlayOpacity || 0, 0), 90) / 100
  return (
    <>
      <Image alt="" className="section-bg-image" fill sizes="100vw" src={media.url} />
      <span className="section-bg-overlay" style={{ opacity }} />
    </>
  )
}

function ContactDetails({ items }: { items?: ContactItem[] }) {
  if (!items?.length) return null
  return (
    <div className="contact-details">
      {items.map((item) => (
        <div className="contact-detail" key={`${item.label}-${item.value}`}>
          <span className="contact-detail__icon">{item.icon || '+'}</span>
          <span>
            <small>{item.label}</small>
            <strong>{item.value}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}

export async function BlockRenderer({ blocks, composerPreview = false, selectedBlockIndex }: BlockRendererProps) {
  if (!blocks?.length) return null

  return (
    <>
      {await Promise.all(
        blocks.map(async (block, index) => {
          const key = `${block.blockType || 'block'}-${block.sectionId || index}`

          if (block.blockType === 'hero') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), 'hero-section', composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <SectionBackground block={block} />
                <div className={cx(innerClass(block), 'hero-grid')}>
                  <div>
                    <SectionHeader block={block} heading="h1" />
                    <CtaRow block={block} />
                    <StatsRow stats={block.stats} />
                  </div>
                  {block.mediaPosition !== 'none' ? <DashboardHeroVisual block={block} /> : null}
                </div>
              </section>
            )
          }

          if (block.blockType === 'splitHero' || block.blockType === 'imageText' || block.blockType === 'smartfiche') {
            const reverse = block.mediaPosition === 'left'
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <SectionBackground block={block} />
                <div className={cx(innerClass(block), 'split-section', reverse && 'split-section--reverse')}>
                  <div>
                    <SectionHeader block={block} />
                    <CtaRow block={block} />
                    {block.smartFicheUrl ? (
                      <a className="button mt-6" href={block.smartFicheUrl}>
                        Learn about SmartFiche <span aria-hidden="true">-&gt;</span>
                      </a>
                    ) : null}
                  </div>
                  {block.mediaPosition !== 'none' ? (
                    <MediaPanel design={blockDesign(block)} image={block.image || block.backgroundImage} />
                  ) : null}
                </div>
              </section>
            )
          }

          if (block.blockType === 'contactForm') {
            const form = typeof block.form === 'object' ? block.form : null
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), 'contact-section', composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <SectionBackground block={block} />
                <div className={cx(innerClass(block), 'contact-grid')}>
                  <div className="contact-panel">
                    <SectionHeader block={block} />
                    <ContactDetails items={block.contactItems} />
                  </div>
                  <ContactForm fields={form?.fields} formSlug={form?.slug || 'contact'} />
                </div>
              </section>
            )
          }

          if (block.blockType === 'stats') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <div className={innerClass(block)}>
                  <SectionHeader block={block} />
                  <StatsRow stats={block.stats} />
                </div>
              </section>
            )
          }

          if (block.blockType === 'richText' || block.blockType === 'securityNotice') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <SectionBackground block={block} />
                <div className={innerClass(block)}>
                  <div className="surface prose-panel">
                    <SectionHeader block={block} />
                    {block.body ? <p className="whitespace-pre-line leading-8 text-[var(--color-muted)]">{block.body}</p> : null}
                  </div>
                </div>
              </section>
            )
          }

          if (block.blockType === 'technologyStack') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <div className={innerClass(block)}>
                  <SectionHeader block={block} />
                  <div className="tag-cloud">
                    {block.technologies?.map((item) => (
                      <span className="tag-pill" key={item.text}>
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (block.blockType === 'ctaBanner' || block.blockType === 'recoveryEmergencyCta') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <SectionBackground block={block} />
                <div className={cx(innerClass(block), 'cta-panel')}>
                  <SectionHeader block={block} />
                  <CtaRow block={block} />
                </div>
              </section>
            )
          }

          if (block.blockType === 'processTimeline') {
            const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
            return (
              <section
                className={cx(sectionClass(block), composerProps.className)}
                data-composer-block={composerProps['data-composer-block']}
                id={block.sectionId || undefined}
                key={key}
                style={sectionStyle(block)}
              >
                <div className={innerClass(block)}>
                  <SectionHeader block={block} />
                  <Timeline steps={block.steps} />
                </div>
              </section>
            )
          }

          const items = await resolveItems(block)
          const composerProps = composerSectionProps(index, selectedBlockIndex, composerPreview)
          return (
            <section
              className={cx(sectionClass(block), composerProps.className)}
              data-composer-block={composerProps['data-composer-block']}
              id={block.sectionId || undefined}
              key={key}
              style={sectionStyle(block)}
            >
              <SectionBackground block={block} />
              <div className={innerClass(block)}>
                <div className="section-heading-row">
                  <SectionHeader block={block} />
                  {block.viewAllCta?.url ? (
                    <a className="section-view-all" href={block.viewAllCta.url}>
                      {block.viewAllCta.label || 'View all'} <span aria-hidden="true">-&gt;</span>
                    </a>
                  ) : null}
                </div>
                <CardGrid block={block} items={items} featuredIndex={block.blockType === 'testimonials' ? 1 : undefined} />
              </div>
            </section>
          )
        }),
      )}
    </>
  )
}
