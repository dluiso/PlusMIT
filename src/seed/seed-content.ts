import type { Payload } from 'payload'

type SeedOptions = {
  payload: Payload
  publish?: boolean
  companyName?: string
  primaryDomain?: string
}

const status = (publish?: boolean) => (publish ? 'published' : 'draft')

const list = (items: string[]) => items.map((text) => ({ text }))

const services = [
  ['Help Desk and Managed IT Support', 'help-desk-managed-it-support', 'Responsive user support and managed IT operations for reliable day-to-day technology service.'],
  ['Network Administration', 'network-administration', 'Network design, administration, monitoring, and troubleshooting for stable connectivity.'],
  ['Cloud Services', 'cloud-services', 'Cloud planning and operations across Azure, AWS, Oracle Cloud, and hybrid environments.'],
  ['Azure Cloud Consulting', 'azure-cloud-consulting', 'Azure architecture, migration planning, identity, storage, and operational guidance.'],
  ['AWS Cloud Consulting', 'aws-cloud-consulting', 'AWS environment planning, hosting support, backup, and security hardening.'],
  ['Oracle Cloud Services', 'oracle-cloud-services', 'Oracle Cloud planning and support for infrastructure and business workloads.'],
  ['ECM and Laserfiche Automation', 'ecm-laserfiche-automation', 'Document, forms, workflow, and repository automation with a Laserfiche focus.'],
  ['Business Process Automation', 'business-process-automation', 'Workflow modernization that reduces manual effort and improves operational visibility.'],
  ['Web Design and Implementation', 'web-design-implementation', 'Professional websites and web applications built for clarity, maintainability, and performance.'],
  ['Managed Web Hosting', 'managed-web-hosting', 'Managed hosting operations, monitoring, updates, and recovery planning for business websites.'],
  ['Database Recovery After Hack', 'database-recovery-after-hack', 'Careful recovery assistance after website or database compromise incidents.'],
  ['Website Malware Cleanup', 'website-malware-cleanup', 'Malware cleanup, hardening, and restoration support for compromised websites.'],
  ['IT Security Hardening', 'it-security-hardening', 'Practical hardening for accounts, servers, networks, websites, and cloud environments.'],
  ['Backup and Disaster Recovery', 'backup-disaster-recovery', 'Backup design, restore planning, and continuity practices for critical systems.'],
]

const industries = [
  ['Government', 'government', 'Support for public sector teams that need reliable systems, clear processes, and security-aware operations.'],
  ['Education', 'education', 'Technology services for schools and education organizations balancing access, support, and data protection.'],
  ['Healthcare', 'healthcare', 'IT and automation support for healthcare-adjacent workflows where reliability and privacy matter.'],
  ['Small Business', 'small-business', 'Practical IT support, hosting, cloud, and recovery services for lean teams.'],
  ['Mid-size Business', 'mid-size-business', 'Scalable operations support for growing organizations with more complex systems.'],
  ['Private Sector', 'private-sector', 'Modern IT operations, web, automation, and recovery services for private organizations.'],
  ['Nonprofits', 'nonprofits', 'Cost-conscious technology support and automation planning for mission-focused organizations.'],
  ['Professional Services', 'professional-services', 'Reliable IT, web, and workflow support for client-service organizations.'],
]

