'use client'

import Link from 'next/link'
import { useMemo, useRef, useState, type FormEvent } from 'react'
import { adminPath } from '@/lib/admin-route'

type MediaReference = number | string | null | undefined
type MediaFieldName = 'backgroundImage' | 'image'
type MediaPanelMode = 'closed' | 'library' | 'upload'
type StructureState = 'error' | 'idle' | 'saving' | 'success'

type ComposerCardItem = {
  icon?: string | null
  summary?: string | null
  title?: string | null
  url?: string | null
}

type ComposerStatItem = {
  label?: string | null
  value?: string | null
}

type ComposerContactItem = {
  icon?: string | null
  label?: string | null
  value?: string | null
}

type ComposerLink = {
  label?: string | null
  url?: string | null
}

export type PageBlock = {
  backgroundImage?: MediaReference
  badges?: ComposerStatItem[]
  blockType?: string
  body?: string | null
  category?: string | null
  contactItems?: ComposerContactItem[]
  eyebrow?: string | null
  hidden?: boolean | null
  highlightText?: string | null
  image?: MediaReference
  itemLimit?: number | null
  items?: ComposerCardItem[]
  layoutVariant?: string | null
  maxWidth?: string | null
  mediaPosition?: string | null
  options?: ComposerCardItem[]
  primaryCta?: ComposerLink | null
  rows?: ComposerCardItem[]
  sectionId?: string | null
  secondaryCta?: ComposerLink | null
  smartFicheUrl?: string | null
  spacing?: string | null
  stats?: ComposerStatItem[]
  steps?: ComposerCardItem[]
  summary?: string | null
  textAlign?: string | null
  theme?: string | null
  title?: string | null
  viewAllCta?: ComposerLink | null
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
  sizes?: Record<string, { url?: string | null } | undefined> | null
  title?: string | null
  updatedAt?: string
  url?: string | null
}

type VisualComposerClientProps = {
  initialPageId?: number | string
  initialViewport: number
  mediaOptions: MediaOption[]
  pages: PageSummary[]
  siteUrl: string
}

type SaveState = 'dirty' | 'error' | 'idle' | 'saving' | 'saved'
type UploadState = 'error' | 'idle' | 'success' | 'uploading'

type LayoutAction =
  | { type: 'delete'; index: number }
  | { type: 'duplicate'; index: number }
  | { type: 'insert'; afterIndex?: number; blockType: string }
  | { type: 'move'; fromIndex: number; toIndex: number }
  | { type: 'toggleHidden'; hidden: boolean; index: number }

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

const insertBlockOptions = [
  { label: 'CTA Banner', value: 'ctaBanner' },
  { label: 'FAQ', value: 'faqAccordion' },
  { label: 'Hero', value: 'hero' },
  { label: 'Image + Text', value: 'imageText' },
  { label: 'Industries', value: 'industryCards' },
  { label: 'Pricing / Plans', value: 'pricingOptions' },
  { label: 'Process Timeline', value: 'processTimeline' },
  { label: 'Resources', value: 'resourceList' },
  { label: 'Rich Text', value: 'richText' },
  { label: 'Services Grid', value: 'servicesGrid' },
  { label: 'SmartFiche', value: 'smartfiche' },
  { label: 'Stats', value: 'stats' },
  { label: 'Testimonials', value: 'testimonials' },
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

function NumberField({
  label,
  max = 24,
  min = 1,
  onChange,
  value,
}: {
  label: string
  max?: number
  min?: number
  onChange: (value: number) => void
  value?: number | null
}) {
  return (
    <label className="visual-composer__field">
      <span>{label}</span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        value={value ?? ''}
      />
    </label>
  )
}

function LinkGroupEditor({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: ComposerLink) => void
  value?: ComposerLink | null
}) {
  const link = value || {}

  return (
    <div className="visual-composer__miniGroup">
      <span>{label}</span>
      <div className="visual-composer__fieldGrid">
        <TextField label="Label" onChange={(nextValue) => onChange({ ...link, label: nextValue })} value={link.label} />
        <TextField label="URL" onChange={(nextValue) => onChange({ ...link, url: nextValue })} value={link.url} />
      </div>
    </div>
  )
}

