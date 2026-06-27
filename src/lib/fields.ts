import type { Field } from 'payload'
import { seoFieldAccess, systemFieldAccess } from './roles'

export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    description: 'URL-safe path segment, for example help-desk-managed-it-support.',
  },
}

export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  required: true,
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  admin: {
    position: 'sidebar',
  },
}

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  access: {
    update: seoFieldAccess,
  },
  admin: {
    description: 'Search metadata, social sharing metadata, sitemap options, and schema selection.',
  },
  fields: [
    { name: 'title', label: 'SEO Title', type: 'text' },
    { name: 'description', label: 'Meta Description', type: 'textarea' },
    { name: 'canonicalUrl', label: 'Canonical URL', type: 'text' },
    { name: 'openGraphTitle', label: 'Open Graph Title', type: 'text' },
    { name: 'openGraphDescription', label: 'Open Graph Description', type: 'textarea' },
    { name: 'openGraphImage', label: 'Open Graph Image', type: 'upload', relationTo: 'media' },
    { name: 'twitterImage', label: 'Twitter/X Card Image', type: 'upload', relationTo: 'media' },
    { name: 'keywords', label: 'Internal Keywords', type: 'text' },
    { name: 'noindex', label: 'Noindex', type: 'checkbox', defaultValue: false },
    { name: 'nofollow', label: 'Nofollow', type: 'checkbox', defaultValue: false },
    { name: 'sitemapInclude', label: 'Include in Sitemap', type: 'checkbox', defaultValue: true },
    {
      name: 'sitemapPriority',
      label: 'Sitemap Priority',
      type: 'number',
      defaultValue: 0.7,
      min: 0,
      max: 1,
    },
    {
      name: 'schemaType',
      label: 'Schema Type',
      type: 'select',
      defaultValue: 'WebPage',
      options: ['WebPage', 'ProfessionalService', 'Service', 'FAQPage', 'Article', 'BreadcrumbList'],
    },
  ],
}

export const ctaFields: Field = {
  name: 'cta',
  label: 'Call to Action',
  type: 'group',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'url', type: 'text' },
  ],
}

export const analyticsFields: Field = {
  name: 'analytics',
  type: 'group',
  access: {
    update: systemFieldAccess,
  },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'gaMeasurementId', label: 'GA4 Measurement ID', type: 'text' },
    { name: 'gtmId', label: 'Google Tag Manager ID', type: 'text' },
    { name: 'searchConsoleVerification', label: 'Search Console Verification Token', type: 'text' },
  ],
}