const pageBlocks = {
  homepage: [
    {
      blockType: 'hero',
      eyebrow: 'Modern IT operations',
      title: 'Reliable support, secure infrastructure, cloud services, automation, and recovery.',
      summary:
        'PlusMIT helps organizations modernize, secure, and automate their IT operations through help desk support, network administration, cloud services, ECM automation, web implementation, hosting, and recovery services.',
      primaryCta: { label: 'Request Assessment', url: '/request-assessment' },
      secondaryCta: { label: 'Explore Services', url: '/services' },
    },
    {
      blockType: 'servicesGrid',
      eyebrow: 'Capabilities',
      title: 'A practical technology partner for daily operations and complex recovery.',
      summary: 'Every service page is editable from the CMS and can be expanded as PlusMIT offerings evolve.',
      items: services.slice(0, 8).map(([title, slug, summary]) => ({ title, summary, url: `/services/${slug}`, icon: '✦' })),
    },
    {
      blockType: 'industryCards',
      eyebrow: 'Industries',
      title: 'Built for organizations where dependability matters.',
      summary: 'PlusMIT can assist government, education, healthcare, nonprofit, and business environments with careful planning and support.',
      items: industries.slice(0, 6).map(([title, slug, summary]) => ({ title, summary, url: `/industries/${slug}`, icon: '▣' })),
    },
    {
      blockType: 'smartfiche',
      eyebrow: 'ECM and Laserfiche',
      title: 'PlusMIT and SmartFiche work together for focused Laserfiche services.',
      summary:
        'PlusMIT provides ECM and automation services, while SmartFiche is positioned as the specialized Laserfiche-focused presence for forms, workflows, repository support, and process modernization.',
      smartFicheUrl: '/solutions/smartfiche-laserfiche-services',
    },
    {
      blockType: 'recoveryEmergencyCta',
      eyebrow: 'Recovery',
      title: 'Compromised website or database?',
      summary:
        'PlusMIT can assist with malware cleanup, database recovery planning, hosting review, and practical hardening after a compromise.',
      primaryCta: { label: 'Request Recovery Help', url: '/contact' },
    },
  ],
}

const defaultFormFields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', required: false },
  { name: 'organization', label: 'Organization', type: 'text', required: false },
  {
    name: 'requestedService',
    label: 'Requested Service',
    type: 'select',
    required: false,
    options: services.slice(0, 8).map(([label]) => ({ label })),
  },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
]