function CardItemsEditor({
  addLabel = 'Add item',
  emptyLabel = 'No manual items yet. The block may still load content from its collection.',
  fieldLabel,
  items,
  onChange,
}: {
  addLabel?: string
  emptyLabel?: string
  fieldLabel: string
  items?: ComposerCardItem[]
  onChange: (items: ComposerCardItem[]) => void
}) {
  const currentItems = items || []

  function updateItem(index: number, patch: Partial<ComposerCardItem>) {
    onChange(currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= currentItems.length) return

    const nextItems = [...currentItems]
    const [item] = nextItems.splice(index, 1)
    nextItems.splice(nextIndex, 0, item)
    onChange(nextItems)
  }

  return (
    <div className="visual-composer__arrayEditor">
      <div className="visual-composer__arrayHeader">
        <span>{fieldLabel}</span>
        <button onClick={() => onChange([...currentItems, { icon: '+', summary: '', title: 'New item', url: '' }])} type="button">
          {addLabel}
        </button>
      </div>
      {!currentItems.length ? <p>{emptyLabel}</p> : null}
      {currentItems.map((item, index) => (
        <div className="visual-composer__arrayItem" key={`${item.title || 'item'}-${index}`}>
          <div className="visual-composer__arrayItemHeader">
            <strong>{item.title || `Item ${index + 1}`}</strong>
            <div>
              <button disabled={index === 0} onClick={() => moveItem(index, -1)} type="button">
                Up
              </button>
              <button disabled={index === currentItems.length - 1} onClick={() => moveItem(index, 1)} type="button">
                Down
              </button>
              <button onClick={() => onChange(currentItems.filter((_, itemIndex) => itemIndex !== index))} type="button">
                Remove
              </button>
            </div>
          </div>
          <div className="visual-composer__fieldGrid">
            <TextField label="Title" onChange={(value) => updateItem(index, { title: value })} value={item.title} />
            <TextField label="Icon" onChange={(value) => updateItem(index, { icon: value })} value={item.icon} />
          </div>
          <TextAreaField label="Summary" onChange={(value) => updateItem(index, { summary: value })} value={item.summary} />
          <TextField label="Optional URL" onChange={(value) => updateItem(index, { url: value })} value={item.url} />
        </div>
      ))}
    </div>
  )
}

