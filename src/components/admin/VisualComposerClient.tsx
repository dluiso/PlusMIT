'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { adminPath } from '@/lib/admin-route'

type MediaReference = number | string | null | undefined

export type PageBlock = {
  backgroundImage?: MediaReference
  blockType?: string
  eyebrow?: string | null
  highlightText?: string | null
  image?: MediaReference
  layoutVariant?: string | null
  maxWidth?: string | null
  mediaPosition?: string | null
  sectionId?: string | null
  spacing?: string | null
  summary?: string | null
  textAlign?: string | null
  theme?: string | null
  title?: string | null
  design?: {
    cardColumns?: string | null
    cardDensity?: string | null
    customBackgroundColor?: string | null
    customEyebrowColor?: string | null
    customSummaryColor?: string | null
    customTitleColor?: string | null
    eyebrowColor?: string | null
    mediaAspectRatio?: string | null
    mediaBackgroundColor?: string | null
    mediaFit?: string | null
    mediaFrame?: string | null
    mediaObjectPosition?: string | null
    mediaPadding?: string | null
    mediaSize?: string | null
    mobileCtaLayout?: string | null
    mobileLayout?: string | null
    mobileMedia?: string | null
    mobileSpacing?: string | null
    summaryColor?: string | null
    summarySize?: string | null
    titleColor?: string | null
    titleSize?: string | null
  } | null
}

export type PageSummary = {
  id: number | string
  layout?: PageBlock[]
  pageType?: string | null
  slug?: string
  status?: string
  title?: string
  updatedAt?: string
}

export type MediaOption = {
  alt?: string | null
  filename?: string | null
  id: number | string
  title?: string | null
  updatedAt?: string
}

type VisualComposerClientProps = {
  initialPageId?: number | string
  initialViewport: number
  mediaOptions: MediaOption[]
  pages: PageSummary[]
  siteUrl: string
}

type SaveState = 'dirty' | 'error' | 'idle' | 'saving' | 'saved'

const blockLabels: Record<string, string> = {
  caseStudyHighlight: 'Case Study Highlight',
  contactForm: 'Contact Form',
  ctaBanner: 'CTA Banner',
  faqAccordion: 'FAQ Accordion',
  featuredService: 'Featured Service',
  featureCards: 'Feature Cards',
  hero: 'Hero',
  imageText: 'Image + Text',
  industryCards: 'Industry Cards',
  mobileAppPreview: 'Mobile App Preview',
  pricingOptions: 'Pricing / Plans',
  processTimeline: 'Process Timeline',
  recoveryEmergencyCta: 'Recovery Emergency CTA',
  resourceList: 'Resource List',
  richText: 'Rich Text',
  securityNotice: 'Security Notice',
  servicesGrid: 'Services Grid',
  smartfiche: 'SmartFiche',
  splitHero: 'Split Hero',
  stats: 'Stats',
  technologyStack: 'Technology Stack',
  testimonials: 'Testimonials',
  trustBar: 'Trust Bar',
}

const previewSizes = [
  { label: 'Canvas', width: 0 },
  { label: 'Desktop', width: 1280 },
  { label: 'Tablet', width: 820 },
  { label: 'Mobile', width: 390 },
]

const cardBlockTypes = new Set([
  'featureCards',
  'industryCards',
  'mobileAppPreview',
  'pricingOptions',
  'resourceList',
  'servicesGrid',
  'testimonials',
  'trustBar',
])

const primaryImageBlockTypes = new Set(['imageText', 'smartfiche', 'splitHero'])

const selectOptions = {
  cardColumns: ['auto', 'two', 'three', 'four'],
  cardDensity: ['compact', 'comfortable', 'spacious'],
  color: ['default', 'primary', 'secondary', 'muted', 'light', 'dark', 'custom'],
  layoutVariant: ['default', 'compact', 'centered', 'split', 'dashboard', 'contact'],
  maxWidth: ['narrow', 'standard', 'wide'],
  mediaAspectRatio: ['auto', 'natural', 'wide', 'cinematic', 'square', 'tall'],
  mediaFit: ['cover', 'contain', 'fill'],
  mediaFrame: ['none', 'card', 'border', 'shadow'],
  mediaObjectPosition: ['center', 'top', 'bottom', 'left', 'right'],
  mediaPadding: ['none', 'small', 'medium', 'large'],
  mediaPosition: ['left', 'right', 'top', 'bottom', 'background', 'none'],
  mediaSize: ['small', 'medium', 'large'],
  mobileCtaLayout: ['stack', 'inline', 'hideSecondary'],
  mobileLayout: ['inherit', 'stack', 'textFirst', 'mediaFirst'],
  mobileMedia: ['show', 'hide'],
  mobileSpacing: ['compact', 'standard'],
  spacing: ['compact', 'standard', 'spacious'],
  summarySize: ['small', 'medium', 'large'],
  textAlign: ['left', 'center', 'right'],
  titleSize: ['auto', 'small', 'medium', 'large', 'display'],
  theme: ['default', 'white', 'soft', 'dark', 'blue', 'splitDarkBlue'],
}

