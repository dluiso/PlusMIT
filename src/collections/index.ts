import type { CollectionConfig } from 'payload'
import path from 'path'
import { blocks } from '@/blocks'
import {
  auditAfterChange,
  auditAfterDelete,
  canManageSystem,
  contentAccess,
  isAuthenticated,
  leadAccess,
  readPublishedOrAuthenticated,
  roleOptions,
  superAdminOnly,
} from '@/lib/roles'
import { ctaFields, seoFields, slugField, statusField } from '@/lib/fields'

const publicRead = readPublishedOrAuthenticated
const mediaStaticDir = process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media')

const adminGroups = {
  site: 'Website',
  content: 'Content',
  services: 'Services',
  industries: 'Services',
  reviews: 'Trust',
  leads: 'Leads',
  seo: 'SEO',
  media: 'Media',
  system: 'System',
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: adminGroups.system,
    defaultColumns: ['name', 'email', 'roles'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 60 * 60 * 8,
  },
  access: {
    read: isAuthenticated,
    create: canManageSystem,
    update: canManageSystem,
    delete: superAdminOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['viewer'],
      options: roleOptions,
      access: {
        update: ({ req }) => Boolean(req.user && req.user.roles?.includes('super-admin')),
      },
    },
  ],
  hooks: {
    afterChange: [auditAfterChange('users')],
    afterDelete: [auditAfterDelete('users')],
  },
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
    group: adminGroups.media,
  },
  access: {
    read: () => true,
    create: contentAccess,
    update: contentAccess,
    delete: canManageSystem,
  },
  upload: {
    staticDir: mediaStaticDir,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400')
      return headers
    },
    imageSizes: [
      { name: 'card', width: 720, height: 480, crop: 'center' },
      { name: 'hero', width: 1600, height: 900, crop: 'center' },
      { name: 'og', width: 1200, height: 630, crop: 'center' },
    ],
    adminThumbnail: 'card',
  },
  fields: [
    { name: 'alt', label: 'Alt Text', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'caption', type: 'textarea' },
    { name: 'usageNotes', label: 'Usage Notes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [auditAfterChange('media')],
    afterDelete: [auditAfterDelete('media')],
  },
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: adminGroups.site,
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/${data.slug || ''}`,
    },
  },
  access: {
    read: publicRead,
    create: contentAccess,
    update: contentAccess,
    delete: canManageSystem,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    statusField,
    {
      name: 'pageType',
      type: 'select',
      defaultValue: 'standard',
      options: ['standard', 'home', 'landing', 'legal', 'solution'],
    },
    { name: 'navigationLabel', type: 'text' },
    { name: 'parentPage', type: 'relationship', relationTo: 'pages' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'layout', type: 'blocks', blocks, required: true },
    seoFields,
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
  ],
  hooks: {
    afterChange: [auditAfterChange('pages')],
    afterDelete: [auditAfterDelete('pages')],
  },
}

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    group: adminGroups.services,
    defaultColumns: ['name', 'slug', 'status'],
  },
  access: {
    read: publicRead,
    create: contentAccess,
    update: contentAccess,
    delete: canManageSystem,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    statusField,
    { name: 'shortSummary', type: 'textarea', required: true },
    { name: 'longDescription', type: 'textarea', required: true },
    { name: 'heroTitle', type: 'text' },
    { name: 'heroSubtitle', type: 'textarea' },
    { name: 'serviceIcon', type: 'text' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'benefits', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'painPointsSolved', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'deliverables', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'technologiesUsed', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'processSteps', type: 'array', fields: [{ name: 'title', type: 'text' }, { name: 'text', type: 'textarea' }] },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'relatedIndustries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
    { name: 'testimonials', type: 'relationship', relationTo: 'testimonials', hasMany: true },
    ctaFields,
    seoFields,
  ],
  hooks: {
    afterChange: [auditAfterChange('services')],
    afterDelete: [auditAfterDelete('services')],
  },
}

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    group: adminGroups.industries,
  },
  access: {
    read: publicRead,
    create: contentAccess,
    update: contentAccess,
    delete: canManageSystem,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    statusField,
    { name: 'overview', type: 'textarea', required: true },
    { name: 'challenges', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'recommendedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'complianceConsiderations', type: 'textarea' },
    { name: 'caseStudies', type: 'relationship', relationTo: 'case-studies', hasMany: true },
    { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
    ctaFields,
    seoFields,
  ],
  hooks: {
    afterChange: [auditAfterChange('industries')],
    afterDelete: [auditAfterDelete('industries')],
  },
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial / Client Review', plural: 'Testimonials / Client Reviews' },
  admin: {
    useAsTitle: 'clientName',
    group: adminGroups.reviews,
    defaultColumns: ['clientName', 'organization', 'status', 'permissionConfirmed', 'featured'],
    description:
      'Only published testimonials with permission confirmed are shown publicly or eligible for Review schema.',
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true
      return {
        and: [{ status: { equals: 'published' } }, { permissionConfirmed: { equals: true } }],
      } as never
    },
    create: contentAccess,
    update: contentAccess,
    delete: canManageSystem,
  },
  fields: [
    { name: 'clientName', type: 'text', required: true },
    { name: 'clientTitle', type: 'text' },
    { name: 'organization', type: 'text' },
    { name: 'industry', type: 'relationship', relationTo: 'industries' },
    { name: 'serviceRelated', type: 'relationship', relationTo: 'services' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5 },
    { name: 'reviewSource', type: 'text' },
    { name: 'reviewDate', type: 'date' },
    { name: 'permissionConfirmed', type: 'checkbox', defaultValue: false, required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'showOnHomepage', type: 'checkbox', defaultValue: false },
    { name: 'showOnServicePages', type: 'checkbox', defaultValue: false },
    { name: 'showOnIndustryPages', type: 'checkbox', defaultValue: false },
    { name: 'reviewerImage', type: 'upload', relationTo: 'media' },
    { name: 'companyLogo', type: 'upload', relationTo: 'media' },
    { name: 'internalNotes', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: ['draft', 'pending-permission', 'approved', 'published'],
    },
  ],
  hooks: {
    afterChange: [auditAfterChange('testimonials')],
    afterDelete: [auditAfterDelete('testimonials')],
  },
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: { useAsTitle: 'title', group: adminGroups.reviews },
  access: { read: publicRead, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    statusField,
    { name: 'clientOrganizationName', type: 'text' },
    { name: 'industry', type: 'relationship', relationTo: 'industries' },
    { name: 'challenge', type: 'textarea', required: true },
    { name: 'solution', type: 'textarea', required: true },
    { name: 'results', type: 'textarea' },
    { name: 'servicesUsed', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'technologiesUsed', type: 'array', fields: [{ name: 'text', type: 'text' }] },
    { name: 'testimonial', type: 'relationship', relationTo: 'testimonials' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'beforeAfterNotes', type: 'textarea' },
    ctaFields,
    seoFields,
  ],
  hooks: {
    afterChange: [auditAfterChange('case-studies')],
    afterDelete: [auditAfterDelete('case-studies')],
  },
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog / Resource', plural: 'Blog / Resources' },
  admin: { useAsTitle: 'title', group: adminGroups.content },
  access: { read: publicRead, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    statusField,
    { name: 'excerpt', type: 'textarea', required: true },
    { name: 'content', type: 'textarea', required: true },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'category', type: 'text' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'publishedDate', type: 'date' },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    { name: 'relatedIndustries', type: 'relationship', relationTo: 'industries', hasMany: true },
    seoFields,
  ],
  hooks: {
    afterChange: [auditAfterChange('posts')],
    afterDelete: [auditAfterDelete('posts')],
  },
}

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: { useAsTitle: 'question', group: adminGroups.content },
  access: { read: publicRead, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'relatedService', type: 'relationship', relationTo: 'services' },
    { name: 'relatedIndustry', type: 'relationship', relationTo: 'industries' },
    { name: 'category', type: 'text' },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
    statusField,
    { name: 'includeInSchema', type: 'checkbox', defaultValue: true },
  ],
  hooks: {
    afterChange: [auditAfterChange('faqs')],
    afterDelete: [auditAfterDelete('faqs')],
  },
}

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  admin: { useAsTitle: 'name', group: adminGroups.site },
  access: { read: () => true, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: ['main', 'mobile', 'footer', 'cta'],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'visible', type: 'checkbox', defaultValue: true },
        { name: 'order', type: 'number', defaultValue: 0 },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
            { name: 'visible', type: 'checkbox', defaultValue: true },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [auditAfterChange('navigation')],
    afterDelete: [auditAfterDelete('navigation')],
  },
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'sourcePath', group: adminGroups.seo },
  access: { read: isAuthenticated, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'sourcePath', type: 'text', required: true, unique: true },
    { name: 'destination', type: 'text', required: true },
    { name: 'statusCode', type: 'select', defaultValue: '301', options: ['301', '302', '307', '308'] },
    { name: 'enabled', type: 'checkbox', defaultValue: true },
    { name: 'notes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [auditAfterChange('redirects')],
    afterDelete: [auditAfterDelete('redirects')],
  },
}

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: { useAsTitle: 'name', group: adminGroups.leads },
  access: { read: () => true, create: contentAccess, update: contentAccess, delete: canManageSystem },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField,
    { name: 'recipientEmail', type: 'email' },
    { name: 'confirmationMessage', type: 'textarea', required: true },
    {
      name: 'fields',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'type', type: 'select', defaultValue: 'text', options: ['text', 'email', 'tel', 'textarea', 'select', 'checkbox'] },
        { name: 'required', type: 'checkbox', defaultValue: false },
        { name: 'options', type: 'array', fields: [{ name: 'label', type: 'text' }] },
      ],
    },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'turnstileEnabled', type: 'checkbox', defaultValue: false },
    { name: 'notificationTemplate', type: 'textarea' },
    { name: 'autoresponderTemplate', type: 'textarea' },
  ],
  hooks: {
    afterChange: [auditAfterChange('forms')],
    afterDelete: [auditAfterDelete('forms')],
  },
}

export const LeadSubmissions: CollectionConfig = {
  slug: 'lead-submissions',
  admin: { useAsTitle: 'email', group: adminGroups.leads, defaultColumns: ['formSource', 'email', 'status', 'createdAt'] },
  access: {
    read: leadAccess,
    create: () => true,
    update: leadAccess,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'formSource', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organization', type: 'text' },
    { name: 'industry', type: 'text' },
    { name: 'requestedService', type: 'text' },
    { name: 'urgency', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'ipHash', type: 'text', admin: { readOnly: true } },
    { name: 'userAgentHash', type: 'text', admin: { readOnly: true } },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'reviewing', 'contacted', 'closed', 'spam'] },
    { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
    { name: 'internalNotes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [auditAfterChange('lead-submissions')],
    afterDelete: [auditAfterDelete('lead-submissions')],
  },
}

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    group: adminGroups.system,
    defaultColumns: ['action', 'collection', 'actor', 'createdAt'],
  },
  access: {
    read: isAuthenticated,
    create: superAdminOnly,
    update: superAdminOnly,
    delete: superAdminOnly,
  },
  fields: [
    { name: 'action', type: 'text', required: true },
    { name: 'collection', type: 'text' },
    { name: 'documentId', type: 'text' },
    { name: 'actor', type: 'relationship', relationTo: 'users' },
    { name: 'metadata', type: 'json' },
  ],
}

export const collections: CollectionConfig[] = [
  Users,
  Media,
  Pages,
  Services,
  Industries,
  Testimonials,
  CaseStudies,
  Posts,
  FAQs,
  Navigation,
  Redirects,
  Forms,
  LeadSubmissions,
  AuditLogs,
]