function StatItemsEditor({
  fieldLabel,
  items,
  onChange,
}: {
  fieldLabel: string
  items?: ComposerStatItem[]
  onChange: (items: ComposerStatItem[]) => void
}) {
  const currentItems = items || []

  function updateItem(index: number, patch: Partial<ComposerStatItem>) {
    onChange(currentItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="visual-composer__arrayEditor">
      <div className="visual-composer__arrayHeader">
        <span>{fieldLabel}</span>
        <button onClick={() => onChange([...currentItems, { label: 'Metric label', value: '99%' }])} type="button">
          Add
        </button>
      </div>
      {currentItems.map((item, index) => (
        <div className="visual-composer__arrayItem" key={`${item.label || 'stat'}-${index}`}>
          <div className="visual-composer__fieldGrid">
            <TextField label="Value" onChange={(value) => updateItem(index, { value })} value={item.value} />
            <TextField label="Label" onChange={(value) => updateItem(index, { label: value })} value={item.label} />
          </div>
          <button onClick={() => onChange(currentItems.filter((_, itemIndex) => itemIndex !== index))} type="button">
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

function getMediaOption(mediaOptions: MediaOption[], value?: MediaReference) {
  if (!value) return null
  return mediaOptions.find((media) => String(media.id) === String(value)) || null
}

function getMediaPreviewUrl(media?: MediaOption | null) {
  if (!media) return ''
  return media.sizes?.card?.url || media.sizes?.thumbnail?.url || media.url || (media.filename ? `/api/media/file/${media.filename}` : '')
}

function MediaPreview({
  label,
  mediaOptions,
  onSelect,
  value,
}: {
  label: string
  mediaOptions: MediaOption[]
  onSelect?: () => void
  value?: MediaReference
}) {
  const media = getMediaOption(mediaOptions, value)
  const previewUrl = getMediaPreviewUrl(media)
  const title = media?.title || media?.alt || media?.filename || (value ? `Media ${value}` : 'No media selected')

  return (
    <button className="visual-composer__mediaPreview" onClick={onSelect} type="button">
      <span>{label}</span>
      {previewUrl ? (
        <div
          aria-label={title}
          className="visual-composer__mediaPreviewImage"
          role="img"
          style={{ backgroundImage: `url("${previewUrl}")` }}
        />
      ) : (
        <div className="visual-composer__mediaPreviewEmpty">No preview available</div>
      )}
      <strong>{title}</strong>
      <small>{media ? `ID ${media.id}` : 'Choose an image from Media, or upload one first.'}</small>
    </button>
  )
}

function MediaLibrary({
  activeField,
  mediaOptions,
  mediaSearch,
  onChoose,
  onClose,
  onSearch,
  selectedValue,
}: {
  activeField: MediaFieldName
  mediaOptions: MediaOption[]
  mediaSearch: string
  onChoose: (value: number | string | null) => void
  onClose: () => void
  onSearch: (value: string) => void
  selectedValue?: MediaReference
}) {
  const normalizedSearch = mediaSearch.trim().toLowerCase()
  const visibleMedia = normalizedSearch
    ? mediaOptions.filter((media) =>
        [media.title, media.alt, media.filename, String(media.id)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
      )
    : mediaOptions.slice(0, 18)

  return (
    <div className="visual-composer__mediaLibrary">
      <div className="visual-composer__mediaLibraryHeader">
        <div>
          <strong>{activeField === 'image' ? 'Choose main image' : 'Choose background / hero image'}</strong>
          <small>Select an asset below. Save the block when the preview looks right.</small>
        </div>
        <div>
          <button onClick={() => onChoose(null)} type="button">
            Clear
          </button>
          <button onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
      <input
        aria-label="Search media"
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Search media by title, alt text, or filename"
        type="search"
        value={mediaSearch}
      />
      <div className="visual-composer__mediaGrid">
        {visibleMedia.map((media) => {
          const previewUrl = getMediaPreviewUrl(media)
          const title = media.title || media.alt || media.filename || `Media ${media.id}`
          const isSelected = selectedValue ? String(selectedValue) === String(media.id) : false

          return (
            <button data-selected={isSelected} key={media.id} onClick={() => onChoose(media.id)} type="button">
              {previewUrl ? <span style={{ backgroundImage: `url("${previewUrl}")` }} /> : <span data-empty="true">No preview</span>}
              <strong>{title}</strong>
              <small>{media.filename || `ID ${media.id}`}</small>
            </button>
          )
        })}
      </div>
      {!visibleMedia.length ? <p className="visual-composer__mediaEmpty">No media matches that search.</p> : null}
    </div>
  )
}

function blockSupportsCards(blockType?: string) {
  return blockType ? cardBlockTypes.has(blockType) : false
}

function blockSupportsPrimaryImage(blockType?: string) {
  return blockType ? primaryImageBlockTypes.has(blockType) : false
}

function getBlockGuide(blockType?: string) {
  if (blockType === 'hero') {
    return 'Hero blocks control the first screen: headline, CTA, stats, and the main visual. Use Media position to switch between side image, full background, or no image.'
  }

  if (blockType && primaryImageBlockTypes.has(blockType)) {
    return 'This block supports a main image plus layout controls. Replace the main image here, then adjust fit, ratio, anchor, and mobile behavior below.'
  }

  if (blockType && cardBlockTypes.has(blockType)) {
    return 'This block renders repeated cards from CMS content. Use the visual controls for density, columns, spacing, and mobile layout without editing every card manually.'
  }

  return 'Use these safe controls for section text, spacing, colors, background media, and mobile behavior. For advanced content fields, open the Payload editor.'
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

function getCardArrayConfig(blockType?: string): { emptyLabel?: string; field: 'items' | 'options' | 'rows' | 'steps'; label: string } | null {
  if (blockType === 'processTimeline') return { field: 'steps', label: 'Timeline steps' }
  if (blockType === 'pricingOptions') return { field: 'options', label: 'Pricing / plan cards' }
  if (blockType === 'comparisonTable') return { field: 'rows', label: 'Comparison rows' }
  if (['featureCards', 'mobileAppPreview', 'servicesGrid', 'industryCards', 'testimonials', 'trustBar'].includes(blockType || '')) {
    return {
      emptyLabel: 'No manual cards. This block can still use published CMS collection content when available.',
      field: 'items',
      label: blockType === 'testimonials' ? 'Manual testimonials' : 'Manual cards',
    }
  }

  return null
}

function blockSupportsItemLimit(blockType?: string) {
  return ['industryCards', 'servicesGrid', 'testimonials'].includes(blockType || '')
}

function blockSupportsCategory(blockType?: string) {
  return blockType === 'faqAccordion' || blockType === 'resourceList'
}

function blockSupportsBody(blockType?: string) {
  return blockType === 'richText'
}

export function VisualComposerClient({
  initialPageId,
  initialViewport,
  mediaOptions: initialMediaOptions,
  pages: initialPages,
  siteUrl,
}: VisualComposerClientProps) {
  const [pages, setPages] = useState(initialPages)
  const [mediaOptions, setMediaOptions] = useState(initialMediaOptions)
  const [selectedPageId, setSelectedPageId] = useState<number | string | undefined>(initialPageId)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0)
  const [selectedPreviewSize, setSelectedPreviewSize] = useState(initialViewport)
  const [editorBlock, setEditorBlock] = useState<PageBlock | null>(() => {
    const page = getSelectedPage(initialPages, initialPageId)
    return page?.layout?.[0] ? cloneBlock(page.layout[0]) : null
  })
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState('')
  const [structureState, setStructureState] = useState<StructureState>('idle')
  const [structureMessage, setStructureMessage] = useState('')
  const [newBlockType, setNewBlockType] = useState(insertBlockOptions[0].value)
  const [activeMediaField, setActiveMediaField] = useState<MediaFieldName>('backgroundImage')
  const [mediaPanelMode, setMediaPanelMode] = useState<MediaPanelMode>('closed')
  const [mediaSearch, setMediaSearch] = useState('')
  const [mediaMessage, setMediaMessage] = useState('')
  const [mediaUploadState, setMediaUploadState] = useState<UploadState>('idle')
  const [previewVersion, setPreviewVersion] = useState(0)
  const previewRef = useRef<HTMLIFrameElement>(null)

  const selectedPage = useMemo(() => getSelectedPage(pages, selectedPageId), [pages, selectedPageId])
  const selectedBlock = selectedPage?.layout?.[selectedBlockIndex] || null
  const selectedBlockType = selectedBlock?.blockType
  const selectedBlockPresets = getBlockPresets(selectedBlockType)
  const selectedCardArrayConfig = getCardArrayConfig(selectedBlockType)
  const showCardControls = blockSupportsCards(selectedBlockType)
  const showPrimaryImage = blockSupportsPrimaryImage(selectedBlockType)
  const effectiveMediaField: MediaFieldName = showPrimaryImage ? activeMediaField : 'backgroundImage'
  const effectiveMediaValue = editorBlock?.[effectiveMediaField]
  const hasUnsavedBlockChanges = saveState === 'dirty'
  const structureBusy = structureState === 'saving'
  const structureActionsDisabled = structureBusy || hasUnsavedBlockChanges
  const previewUrl = publicUrlFromSlug(siteUrl, selectedPage?.slug, selectedBlockIndex, previewVersion)

  function selectPage(page: PageSummary) {
    setSelectedPageId(page.id)
    setSelectedBlockIndex(0)
    setEditorBlock(page.layout?.[0] ? cloneBlock(page.layout[0]) : null)
    setSaveState('idle')
    setMessage('')
    setStructureState('idle')
    setStructureMessage('')
  }

  function selectBlock(block: PageBlock, index: number) {
    setSelectedBlockIndex(index)
    setEditorBlock(cloneBlock(block))
    setSaveState('idle')
    setMessage('')
    setStructureState('idle')
    setStructureMessage('')
  }

  function applyUpdatedPage(updatedPage: PageSummary, nextBlockIndex: number, notice: string) {
    const safeIndex = Math.max(0, Math.min(nextBlockIndex, (updatedPage.layout?.length || 1) - 1))

    setPages((current) => current.map((page) => (String(page.id) === String(updatedPage.id) ? updatedPage : page)))
    setSelectedPageId(updatedPage.id)
    setSelectedBlockIndex(safeIndex)
    setEditorBlock(updatedPage.layout?.[safeIndex] ? cloneBlock(updatedPage.layout[safeIndex]) : null)
    setSaveState('idle')
    setMessage('')
    setStructureState('success')
    setStructureMessage(notice)
    setPreviewVersion((current) => current + 1)
  }

  async function applyLayoutAction(action: LayoutAction, notice: string) {
    if (!selectedPage) return

    setStructureState('saving')
    setStructureMessage('')

    const response = await fetch(`/api/visual-composer/pages/${selectedPage.id}/layout`, {
      body: JSON.stringify({ action }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
    })

    const result = (await response.json().catch(() => null)) as { error?: string; page?: PageSummary; selectedBlockIndex?: number } | null

    if (!response.ok || !result?.page) {
      setStructureState('error')
      setStructureMessage(result?.error || 'The page structure could not be updated.')
      return
    }

    applyUpdatedPage(result.page, result.selectedBlockIndex ?? selectedBlockIndex, notice)
  }

  function deleteBlock(index: number) {
    const block = selectedPage?.layout?.[index]
    const title = block ? getBlockTitle(block, index) : `Block ${index + 1}`

    if (!window.confirm(`Delete "${title}" from this page? This cannot be undone without restoring a backup or editing history.`)) {
      return
    }

    void applyLayoutAction({ index, type: 'delete' }, 'Block deleted.')
  }

  function markDirty() {
    setSaveState('dirty')
    setMessage('Unsaved changes. Save to refresh the preview.')
  }

  function updateBlockField(field: keyof PageBlock, value: MediaReference | ComposerCardItem[] | ComposerContactItem[] | ComposerLink | ComposerStatItem[] | number | string | null) {
    setEditorBlock((current) => ({ ...(current || {}), [field]: value }))
    markDirty()
  }

  function updateDesignField(field: keyof NonNullable<PageBlock['design']>, value: string) {
    setEditorBlock((current) => ({
      ...(current || {}),
      design: {
        ...(current?.design || {}),
        [field]: value,
      },
    }))
    markDirty()
  }

  function chooseMedia(value: number | string | null) {
    updateBlockField(effectiveMediaField, value)
    setMediaUploadState('idle')
    setMediaMessage(value ? 'Media selected. Save the block to publish it.' : 'Media cleared. Save the block to publish it.')
    setMediaPanelMode('closed')
  }

  function openMediaPanel(field: MediaFieldName, mode: Exclude<MediaPanelMode, 'closed'>) {
    setActiveMediaField(field)
    setMediaPanelMode(mode)
    setMediaUploadState('idle')
    setMediaMessage('')
  }

  async function refreshMediaLibrary() {
    setMediaUploadState('idle')
    setMediaMessage('Refreshing media library...')

    const response = await fetch('/api/visual-composer/media', {
      credentials: 'same-origin',
    })

    if (!response.ok) {
      setMediaUploadState('error')
      setMediaMessage('Media library could not be refreshed.')
      return
    }

    const result = (await response.json()) as { media?: MediaOption[] }
    setMediaOptions(result.media || [])
    setMediaMessage('Media library refreshed.')
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    if (!formData.get('file')) {
      setMediaUploadState('error')
      setMediaMessage('Choose a file before uploading.')
      return
    }

    setMediaUploadState('uploading')
    setMediaMessage('Uploading media...')

    const response = await fetch('/api/visual-composer/media', {
      body: formData,
      credentials: 'same-origin',
      method: 'POST',
    })

    const result = (await response.json().catch(() => null)) as { error?: string; media?: MediaOption } | null

    if (!response.ok || !result?.media) {
      setMediaUploadState('error')
      setMediaMessage(result?.error || 'Media could not be uploaded.')
      return
    }

    setMediaOptions((current) => [result.media as MediaOption, ...current.filter((media) => String(media.id) !== String(result.media?.id))])
    updateBlockField(effectiveMediaField, result.media.id)
    setMediaUploadState('success')
    setMediaMessage('Uploaded and selected. Save the block to publish it.')
    setMediaPanelMode('closed')
    form.reset()
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
                    <li
                      className="visual-composer__blockItem"
                      data-active={index === selectedBlockIndex}
                      data-hidden={Boolean(block.hidden)}
                      key={`${block.blockType || 'block'}-${index}`}
                    >
                      <button className="visual-composer__blockSelect" onClick={() => selectBlock(block, index)} type="button">
                        <span>{index + 1}</span>
                        <div>
                          <strong>{getBlockTitle(block, index)}</strong>
                          <small>
                            {getBlockLabel(block.blockType)}
                            {block.hidden ? ' - Hidden' : ''}
                          </small>
                        </div>
                      </button>
                      <div className="visual-composer__blockActions" aria-label={`Actions for ${getBlockTitle(block, index)}`}>
                        <button
                          disabled={structureActionsDisabled || index === 0}
                          onClick={() => void applyLayoutAction({ fromIndex: index, toIndex: index - 1, type: 'move' }, 'Block moved up.')}
                          type="button"
                        >
                          Up
                        </button>
                        <button
                          disabled={structureActionsDisabled || index >= (selectedPage.layout?.length || 0) - 1}
                          onClick={() => void applyLayoutAction({ fromIndex: index, toIndex: index + 1, type: 'move' }, 'Block moved down.')}
                          type="button"
                        >
                          Down
                        </button>
                        <button
                          disabled={structureActionsDisabled}
                          onClick={() => void applyLayoutAction({ index, type: 'duplicate' }, 'Block duplicated.')}
                          type="button"
                        >
                          Duplicate
                        </button>
                        <button
                          disabled={structureActionsDisabled}
                          onClick={() => void applyLayoutAction({ hidden: !block.hidden, index, type: 'toggleHidden' }, block.hidden ? 'Block shown.' : 'Block hidden.')}
                          type="button"
                        >
                          {block.hidden ? 'Show' : 'Hide'}
                        </button>
                        <button disabled={structureActionsDisabled || (selectedPage.layout?.length || 0) <= 1} onClick={() => deleteBlock(index)} type="button">
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="visual-composer__insertBlock">
                  <label>
                    <span>Add block</span>
                    <select onChange={(event) => setNewBlockType(event.target.value)} value={newBlockType}>
                      {insertBlockOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    disabled={structureActionsDisabled}
                    onClick={() =>
                      void applyLayoutAction(
                        { afterIndex: selectedBlockIndex, blockType: newBlockType, type: 'insert' },
                        'Block added.',
                      )
                    }
                    type="button"
                  >
                    Add after selected
                  </button>
                </div>
                {hasUnsavedBlockChanges ? <p className="visual-composer__structureNote">Save the selected block before changing page structure.</p> : null}
                {structureMessage ? <p className={`visual-composer__message visual-composer__message--${structureState}`}>{structureMessage}</p> : null}
              </details>

              <section className="visual-composer__editor">
                <div className="visual-composer__editorHeader">
                  <div>
                    <p className="visual-composer__eyebrow">Block inspector</p>
                    <h2>{selectedBlock ? getBlockTitle(selectedBlock, selectedBlockIndex) : 'No block selected'}</h2>
                    <span>{selectedBlock ? getBlockLabel(selectedBlock.blockType) : 'Select a block to edit.'}</span>
                    {saveState === 'dirty' ? <strong className="visual-composer__status">Unsaved changes</strong> : null}
                  </div>
                  <button
                    className="visual-composer__button visual-composer__button--primary"
                    disabled={!editorBlock || saveState === 'saving' || saveState === 'idle' || saveState === 'saved'}
                    onClick={saveBlock}
                    type="button"
                  >
                    {saveState === 'saving' ? 'Saving...' : 'Save'}
                  </button>
                </div>

                {editorBlock ? (
                  <div className="visual-composer__form">
                    <section className="visual-composer__presetGroup" aria-label="Section presets">
                      <p className="visual-composer__blockGuide">{getBlockGuide(selectedBlockType)}</p>
                      <span>Quick presets</span>
                      <div>
                        {selectedBlockPresets.map((preset) => (
                          <button key={preset.label} onClick={() => applyPreset(preset)} type="button">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="visual-composer__mediaPanel" aria-label="Media controls">
                      <div className="visual-composer__mediaHeader">
                        <div>
                          <span>Media</span>
                          <small>Keep the current media visible, then replace it only when needed.</small>
                        </div>
                        <div>
                          <button onClick={refreshMediaLibrary} type="button">
                            Refresh
                          </button>
                        </div>
                      </div>
                      <div className="visual-composer__mediaTargets" role="group" aria-label="Media target">
                        {showPrimaryImage ? (
                          <button
                            data-active={effectiveMediaField === 'image'}
                            onClick={() => {
                              setActiveMediaField('image')
                              setMediaPanelMode('closed')
                            }}
                            type="button"
                          >
                            Main image
                          </button>
                        ) : null}
                        <button
                          data-active={effectiveMediaField === 'backgroundImage'}
                          onClick={() => {
                            setActiveMediaField('backgroundImage')
                            setMediaPanelMode('closed')
                          }}
                          type="button"
                        >
                          {selectedBlockType === 'hero' ? 'Hero / background' : 'Background'}
                        </button>
                      </div>
                      <div className="visual-composer__mediaLayoutControls">
                        <SelectField
                          label="Media position"
                          onChange={(value) => updateBlockField('mediaPosition', value)}
                          options={selectOptions.mediaPosition}
                          value={editorBlock.mediaPosition}
                        />
                        <small>
                          {selectedBlockType === 'hero'
                            ? 'Use right for the dashboard image, background for a full hero background, or none to hide media.'
                            : 'Use background to place the selected image behind the section, or none to hide media.'}
                        </small>
                      </div>
                      <div className="visual-composer__mediaPreviewGrid">
                        {showPrimaryImage ? (
                          <MediaPreview
                            label="Main image preview"
                            mediaOptions={mediaOptions}
                            onSelect={() => openMediaPanel('image', 'library')}
                            value={editorBlock.image}
                          />
                        ) : null}
                        <MediaPreview
                          label={selectedBlockType === 'hero' ? 'Hero/background preview' : 'Background preview'}
                          mediaOptions={mediaOptions}
                          onSelect={() => openMediaPanel('backgroundImage', 'library')}
                          value={editorBlock.backgroundImage}
                        />
                      </div>
                      <div className="visual-composer__mediaActions">
                        <div>
                          <strong>{effectiveMediaField === 'image' ? 'Main image' : selectedBlockType === 'hero' ? 'Hero / background' : 'Background'}</strong>
                          <small>Select which media slot you want to replace, then choose a source.</small>
                        </div>
                        <div>
                          <button onClick={() => setMediaPanelMode(mediaPanelMode === 'library' ? 'closed' : 'library')} type="button">
                            Replace from library
                          </button>
                          <button onClick={() => setMediaPanelMode(mediaPanelMode === 'upload' ? 'closed' : 'upload')} type="button">
                            Upload new
                          </button>
                        </div>
                      </div>
                      {mediaPanelMode === 'library' ? (
                        <MediaLibrary
                          activeField={effectiveMediaField}
                          mediaOptions={mediaOptions}
                          mediaSearch={mediaSearch}
                          onChoose={chooseMedia}
                          onClose={() => setMediaPanelMode('closed')}
                          onSearch={setMediaSearch}
                          selectedValue={effectiveMediaValue}
                        />
                      ) : null}
                      {mediaPanelMode === 'upload' ? (
                        <form className="visual-composer__uploadForm" onSubmit={uploadMedia}>
                          <div>
                            <strong>Upload and select</strong>
                            <small>Images, SVG, GIF, and PDF use the same Media rules configured in Payload.</small>
                          </div>
                          <input accept="image/*,application/pdf" name="file" type="file" />
                          <div className="visual-composer__uploadFields">
                            <label>
                              <span>Title</span>
                              <input name="title" placeholder="Optional title" type="text" />
                            </label>
                            <label>
                              <span>Alt text</span>
                              <input name="alt" placeholder="Optional alt text" type="text" />
                            </label>
                          </div>
                          <div className="visual-composer__uploadActions">
                            <button
                              className="visual-composer__button visual-composer__button--primary"
                              disabled={mediaUploadState === 'uploading'}
                              type="submit"
                            >
                              {mediaUploadState === 'uploading' ? 'Uploading...' : 'Upload and select'}
                            </button>
                            <button className="visual-composer__button" onClick={() => setMediaPanelMode('closed')} type="button">
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : null}
                      {mediaMessage ? <p className={`visual-composer__message visual-composer__message--${mediaUploadState}`}>{mediaMessage}</p> : null}
                    </section>

                    <TextField label="Section ID" onChange={(value) => updateBlockField('sectionId', value)} value={editorBlock.sectionId} />
                    <TextField label="Eyebrow" onChange={(value) => updateBlockField('eyebrow', value)} value={editorBlock.eyebrow} />
                    <TextField label="Title" onChange={(value) => updateBlockField('title', value)} value={editorBlock.title} />
                    <TextField label="Highlight text" onChange={(value) => updateBlockField('highlightText', value)} value={editorBlock.highlightText} />
                    <TextAreaField label="Summary" onChange={(value) => updateBlockField('summary', value)} value={editorBlock.summary} />

                    <details className="visual-composer__editorGroup" open>
                      <summary>Block content</summary>
                      <div>
                        {blockSupportsBody(selectedBlockType) ? (
                          <TextAreaField label="Body" onChange={(value) => updateBlockField('body', value)} value={editorBlock.body} />
                        ) : null}

                        {blockSupportsCategory(selectedBlockType) ? (
                          <TextField
                            label={selectedBlockType === 'faqAccordion' ? 'FAQ category' : 'Resource category'}
                            onChange={(value) => updateBlockField('category', value)}
                            value={editorBlock.category}
                          />
                        ) : null}

                        {blockSupportsItemLimit(selectedBlockType) ? (
                          <NumberField label="Item limit" max={24} min={1} onChange={(value) => updateBlockField('itemLimit', value)} value={editorBlock.itemLimit} />
                        ) : null}

                        {selectedBlockType === 'smartfiche' ? (
                          <TextField label="SmartFiche URL" onChange={(value) => updateBlockField('smartFicheUrl', value)} value={editorBlock.smartFicheUrl} />
                        ) : null}

                        {selectedBlockType === 'hero' || selectedBlockType === 'stats' ? (
                          <StatItemsEditor fieldLabel={selectedBlockType === 'hero' ? 'Hero stats' : 'Metrics'} items={editorBlock.stats} onChange={(items) => updateBlockField('stats', items)} />
                        ) : null}

                        {selectedBlockType === 'hero' ? (
                          <StatItemsEditor fieldLabel="Hero badges" items={editorBlock.badges} onChange={(items) => updateBlockField('badges', items)} />
                        ) : null}

                        {selectedCardArrayConfig ? (
                          <CardItemsEditor
                            emptyLabel={selectedCardArrayConfig.emptyLabel}
                            fieldLabel={selectedCardArrayConfig.label}
                            items={editorBlock[selectedCardArrayConfig.field]}
                            onChange={(items) => updateBlockField(selectedCardArrayConfig.field, items)}
                          />
                        ) : null}

                        {selectedBlockType === 'contactForm' ? (
                          <CardItemsEditor
                            addLabel="Add contact item"
                            emptyLabel="No contact details configured for this section."
                            fieldLabel="Contact details"
                            items={editorBlock.contactItems?.map((item) => ({
                              icon: item.icon,
                              summary: item.value,
                              title: item.label,
                            }))}
                            onChange={(items) =>
                              updateBlockField(
                                'contactItems',
                                items.map((item) => ({ icon: item.icon, label: item.title, value: item.summary })),
                              )
                            }
                          />
                        ) : null}

                        {['ctaBanner', 'hero', 'imageText', 'recoveryEmergencyCta', 'splitHero'].includes(selectedBlockType || '') ? (
                          <LinkGroupEditor label="Primary CTA" onChange={(value) => updateBlockField('primaryCta', value)} value={editorBlock.primaryCta} />
                        ) : null}

                        {['hero', 'imageText', 'splitHero'].includes(selectedBlockType || '') ? (
                          <LinkGroupEditor label="Secondary CTA" onChange={(value) => updateBlockField('secondaryCta', value)} value={editorBlock.secondaryCta} />
                        ) : null}

                        {['industryCards', 'servicesGrid'].includes(selectedBlockType || '') ? (
                          <LinkGroupEditor label="View all CTA" onChange={(value) => updateBlockField('viewAllCta', value)} value={editorBlock.viewAllCta} />
                        ) : null}
                      </div>
                    </details>

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
                      <summary>Media display options</summary>
                      <div className="visual-composer__fieldGrid">
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
                      </div>
                    </details>

                    <details className="visual-composer__editorGroup">
                      <summary>Cards and mobile</summary>
                      <div className="visual-composer__fieldGrid">
                        {showCardControls ? (
                          <>
                            <SelectField label="Card density" onChange={(value) => updateDesignField('cardDensity', value)} options={selectOptions.cardDensity} value={editorBlock.design?.cardDensity} />
                            <SelectField label="Card columns" onChange={(value) => updateDesignField('cardColumns', value)} options={selectOptions.cardColumns} value={editorBlock.design?.cardColumns} />
                          </>
                        ) : null}
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