async function upsert<T extends Record<string, unknown>>(
  payload: Payload,
  collection: string,
  where: Record<string, unknown>,
  data: T,
) {
  const existing = await payload.find({
    collection: collection as never,
    where: where as never,
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) return existing.docs[0]
  return payload.create({ collection: collection as never, data: data as never, overrideAccess: true })
}

export async function seedContent({ payload, publish = true, companyName = 'PlusMIT', primaryDomain = 'http://localhost:3000' }: SeedOptions) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName,
      primaryDomain,
      tagline: 'Modern IT support, automation, cloud, web, and recovery services.',
      publicEmail: 'info@example.com',
      defaultCtaLabel: 'Request Assessment',
      defaultCtaUrl: '/request-assessment',
      footerText:
        'PlusMIT helps organizations modernize, secure, and automate IT operations through practical support, cloud, ECM, web, hosting, and recovery services.',
      legalLinks: [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms of Service', url: '/terms-of-service' },
        { label: 'Cookie Policy', url: '/cookie-policy' },
      ],
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'branding',
    data: {
      primaryColor: '#38bdf8',
      secondaryColor: '#1d4ed8',
      accentColor: '#22c55e',
      backgroundColor: '#07111f',
      textColor: '#f8fafc',
      cardBackgroundColor: '#0f1b2d',
    },
    overrideAccess: true,
  })

  const forms = [
    ['Contact Form', 'contact', 'Thank you. PlusMIT received your message and will review it.'],
    ['Request IT Assessment', 'request-assessment', 'Thank you. PlusMIT received your assessment request.'],
    ['Request Laserfiche / ECM Consultation', 'laserfiche-ecm-consultation', 'Thank you. Your ECM consultation request was received.'],
    ['Website Recovery Request', 'website-recovery', 'Thank you. Your recovery request was received.'],
    ['Hosting Inquiry', 'hosting-inquiry', 'Thank you. Your hosting inquiry was received.'],
    ['Cloud Consultation Request', 'cloud-consultation', 'Thank you. Your cloud consultation request was received.'],
  ]

  for (const [name, slug, confirmationMessage] of forms) {
    await upsert(payload, 'forms', { slug: { equals: slug } }, { name, slug, confirmationMessage, active: true, fields: defaultFormFields })
  }

  await upsert(payload, 'navigation', { slug: { equals: 'main' } }, {
    name: 'Main Navigation',
    slug: 'main',
    location: 'main',
    items: [
      { label: 'Services', url: '/services', visible: true, order: 1 },
      { label: 'Industries', url: '/industries', visible: true, order: 2 },
      { label: 'Solutions', url: '/solutions', visible: true, order: 3 },
      { label: 'Resources', url: '/resources', visible: true, order: 4 },
      { label: 'Contact', url: '/contact', visible: true, order: 5 },
    ],
  })

  await upsert(payload, 'navigation', { slug: { equals: 'mobile' } }, {
    name: 'Mobile Navigation',
    slug: 'mobile',
    location: 'mobile',
    items: [
      { label: 'Home', url: '/', visible: true, order: 1 },
      { label: 'Services', url: '/services', visible: true, order: 2 },
      { label: 'Industries', url: '/industries', visible: true, order: 3 },
      { label: 'Contact', url: '/contact', visible: true, order: 4 },
    ],
  })

  for (const [name, slug, shortSummary] of services) {
    await upsert(payload, 'services', { slug: { equals: slug } }, {
      name,
      slug,
      status: status(publish),
      shortSummary,
      longDescription: `${companyName} helps organizations plan, implement, support, and improve ${name.toLowerCase()} with practical attention to reliability, security, documentation, and maintainability.`,
      heroTitle: name,
      heroSubtitle: shortSummary,
      benefits: list(['Clearer operations', 'Improved reliability', 'Security-aware planning', 'Better documentation']),
      painPointsSolved: list(['Unclear ownership', 'Reactive support', 'Manual workflows', 'Recovery gaps']),
      deliverables: list(['Assessment and recommendations', 'Implementation support', 'Documentation', 'Ongoing improvement plan']),
      technologiesUsed: list(['Microsoft 365', 'Azure', 'AWS', 'Oracle Cloud', 'PostgreSQL', 'Laserfiche']),
      processSteps: [
        { title: 'Assess', text: 'Review the current environment and goals.' },
        { title: 'Plan', text: 'Define a practical roadmap with risks and dependencies.' },
        { title: 'Implement', text: 'Execute with documentation and measured rollout steps.' },
        { title: 'Support', text: 'Monitor outcomes and refine operations.' },
      ],
      cta: { label: 'Request Assessment', url: '/request-assessment' },
      seo: { title: `${name} | ${companyName}`, description: shortSummary, sitemapInclude: true, sitemapPriority: 0.8, schemaType: 'Service' },
    })
  }

  for (const [name, slug, overview] of industries) {
    await upsert(payload, 'industries', { slug: { equals: slug } }, {
      name,
      slug,
      status: status(publish),
      overview,
      challenges: list(['Reliable user support', 'Secure access', 'Workflow visibility', 'Continuity planning']),
      complianceConsiderations:
        'PlusMIT can help align technical operations with the organization policies, retention needs, access controls, and recovery expectations that apply to this environment.',
      cta: { label: 'Discuss Your Environment', url: '/request-assessment' },
      seo: { title: `${name} IT Services | ${companyName}`, description: overview, sitemapInclude: true, sitemapPriority: 0.7 },
    })
  }

  const pages = [
    ['Home', 'home', 'home', pageBlocks.homepage],
    ['Solutions', 'solutions', 'standard', [{ blockType: 'featureCards', title: 'Solutions', summary: 'Editable solution pages for specialized service positioning.', items: [{ title: 'SmartFiche Laserfiche Services', summary: 'Laserfiche-focused ECM and automation services.', url: '/solutions/smartfiche-laserfiche-services' }] }]],
    ['SmartFiche Laserfiche Services', 'solutions/smartfiche-laserfiche-services', 'solution', [{ blockType: 'smartfiche', title: 'SmartFiche and PlusMIT Laserfiche services', summary: 'PlusMIT provides ECM and automation services, while SmartFiche is the specialized Laserfiche-focused presence for workflow automation, forms modernization, repository support, cloud migration planning, ECM process design, and consulting.', smartFicheUrl: 'https://smartfiche.example.com' }]],
    ['About', 'about', 'standard', [{ blockType: 'richText', title: 'About PlusMIT', body: 'PlusMIT is focused on dependable IT operations, automation, web implementation, hosting, and recovery services for organizations that need practical technical support.' }]],
    ['Contact', 'contact', 'standard', [{ blockType: 'contactForm', title: 'Contact PlusMIT', summary: 'Tell us what you need help with and we will review the request.', form: undefined }]],
    ['Request Assessment', 'request-assessment', 'standard', [{ blockType: 'contactForm', title: 'Request an IT assessment', summary: 'Share the environment, goals, urgency, and current challenges.', form: undefined }]],
    ['Privacy Policy', 'privacy-policy', 'legal', [{ blockType: 'richText', title: 'Privacy Policy Draft', body: 'This draft policy should be reviewed by qualified counsel before publication.' }]],
    ['Terms of Service', 'terms-of-service', 'legal', [{ blockType: 'richText', title: 'Terms of Service Draft', body: 'This draft terms page should be reviewed by qualified counsel before publication.' }]],
    ['Cookie Policy', 'cookie-policy', 'legal', [{ blockType: 'richText', title: 'Cookie Policy Draft', body: 'This draft cookie policy should be reviewed and updated based on enabled analytics and tracking tools.' }]],
  ]

  for (const [title, slug, pageType, layout] of pages) {
    await upsert(payload, 'pages', { slug: { equals: slug } }, {
      title,
      slug,
      pageType,
      status: status(publish),
      layout,
      seo: { title: `${title} | ${companyName}`, description: `${title} information from ${companyName}.`, sitemapInclude: true },
    })
  }

  for (const [question, answer] of [
    ['Can PlusMIT help after a website compromise?', 'PlusMIT can assist with cleanup planning, recovery support, hosting review, and practical hardening steps.'],
    ['Does PlusMIT support Laserfiche automation?', 'Yes. PlusMIT can assist with ECM workflow, forms, repository, and automation planning, with SmartFiche positioned as the specialized Laserfiche presence.'],
    ['Can services be customized by industry?', 'Yes. Service and industry pages are CMS-managed so messaging and recommended services can be refined over time.'],
  ]) {
    await upsert(payload, 'faqs', { question: { equals: question } }, { question, answer, status: status(publish), includeInSchema: true })
  }

  for (const title of [
    'Why Small Organizations Need a Professional Help Desk Process',
    'How ECM Automation Improves Government and Education Workflows',
    'What to Do After a Website or Database Has Been Compromised',
    'Laserfiche Automation Opportunities for Modern Organizations',
    'Cloud Migration Planning for Small and Mid-Size Organizations',
  ]) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await upsert(payload, 'posts', { slug: { equals: slug } }, {
      title,
      slug,
      status: 'draft',
      excerpt: 'Draft starter resource for the CMS editor to expand before publishing.',
      content: 'This draft starter article should be reviewed, expanded, and customized before publication.',
      seo: { title, description: 'Draft resource prepared for CMS editing.', sitemapInclude: false, noindex: true },
    })
  }

  await upsert(payload, 'case-studies', { slug: { equals: 'draft-example-automation-project' } }, {
    title: 'Draft Example Automation Project',
    slug: 'draft-example-automation-project',
    status: 'draft',
    challenge: 'Draft placeholder challenge. Replace with a real client-approved case study before publishing.',
    solution: 'Draft placeholder solution. Replace with actual approved project details.',
    results: 'Draft placeholder results. Do not publish unsupported metrics.',
  })

  await upsert(payload, 'testimonials', { clientName: { equals: 'Draft Placeholder Reviewer' } }, {
    clientName: 'Draft Placeholder Reviewer',
    quote: 'Draft placeholder only. Replace with a real permission-confirmed review before publishing.',
    permissionConfirmed: false,
    status: 'draft',
    internalNotes: 'Seeded placeholder. Not public and not eligible for Review schema.',
  })
}