function publicPathFromSlug(slug?: string) {
  if (!slug || slug === 'home') return '/'
  return `/${slug.replace(/^\/+/, '')}`
}

function publicUrlFromSlug(siteUrl: string, slug?: string, selectedBlockIndex = 0, version = 0) {
  const url = new URL(publicPathFromSlug(slug), siteUrl)
  url.searchParams.set('composer', '1')
  url.searchParams.set('block', String(selectedBlockIndex))
  if (version > 0) url.searchParams.set('v', String(version))
  return url.toString()
}

function formatDate(value?: string) {
  if (!value) return 'No date'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getBlockLabel(blockType?: string) {
  if (!blockType) return 'Block'
  return blockLabels[blockType] || blockType
}

function getBlockTitle(block: PageBlock, index: number) {
  return block.title || block.eyebrow || `${getBlockLabel(block.blockType)} ${index + 1}`
}

function getPageEditHref(id: number | string) {
  return adminPath(`/collections/pages/${id}`)
}

function getPagePreviewHref(id: number | string) {
  return adminPath(`/collections/pages/${id}/preview`)
}

function getSelectedPage(pages: PageSummary[], requestedId?: number | string) {
  return pages.find((page) => String(page.id) === String(requestedId)) || pages.find((page) => page.slug === 'home') || pages[0] || null
}

function cloneBlock(block: PageBlock): PageBlock {
  return {
    ...block,
    design: {
      ...(block.design || {}),
    },
  }
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: string) => void
  options: string[]
  value?: string | null
}) {
  return (
    <label className="visual-composer__field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value || ''}>
        <option value="">Default</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value?: string | null
}) {
  return (
    <label className="visual-composer__field">
      <span>{label}</span>
      <input onChange={(event) => onChange(event.target.value)} value={value || ''} />
    </label>
  )
}

function TextAreaField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value?: string | null
}) {
  return (
    <label className="visual-composer__field">
      <span>{label}</span>
      <textarea onChange={(event) => onChange(event.target.value)} rows={4} value={value || ''} />
    </label>
  )
}

function MediaField({
  label,
  mediaOptions,
  onChange,
  value,
}: {
  label: string
  mediaOptions: MediaOption[]
  onChange: (value: string | null) => void
  value?: MediaReference
}) {
  return (
    <label className="visual-composer__field">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value || null)} value={value ? String(value) : ''}>
        <option value="">No media selected</option>
        {mediaOptions.map((media) => (
          <option key={media.id} value={media.id}>
            {media.title || media.alt || media.filename || `Media ${media.id}`}
          </option>
        ))}
      </select>
    </label>
  )
}

function blockSupportsCards(blockType?: string) {
  return blockType ? cardBlockTypes.has(blockType) : false
}

function blockSupportsPrimaryImage(blockType?: string) {
  return blockType ? primaryImageBlockTypes.has(blockType) : false
}

