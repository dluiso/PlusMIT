import type { Block } from 'payload'

const linkFields = [
  { name: 'label', type: 'text' as const },
  { name: 'url', type: 'text' as const },
]

const cardFields = [
  { name: 'title', type: 'text' as const, required: true },
  { name: 'summary', type: 'textarea' as const },
  { name: 'icon', type: 'text' as const },
  { name: 'url', type: 'text' as const },
]

const listField = (name: string, label: string) => ({
  name,
  label,
  type: 'array' as const,
  fields: [{ name: 'text', type: 'text' as const, required: true }],
})

const designControls = [
  {
    name: 'titleSize',
    label: 'Title size',
    type: 'select' as const,
    defaultValue: 'auto',
    options: ['auto', 'small', 'medium', 'large', 'display'],
    admin: { description: 'Use display only for short hero headlines. Large is usually best for home sections.' },
  },
  {
    name: 'summarySize',
    label: 'Summary size',
    type: 'select' as const,
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
  },
  {
    name: 'eyebrowColor',
    label: 'Eyebrow color',
    type: 'select' as const,
    defaultValue: 'primary',
    options: ['default', 'primary', 'secondary', 'muted', 'light', 'dark', 'custom'],
  },
  {
    name: 'titleColor',
    label: 'Title color',
    type: 'select' as const,
    defaultValue: 'default',
    options: ['default', 'primary', 'secondary', 'muted', 'light', 'dark', 'custom'],
  },
  {
    name: 'summaryColor',
    label: 'Summary color',
    type: 'select' as const,
    defaultValue: 'default',
    options: ['default', 'primary', 'secondary', 'muted', 'light', 'dark', 'custom'],
  },
  {
    name: 'customEyebrowColor',
    label: 'Custom eyebrow color',
    type: 'text' as const,
    admin: { description: 'Optional hex color, for example #2563eb. Used only when Eyebrow color is Custom.' },
  },
  {
    name: 'customTitleColor',
    label: 'Custom title color',
    type: 'text' as const,
    admin: { description: 'Optional hex color, for example #0f172a. Used only when Title color is Custom.' },
  },
  {
    name: 'customSummaryColor',
    label: 'Custom summary color',
    type: 'text' as const,
    admin: { description: 'Optional hex color, for example #475569. Used only when Summary color is Custom.' },
  },
  {
    name: 'customBackgroundColor',
    label: 'Custom background color',
    type: 'text' as const,
    admin: { description: 'Optional hex color for this section background, for example #f8fafc.' },
  },
  {
    name: 'cardDensity',
    label: 'Card density',
    type: 'select' as const,
    defaultValue: 'comfortable',
    options: ['compact', 'comfortable', 'spacious'],
  },
  {
    name: 'cardColumns',
    label: 'Card columns',
    type: 'select' as const,
    defaultValue: 'auto',
    options: ['auto', 'two', 'three', 'four'],
  },
  {
    name: 'mediaSize',
    label: 'Media size',
    type: 'select' as const,
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
  },
  {
    name: 'mediaFit',
    dbName: 'm_fit',
    label: 'Media fit',
    type: 'select' as const,
    defaultValue: 'cover',
    options: ['cover', 'contain', 'fill'],
    admin: { description: 'Use contain for diagrams, logos, screenshots, or graphics that should not be cropped.' },
  },
  {
    name: 'mediaAspectRatio',
    dbName: 'm_ratio',
    label: 'Media aspect ratio',
    type: 'select' as const,
    defaultValue: 'auto',
    options: ['auto', 'natural', 'wide', 'cinematic', 'square', 'tall'],
    admin: { description: 'Use natural with Media fit = contain to preserve the original image proportions.' },
  },
  {
    name: 'mediaObjectPosition',
    dbName: 'm_pos',
    label: 'Media focal position',
    type: 'select' as const,
    defaultValue: 'center',
    options: ['center', 'top', 'bottom', 'left', 'right'],
  },
  {
    name: 'mediaFrame',
    dbName: 'm_frame',
    label: 'Media frame',
    type: 'select' as const,
    defaultValue: 'card',
    options: ['none', 'card', 'border', 'shadow'],
  },
  {
    name: 'mediaPadding',
    dbName: 'm_pad',
    label: 'Media padding',
    type: 'select' as const,
    defaultValue: 'none',
    options: ['none', 'small', 'medium', 'large'],
  },
  {
    name: 'mediaBackgroundColor',
    label: 'Media background color',
    type: 'text' as const,
    admin: { description: 'Optional hex color behind contained media, for example #ffffff.' },
  },
  {
    name: 'mobileLayout',
    dbName: 'mob_layout',
    label: 'Mobile layout',
    type: 'select' as const,
    defaultValue: 'stack',
    options: ['inherit', 'stack', 'textFirst', 'mediaFirst'],
  },
  {
    name: 'mobileMedia',
    dbName: 'mob_media',
    label: 'Mobile media',
    type: 'select' as const,
    defaultValue: 'show',
    options: ['show', 'hide'],
  },
  {
    name: 'mobileSpacing',
    dbName: 'mob_space',
    label: 'Mobile spacing',
    type: 'select' as const,
    defaultValue: 'standard',
    options: ['compact', 'standard'],
  },
  {
    name: 'mobileCtaLayout',
    dbName: 'mob_cta',
    label: 'Mobile CTA layout',
    type: 'select' as const,
    defaultValue: 'stack',
    options: ['stack', 'inline', 'hideSecondary'],
  },
]

