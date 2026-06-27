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

const sectionBase = [
  { name: 'eyebrow', type: 'text' as const },
  { name: 'title', type: 'text' as const, required: true },
  { name: 'summary', type: 'textarea' as const },
]

export const blocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero Block', plural: 'Hero Blocks' },
    fields: [
      ...sectionBase,
      { name: 'primaryCta', type: 'group', fields: linkFields },
      { name: 'secondaryCta', type: 'group', fields: linkFields },
      { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'splitHero',
    labels: { singular: 'Split Hero Block', plural: 'Split Hero Blocks' },
    fields: [...sectionBase, { name: 'image', type: 'upload', relationTo: 'media' }],
  },
  {
    slug: 'servicesGrid',
    labels: { singular: 'Services Grid', plural: 'Services Grids' },
    fields: [...sectionBase, { name: 'items', type: 'array', fields: cardFields }],
  },
  {
    slug: 'featuredService',
    labels: { singular: 'Featured Service', plural: 'Featured Services' },
    fields: [...sectionBase, { name: 'service', type: 'relationship', relationTo: 'services' }],
  },
  {
    slug: 'industryCards',
    labels: { singular: 'Industry Cards', plural: 'Industry Cards' },
    fields: [...sectionBase, { name: 'items', type: 'array', fields: cardFields }],
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
    fields: [...sectionBase],
  },
  {
    slug: 'caseStudyHighlight',
    labels: { singular: 'Case Study Highlight', plural: 'Case Study Highlights' },
    fields: [...sectionBase, { name: 'caseStudy', type: 'relationship', relationTo: 'case-studies' }],
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
    fields: [...sectionBase, { name: 'form', type: 'relationship', relationTo: 'forms' }],
  },
  {
    slug: 'richText',
    labels: { singular: 'Rich Text Block', plural: 'Rich Text Blocks' },
    fields: [...sectionBase, { name: 'body', type: 'textarea' }],
  },
  {
    slug: 'imageText',
    labels: { singular: 'Image + Text Block', plural: 'Image + Text Blocks' },
    fields: [...sectionBase, { name: 'image', type: 'upload', relationTo: 'media' }],
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