function getBlockPresets(blockType?: string) {
  const base = [
    {
      label: 'Clean section',
      patch: {
        maxWidth: 'standard',
        spacing: 'standard',
        textAlign: 'left',
        theme: 'white',
        design: { titleSize: 'medium', summarySize: 'medium', mobileLayout: 'stack' },
      },
    },
    {
      label: 'Centered compact',
      patch: {
        maxWidth: 'narrow',
        mediaPosition: 'none',
        spacing: 'compact',
        textAlign: 'center',
        theme: 'white',
        design: { summarySize: 'medium', titleSize: 'medium', mobileLayout: 'stack' },
      },
    },
  ]

  if (blockType === 'hero') {
    return [
      {
        label: 'Hero dashboard',
        patch: {
          layoutVariant: 'dashboard',
          maxWidth: 'standard',
          mediaPosition: 'right',
          spacing: 'spacious',
          textAlign: 'left',
          theme: 'white',
          design: { mediaAspectRatio: 'wide', mediaFit: 'cover', mediaFrame: 'card', mobileLayout: 'textFirst', titleSize: 'large' },
        },
      },
      {
        label: 'Hero centered',
        patch: {
          layoutVariant: 'centered',
          maxWidth: 'narrow',
          mediaPosition: 'none',
          spacing: 'spacious',
          textAlign: 'center',
          theme: 'white',
          design: { mobileLayout: 'stack', titleSize: 'large' },
        },
      },
    ]
  }

  if (blockSupportsCards(blockType)) {
    return [
      {
        label: 'Cards 3 columns',
        patch: {
          maxWidth: 'standard',
          spacing: 'standard',
          textAlign: 'left',
          theme: 'white',
          design: { cardColumns: 'three', cardDensity: 'comfortable', titleSize: 'medium' },
        },
      },
      {
        label: 'Cards 4 compact',
        patch: {
          maxWidth: 'wide',
          spacing: 'standard',
          textAlign: 'left',
          theme: 'white',
          design: { cardColumns: 'four', cardDensity: 'compact', titleSize: 'medium' },
        },
      },
    ]
  }

  if (blockSupportsPrimaryImage(blockType)) {
    return [
      {
        label: 'Media right',
        patch: {
          layoutVariant: 'split',
          maxWidth: 'wide',
          mediaPosition: 'right',
          spacing: 'spacious',
          textAlign: 'left',
          theme: 'splitDarkBlue',
          design: { mediaAspectRatio: 'wide', mediaFit: 'contain', mediaFrame: 'card', mediaPadding: 'medium', mobileLayout: 'textFirst' },
        },
      },
      {
        label: 'Media left',
        patch: {
          layoutVariant: 'split',
          maxWidth: 'wide',
          mediaPosition: 'left',
          spacing: 'spacious',
          textAlign: 'left',
          theme: 'white',
          design: { mediaAspectRatio: 'wide', mediaFit: 'cover', mediaFrame: 'card', mobileLayout: 'mediaFirst' },
        },
      },
    ]
  }

  return base
}