const sectionBase = [
  {
    name: 'hidden',
    label: 'Hide section on public site',
    type: 'checkbox' as const,
    defaultValue: false,
    admin: { description: 'Hidden sections stay editable in the CMS and Visual Composer, but do not render publicly.' },
  },
  {
    name: 'sectionId',
    label: 'Section anchor ID',
    type: 'text' as const,
    admin: { description: 'Optional anchor without #, for example services, industries, solutions, or contact.' },
  },
  { name: 'eyebrow', type: 'text' as const },
  { name: 'title', type: 'text' as const, required: true },
  {
    name: 'highlightText',
    type: 'text' as const,
    admin: { description: 'Optional exact title text to emphasize with the brand color.' },
  },
  { name: 'summary', type: 'textarea' as const },
  {
    name: 'theme',
    type: 'select' as const,
    defaultValue: 'default',
    options: ['default', 'white', 'soft', 'dark', 'blue', 'splitDarkBlue'],
  },
  {
    name: 'layoutVariant',
    type: 'select' as const,
    defaultValue: 'default',
    options: ['default', 'compact', 'centered', 'split', 'dashboard', 'contact'],
  },
  {
    name: 'textAlign',
    type: 'select' as const,
    defaultValue: 'left',
    options: ['left', 'center', 'right'],
  },
  {
    name: 'mediaPosition',
    type: 'select' as const,
    defaultValue: 'right',
    options: ['left', 'right', 'top', 'bottom', 'background', 'none'],
  },
  {
    name: 'spacing',
    type: 'select' as const,
    defaultValue: 'standard',
    options: ['compact', 'standard', 'spacious'],
  },
  {
    name: 'maxWidth',
    type: 'select' as const,
    defaultValue: 'standard',
    options: ['narrow', 'standard', 'wide'],
  },
  {
    name: 'design',
    label: 'Design controls',
    type: 'group' as const,
    admin: { description: 'Optional visual controls for this block. Leave defaults for consistent styling.' },
    fields: designControls,
  },
  { name: 'backgroundImage', type: 'upload' as const, relationTo: 'media' as const },
  { name: 'overlayOpacity', type: 'number' as const, min: 0, max: 90, defaultValue: 0 },
]

export const blocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
    fields: [
      ...sectionBase,
      { name: 'primaryCta', type: 'group', fields: linkFields },
      { name: 'secondaryCta', type: 'group', fields: linkFields },
      {
        name: 'stats',
        type: 'array',
        fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'label', type: 'text', required: true },
        ],
      },
      {
        name: 'badges',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'value', type: 'text' },
        ],
      },
    ],
  },
  {
    slug: 'splitHero',
    labels: { singular: 'Split Hero Block', plural: 'Split Hero Blocks' },
    fields: [
      ...sectionBase,
      { name: 'image', type: 'upload', relationTo: 'media' as const },
      { name: 'primaryCta', type: 'group', fields: linkFields },
      { name: 'secondaryCta', type: 'group', fields: linkFields },
    ],
  },
  {
    slug: 'servicesGrid',
    labels: { singular: 'Services Grid', plural: 'Services Grids' },
    fields: [
      ...sectionBase,
      { name: 'items', type: 'array', fields: cardFields },
      { name: 'itemLimit', type: 'number', defaultValue: 8, min: 1, max: 24 },
      { name: 'viewAllCta', type: 'group', fields: linkFields },
    ],
  },
  {
    slug: 'featuredService',
    labels: { singular: 'Featured Service', plural: 'Featured Services' },
    fields: [...sectionBase, { name: 'service', type: 'relationship', relationTo: 'services' as const }],
  },
  {
    slug: 'industryCards',
    labels: { singular: 'Industry Cards', plural: 'Industry Cards' },
    fields: [
      ...sectionBase,
      { name: 'items', type: 'array', fields: cardFields },
      { name: 'itemLimit', type: 'number', defaultValue: 6, min: 1, max: 24 },
      { name: 'viewAllCta', type: 'group', fields: linkFields },
    ],
  },
  {
    slug: 'processTimeline',
    labels: { singular: 'Process Timeline', plural: 'Process Timelines' },
    fields: [...sectionBase, { name: 'steps', type: 'array', fields: cardFields }],
  },
  {
    slug: 'featureCards',
    labels: { singular: 'Feature Cards', plural: 'Feature Cards' },
    fields: [...sectionBase, { name: 'items', type: 'array', fields: cardFields }],
  },
  {
    slug: 'trustBar',
    labels: { singular: 'Trust Bar', plural: 'Trust Bars' },
    fields: [...sectionBase, { name: 'items', type: 'array', fields: cardFields }],
  },
  {
    slug: 'stats',
    labels: { singular: 'Stats / Metrics Block', plural: 'Stats / Metrics Blocks' },
    fields: [
      ...sectionBase,
      {
        name: 'stats',
        type: 'array',
        fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'label', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    slug: 'testimonials',
    labels: { singular: 'Testimonial Carousel', plural: 'Testimonial Carousels' },
    fields: [
      ...sectionBase,
      { name: 'items', type: 'array', fields: cardFields },
      { name: 'itemLimit', type: 'number', defaultValue: 3, min: 1, max: 12 },
    ],
  },
  {
    slug: 'caseStudyHighlight',
    labels: { singular: 'Case Study Highlight', plural: 'Case Study Highlights' },
    fields: [...sectionBase, { name: 'caseStudy', type: 'relationship', relationTo: 'case-studies' as const }],
  },
  {
    slug: 'faqAccordion',
    labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
    fields: [...sectionBase, { name: 'category', type: 'text' }],
  },
  {
    slug: 'ctaBanner',
    labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
    fields: [...sectionBase, { name: 'primaryCta', type: 'group', fields: linkFields }],
  },
  {
    slug: 'contactForm',
    labels: { singular: 'Contact Form Block', plural: 'Contact Form Blocks' },
    fields: [
      ...sectionBase,
      { name: 'form', type: 'relationship', relationTo: 'forms' as const },
      {
        name: 'contactItems',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'value', type: 'text', required: true },
          { name: 'icon', type: 'text' },
        ],
      },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Rich Text Block', plural: 'Rich Text Blocks' },
    fields: [...sectionBase, { name: 'body', type: 'textarea' }],
  },
  {
    slug: 'imageText',
    labels: { singular: 'Image + Text Block', plural: 'Image + Text Blocks' },
    fields: [
      ...sectionBase,
      { name: 'image', type: 'upload', relationTo: 'media' as const },
      { name: 'primaryCta', type: 'group', fields: linkFields },
      { name: 'secondaryCta', type: 'group', fields: linkFields },
    ],
  },
  {
    slug: 'technologyStack',
    labels: { singular: 'Technology Stack Block', plural: 'Technology Stack Blocks' },
    fields: [...sectionBase, listField('technologies', 'Technologies')],
  },
  {
    slug: 'comparisonTable',
    labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
    fields: [...sectionBase, { name: 'rows', type: 'array', fields: cardFields }],
  },
  {
    slug: 'pricingOptions',
    labels: { singular: 'Pricing / Engagement Options', plural: 'Pricing / Engagement Options' },
    fields: [...sectionBase, { name: 'options', type: 'array', fields: cardFields }],
  },
  {
    slug: 'securityNotice',
    labels: { singular: 'Security Notice Block', plural: 'Security Notice Blocks' },
    fields: [...sectionBase],
  },
  {
    slug: 'resourceList',
    labels: { singular: 'Blog / Resource List', plural: 'Blog / Resource Lists' },
    fields: [...sectionBase, { name: 'category', type: 'text' }],
  },
  {
    slug: 'smartfiche',
    labels: { singular: 'SmartFiche Integration Block', plural: 'SmartFiche Integration Blocks' },
    fields: [...sectionBase, { name: 'smartFicheUrl', type: 'text' }],
  },
  {
    slug: 'mobileAppPreview',
    labels: { singular: 'Mobile App Preview Block', plural: 'Mobile App Preview Blocks' },
    fields: [...sectionBase, { name: 'items', type: 'array', fields: cardFields }],
  },
  {
    slug: 'recoveryEmergencyCta',
    labels: { singular: 'Recovery Emergency CTA Block', plural: 'Recovery Emergency CTA Blocks' },
    fields: [...sectionBase, { name: 'primaryCta', type: 'group', fields: linkFields }],
  },
]