export function VisualComposerClient({
  initialPageId,
  initialViewport,
  mediaOptions,
  pages: initialPages,
  siteUrl,
}: VisualComposerClientProps) {
  const [pages, setPages] = useState(initialPages)
  const [selectedPageId, setSelectedPageId] = useState<number | string | undefined>(initialPageId)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0)
  const [selectedPreviewSize, setSelectedPreviewSize] = useState(initialViewport)
  const [editorBlock, setEditorBlock] = useState<PageBlock | null>(() => {
    const page = getSelectedPage(initialPages, initialPageId)
    return page?.layout?.[0] ? cloneBlock(page.layout[0]) : null
  })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState('')
  const [previewVersion, setPreviewVersion] = useState(0)
  const previewRef = useRef<HTMLIFrameElement>(null)

  const selectedPage = useMemo(() => getSelectedPage(pages, selectedPageId), [pages, selectedPageId])
  const selectedBlock = selectedPage?.layout?.[selectedBlockIndex] || null
  const selectedBlockType = selectedBlock?.blockType
  const selectedBlockPresets = getBlockPresets(selectedBlockType)
  const showCardControls = blockSupportsCards(selectedBlockType)
  const showPrimaryImage = blockSupportsPrimaryImage(selectedBlockType)
  const previewUrl = publicUrlFromSlug(siteUrl, selectedPage?.slug, selectedBlockIndex, previewVersion)

  function selectPage(page: PageSummary) {
    setSelectedPageId(page.id)
    setSelectedBlockIndex(0)
    setEditorBlock(page.layout?.[0] ? cloneBlock(page.layout[0]) : null)
    setSaveState('idle')
    setMessage('')
  }

  function selectBlock(block: PageBlock, index: number) {
    setSelectedBlockIndex(index)
    setEditorBlock(cloneBlock(block))
    setSaveState('idle')
    setMessage('')
  }

  function updateBlockField(field: keyof PageBlock, value: MediaReference | string) {
    setEditorBlock((current) => ({ ...(current || {}), [field]: value }))
    setSaveState('dirty')
  }

  function updateDesignField(field: keyof NonNullable<PageBlock['design']>, value: string) {
    setEditorBlock((current) => ({
      ...(current || {}),
      design: {
        ...(current?.design || {}),
        [field]: value,
      },
    }))
    setSaveState('dirty')
  }

  function applyPreset(preset: ReturnType<typeof getBlockPresets>[number]) {
    setEditorBlock((current) => ({
      ...(current || {}),
      ...preset.patch,
      design: {
        ...(current?.design || {}),
        ...(preset.patch.design || {}),
      },
    }))
    setSaveState('dirty')
    setMessage(`Preset applied: ${preset.label}. Save to publish it.`)
  }

  async function saveBlock() {
    if (!selectedPage || !editorBlock) return

    setSaveState('saving')
    setMessage('')

    const response = await fetch(`/api/visual-composer/pages/${selectedPage.id}/blocks/${selectedBlockIndex}`, {
      body: JSON.stringify({ block: editorBlock }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { error?: string } | null
      setSaveState('error')
      setMessage(error?.error || 'The block could not be saved.')
      return
    }

    const result = (await response.json()) as { page?: PageSummary }
    if (result.page) {
      const updatedPage = result.page
      setPages((current) => current.map((page) => (String(page.id) === String(updatedPage.id) ? updatedPage : page)))
      setEditorBlock(updatedPage.layout?.[selectedBlockIndex] ? cloneBlock(updatedPage.layout[selectedBlockIndex]) : null)
    }

    setSaveState('saved')
    setMessage('Saved. Preview refreshed.')
    setPreviewVersion((current) => current + 1)
  }

  function scrollPreviewToSelectedBlock() {
    const iframe = previewRef.current
    const doc = iframe?.contentDocument
    const block = doc?.querySelector(`[data-composer-block="${selectedBlockIndex}"]`)
    block?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="visual-composer">
      <section className="visual-composer__header">
        <div>
          <p className="visual-composer__eyebrow">PlusMIT visual composer</p>
          <h1>Visual Composer</h1>
          <p>Select a page, edit safe block settings, save, and refresh the live preview.</p>
        </div>
        {selectedPage ? (
          <div className="visual-composer__actions">
            <Link className="visual-composer__button" href={getPageEditHref(selectedPage.id)}>
              Advanced edit
            </Link>
            <Link className="visual-composer__button" href={getPagePreviewHref(selectedPage.id)}>
              Live Preview
            </Link>
          </div>
        ) : null}
      </section>

      {selectedPage ? (
        <>
          <section className="visual-composer__pagePicker" aria-label="Pages">
            <div>
              <h2>Pages</h2>
              <p>Select a page to preview.</p>
            </div>
            <div className="visual-composer__pageRail">
              {pages.map((page) => (
                <button
                  className="visual-composer__pageItem"
                  data-active={page.id === selectedPage.id}
                  key={page.id}
                  onClick={() => selectPage(page)}
                  type="button"
                >
                  <strong>{page.title || page.slug}</strong>
                  <span>{publicPathFromSlug(page.slug)}</span>
                  <small>{page.status || 'draft'}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="visual-composer__workspace">
            <section className="visual-composer__main" aria-label="Selected page workspace">
              <div className="visual-composer__toolbar">
                <div>
                  <p className="visual-composer__eyebrow">Selected page</p>
                  <h2>{selectedPage.title || selectedPage.slug}</h2>
                  <span>
                    {selectedPage.pageType || 'standard'} - {selectedPage.status || 'draft'} - Updated{' '}
                    {formatDate(selectedPage.updatedAt)}
                  </span>
                </div>
                <div className="visual-composer__viewportSwitch" aria-label="Preview size">
                  {previewSizes.map((size) => (
                    <button
                      data-active={selectedPreviewSize === size.width}
                      key={size.width}
                      onClick={() => setSelectedPreviewSize(size.width)}
                      type="button"
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="visual-composer__previewWrap">
                <iframe
                  className="visual-composer__preview"
                  key={`${selectedPage.id}-${selectedPreviewSize}-${previewVersion}`}
                  onLoad={scrollPreviewToSelectedBlock}
                  ref={previewRef}
                  src={previewUrl}
                  style={{ width: selectedPreviewSize > 0 ? `${selectedPreviewSize}px` : '100%' }}
                  title={`Preview of ${selectedPage.title || selectedPage.slug}`}
                />
              </div>
            </section>

            <aside className="visual-composer__inspector" aria-label="Block inspector">
              <details className="visual-composer__structure" open>
                <summary>
                  <span>
                    <strong>Page structure</strong>
                    <small>{selectedPage.layout?.length || 0} blocks</small>
                  </span>
                </summary>
                <ol className="visual-composer__blockList">
                  {(selectedPage.layout || []).map((block, index) => (
                    <li className="visual-composer__blockItem" data-active={index === selectedBlockIndex} key={`${block.blockType || 'block'}-${index}`}>
                      <button onClick={() => selectBlock(block, index)} type="button">
                        <span>{index + 1}</span>
                        <div>
                          <strong>{getBlockTitle(block, index)}</strong>
                          <small>{getBlockLabel(block.blockType)}</small>
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>
              </details>

              <section className="visual-composer__editor">
                <div className="visual-composer__editorHeader">
                  <div>
                    <p className="visual-composer__eyebrow">Block inspector</p>
                    <h2>{selectedBlock ? getBlockTitle(selectedBlock, selectedBlockIndex) : 'No block selected'}</h2>
                    <span>{selectedBlock ? getBlockLabel(selectedBlock.blockType) : 'Select a block to edit.'}</span>
                  </div>
                  <button
                    className="visual-composer__button visual-composer__button--primary"
                    disabled={!editorBlock || saveState === 'saving' || saveState === 'idle'}
                    onClick={saveBlock}
                    type="button"
                  >
                    {saveState === 'saving' ? 'Saving...' : 'Save'}
                  </button>
                </div>

                {editorBlock ? (
                  <div className="visual-composer__form">
                    <section className="visual-composer__presetGroup" aria-label="Section presets">
                      <span>Quick presets</span>
                      <div>
                        {selectedBlockPresets.map((preset) => (
                          <button key={preset.label} onClick={() => applyPreset(preset)} type="button">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </section>

                    <TextField label="Section ID" onChange={(value) => updateBlockField('sectionId', value)} value={editorBlock.sectionId} />
                    <TextField label="Eyebrow" onChange={(value) => updateBlockField('eyebrow', value)} value={editorBlock.eyebrow} />
                    <TextField label="Title" onChange={(value) => updateBlockField('title', value)} value={editorBlock.title} />
                    <TextField label="Highlight text" onChange={(value) => updateBlockField('highlightText', value)} value={editorBlock.highlightText} />
                    <TextAreaField label="Summary" onChange={(value) => updateBlockField('summary', value)} value={editorBlock.summary} />

                    <div className="visual-composer__fieldGrid">
                      <SelectField label="Theme" onChange={(value) => updateBlockField('theme', value)} options={selectOptions.theme} value={editorBlock.theme} />
                      <SelectField
                        label="Layout"
                        onChange={(value) => updateBlockField('layoutVariant', value)}
                        options={selectOptions.layoutVariant}
                        value={editorBlock.layoutVariant}
                      />
                      <SelectField label="Text align" onChange={(value) => updateBlockField('textAlign', value)} options={selectOptions.textAlign} value={editorBlock.textAlign} />
                      <SelectField label="Spacing" onChange={(value) => updateBlockField('spacing', value)} options={selectOptions.spacing} value={editorBlock.spacing} />
                      <SelectField label="Max width" onChange={(value) => updateBlockField('maxWidth', value)} options={selectOptions.maxWidth} value={editorBlock.maxWidth} />
                      <SelectField
                        label="Media position"
                        onChange={(value) => updateBlockField('mediaPosition', value)}
                        options={selectOptions.mediaPosition}
                        value={editorBlock.mediaPosition}
                      />
                    </div>

                    <details className="visual-composer__editorGroup" open>
                      <summary>Typography and colors</summary>
                      <div className="visual-composer__fieldGrid">
                        <SelectField label="Title size" onChange={(value) => updateDesignField('titleSize', value)} options={selectOptions.titleSize} value={editorBlock.design?.titleSize} />
                        <SelectField label="Summary size" onChange={(value) => updateDesignField('summarySize', value)} options={selectOptions.summarySize} value={editorBlock.design?.summarySize} />
                        <SelectField label="Eyebrow color" onChange={(value) => updateDesignField('eyebrowColor', value)} options={selectOptions.color} value={editorBlock.design?.eyebrowColor} />
                        <SelectField label="Title color" onChange={(value) => updateDesignField('titleColor', value)} options={selectOptions.color} value={editorBlock.design?.titleColor} />
                        <SelectField label="Summary color" onChange={(value) => updateDesignField('summaryColor', value)} options={selectOptions.color} value={editorBlock.design?.summaryColor} />
                        <TextField
                          label="Custom background"
                          onChange={(value) => updateDesignField('customBackgroundColor', value)}
                          value={editorBlock.design?.customBackgroundColor}
                        />
                        <TextField label="Custom title color" onChange={(value) => updateDesignField('customTitleColor', value)} value={editorBlock.design?.customTitleColor} />
                        <TextField label="Custom summary color" onChange={(value) => updateDesignField('customSummaryColor', value)} value={editorBlock.design?.customSummaryColor} />
                      </div>
                    </details>

                    <details className="visual-composer__editorGroup">
                      <summary>Cards, media, and mobile</summary>
                      <div className="visual-composer__fieldGrid">
                        {showCardControls ? (
                          <>
                            <SelectField label="Card density" onChange={(value) => updateDesignField('cardDensity', value)} options={selectOptions.cardDensity} value={editorBlock.design?.cardDensity} />
                            <SelectField label="Card columns" onChange={(value) => updateDesignField('cardColumns', value)} options={selectOptions.cardColumns} value={editorBlock.design?.cardColumns} />
                          </>
                        ) : null}
                        {showPrimaryImage ? (
                          <MediaField label="Main image" mediaOptions={mediaOptions} onChange={(value) => updateBlockField('image', value)} value={editorBlock.image} />
                        ) : null}
                        <MediaField
                          label={selectedBlockType === 'hero' ? 'Hero image' : 'Background image'}
                          mediaOptions={mediaOptions}
                          onChange={(value) => updateBlockField('backgroundImage', value)}
                          value={editorBlock.backgroundImage}
                        />
                        <SelectField label="Media size" onChange={(value) => updateDesignField('mediaSize', value)} options={selectOptions.mediaSize} value={editorBlock.design?.mediaSize} />
                        <SelectField label="Media fit" onChange={(value) => updateDesignField('mediaFit', value)} options={selectOptions.mediaFit} value={editorBlock.design?.mediaFit} />
                        <SelectField
                          label="Media ratio"
                          onChange={(value) => updateDesignField('mediaAspectRatio', value)}
                          options={selectOptions.mediaAspectRatio}
                          value={editorBlock.design?.mediaAspectRatio}
                        />
                        <SelectField
                          label="Media anchor"
                          onChange={(value) => updateDesignField('mediaObjectPosition', value)}
                          options={selectOptions.mediaObjectPosition}
                          value={editorBlock.design?.mediaObjectPosition}
                        />
                        <SelectField label="Media frame" onChange={(value) => updateDesignField('mediaFrame', value)} options={selectOptions.mediaFrame} value={editorBlock.design?.mediaFrame} />
                        <SelectField label="Media padding" onChange={(value) => updateDesignField('mediaPadding', value)} options={selectOptions.mediaPadding} value={editorBlock.design?.mediaPadding} />
                        <SelectField label="Mobile layout" onChange={(value) => updateDesignField('mobileLayout', value)} options={selectOptions.mobileLayout} value={editorBlock.design?.mobileLayout} />
                        <SelectField label="Mobile media" onChange={(value) => updateDesignField('mobileMedia', value)} options={selectOptions.mobileMedia} value={editorBlock.design?.mobileMedia} />
                        <SelectField label="Mobile spacing" onChange={(value) => updateDesignField('mobileSpacing', value)} options={selectOptions.mobileSpacing} value={editorBlock.design?.mobileSpacing} />
                        <SelectField
                          label="Mobile CTAs"
                          onChange={(value) => updateDesignField('mobileCtaLayout', value)}
                          options={selectOptions.mobileCtaLayout}
                          value={editorBlock.design?.mobileCtaLayout}
                        />
                      </div>
                    </details>

                    {message ? <p className={`visual-composer__message visual-composer__message--${saveState}`}>{message}</p> : null}
                  </div>
                ) : (
                  <p className="visual-composer__message">Select a block from the page structure.</p>
                )}
              </section>
            </aside>
          </section>
        </>
      ) : (
        <section className="visual-composer__empty">
          <h2>No pages found</h2>
          <p>Create a page first, then return here to preview and edit its layout.</p>
          <Link className="visual-composer__button visual-composer__button--primary" href={adminPath('/collections/pages/create')}>
            Create page
          </Link>
        </section>
      )}
    </main>
  )
}
