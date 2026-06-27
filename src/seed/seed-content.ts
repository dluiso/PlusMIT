import type { Payload } from 'payload'

type SeedOptions = {
  payload: Payload
  publish?: boolean
  companyName?: string
  primaryDomain?: string
  updateExisting?: boolean
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
      sectionId: 'top',
      eyebrow: 'Modern IT operations',
      title: 'Reliable support, secure infrastructure, built for daily operations.',
      highlightText: 'built for daily operations.',
      summary:
        'PlusMIT helps organizations modernize, secure, and automate IT operations through help desk, network, cloud, ECM automation, hosting, and recovery.',
      theme: 'white',
      layoutVariant: 'dashboard',
      mediaPosition: 'right',
      spacing: 'spacious',
      design: { titleSize: 'medium', summarySize: 'medium', mediaSize: 'small' },
      primaryCta: { label: 'Request Assessment', url: '/request-assessment' },
      secondaryCta: { label: 'Explore Services', url: '#services' },
      stats: [
        { value: '24/7', label: 'Help desk support' },
        { value: '99.9%', label: 'Uptime focus' },
        { value: '5+', label: 'Cloud platforms' },
      ],
      badges: [
        { label: 'Systems', value: 'All operational' },
        { label: 'Backups', value: 'Verified' },
      ],
    },
    {
      blockType: 'stats',
      theme: 'soft',
      layoutVariant: 'compact',
      title: 'Trusted across',
      design: { titleSize: 'small', summarySize: 'small' },
      stats: [
        { value: 'Government', label: 'Public sector' },
        { value: 'Education', label: 'Schools and programs' },
        { value: 'Healthcare', label: 'Operational reliability' },
        { value: 'Nonprofit', label: 'Mission-focused teams' },
        { value: 'Private Sector', label: 'Business operations' },
      ],
    },
    {
      blockType: 'servicesGrid',
      sectionId: 'services',
      eyebrow: 'Capabilities',
      title: 'A practical technology partner for daily operations and complex recovery.',
      summary: 'Every service page is editable from the CMS and can be expanded as PlusMIT offerings evolve.',
      theme: 'white',
      itemLimit: 8,
      design: { titleSize: 'medium', cardColumns: 'four', cardDensity: 'compact' },
      viewAllCta: { label: 'All services', url: '/services' },
      items: services.slice(0, 8).map(([title, slug, summary]) => ({ title, summary, url: `/services/${slug}`, icon: '+' })),
    },
    {
      blockType: 'industryCards',
      sectionId: 'industries',
      eyebrow: 'Industries',
      title: 'Built for organizations where dependability matters.',
      summary: 'PlusMIT can assist government, education, healthcare, nonprofit, and business environments with careful planning and support.',
      theme: 'soft',
      itemLimit: 6,
      design: { titleSize: 'medium', cardColumns: 'three', cardDensity: 'comfortable' },
      items: industries.slice(0, 6).map(([title, slug, summary]) => ({ title, summary, url: `/industries/${slug}`, icon: '+' })),
    },
    {
      blockType: 'smartfiche',
      sectionId: 'solutions',
      eyebrow: 'ECM and Laserfiche',
      title: 'PlusMIT and SmartFiche work together for focused Laserfiche services.',
      summary:
        'PlusMIT provides ECM and automation services, while SmartFiche is positioned as the specialized Laserfiche-focused presence for forms, workflows, repository support, and process modernization.',
      theme: 'splitDarkBlue',
      mediaPosition: 'right',
      design: { titleSize: 'medium', summarySize: 'medium', mediaSize: 'medium' },
      primaryCta: { label: 'Learn about SmartFiche', url: '/solutions/smartfiche-laserfiche-services' },
      smartFicheUrl: '/solutions/smartfiche-laserfiche-services',
    },
    {
      blockType: 'testimonials',
      eyebrow: 'Client voices',
      title: 'What organizations say about working with PlusMIT.',
      theme: 'white',
      textAlign: 'center',
      itemLimit: 3,
      design: { titleSize: 'medium', cardColumns: 'three', cardDensity: 'comfortable' },
      items: [
        {
          title: 'Diana Reyes',
          summary: 'PlusMIT became an extension of our team. Response times improved and our systems have been consistently dependable ever since.',
          icon: 'DR',
        },
        {
          title: 'Marcus Allen',
          summary: 'Their Laserfiche automation removed hours of manual paperwork each week. The rollout was careful and well documented.',
          icon: 'MA',
        },
        {
          title: 'Sofia Kim',
          summary: 'After a security incident, PlusMIT handled cleanup and hardening calmly and got us back online faster than expected.',
          icon: 'SK',
        },
      ],
    },
    {
      blockType: 'recoveryEmergencyCta',
      eyebrow: 'Recovery',
      title: 'Compromised website or database?',
      summary:
        'PlusMIT can assist with malware cleanup, database recovery planning, hosting review, and practical hardening after a compromise.',
      theme: 'white',
      layoutVariant: 'centered',
      design: { titleSize: 'medium', summarySize: 'medium' },
      primaryCta: { label: 'Request Recovery Help', url: '/contact' },
    },
  ],
}

const defaultFormFields = [
  { name: 'firstName', label: 'First name', type: 'text', required: true },
  { name: 'lastName', label: 'Last name', type: 'text', required: false },
  { name: 'email', label: 'Work email', type: 'email', required: true },
  { name: 'organization', label: 'Organization', type: 'text', required: false },
  {
    name: 'requestedService',
    label: 'Requested Service',
    type: 'select',
    required: false,
    options: services.slice(0, 8).map(([label]) => ({ label })),
  },
  { name: 'message', label: 'How can we help?', type: 'textarea', required: true },
]

async function upsert<T extends Record<string, unknown>>(
  payload: Payload,
  collection: string,
  where: Record<string, unknown>,
  data: T,
  updateExisting = false,
) {
  const existing = await payload.find({
    collection: collection as never,
    where: where as never,
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs[0]) {
    if (!updateExisting) return existing.docs[0]

    return payload.update({
      collection: collection as never,
      id: (existing.docs[0] as { id: string | number }).id,
      data: data as never,
      overrideAccess: true,
    })
  }

  return payload.create({ collection: collection as never, data: data as never, overrideAccess: true })
}

export async function seedContent({
  payload,
  publish = true,
  companyName = 'PlusMIT',
  primaryDomain = 'http://localhost:3000',
  updateExisting = false,
}: SeedOptions) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName,
      primaryDomain,
      tagline: 'Modern IT support, automation, cloud, web, and recovery services.',
      publicEmail: 'hello@plusmit.com',
      defaultCtaLabel: 'Request Assessment',
      defaultCtaUrl: '/request-assessment',
      footerText:
        'Helping organizations modernize, secure, and automate IT operations through practical support, cloud, ECM, web, hosting, and recovery services.',
      copyrightText: `(c) ${new Date().getFullYear()} PlusMIT - Enterprise IT Solutions.`,
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
      primaryColor: '#2563eb',
      secondaryColor: '#0f172a',
      accentColor: '#38bdf8',
      backgroundColor: '#f4f7fb',
      textColor: '#0f172a',
      cardBackgroundColor: '#ffffff',
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

  const seededForms = new Map<string, unknown>()

  for (const [name, slug, confirmationMessage] of forms) {
    const form = await upsert(
      payload,
      'forms',
      { slug: { equals: slug } },
      { name, slug, confirmationMessage, active: true, fields: defaultFormFields },
      updateExisting,
    )
    seededForms.set(slug, form)
  }

  await upsert(
    payload,
    'navigation',
    { slug: { equals: 'main' } },
    {
      name: 'Main Navigation',
      slug: 'main',
      location: 'main',
      items: [
        { label: 'Services', url: '/#services', visible: true, order: 1 },
        { label: 'Industries', url: '/#industries', visible: true, order: 2 },
        { label: 'Solutions', url: '/#solutions', visible: true, order: 3 },
        { label: 'Resources', url: '/resources', visible: true, order: 4 },
        { label: 'Contact', url: '/contact', visible: true, order: 5 },
      ],
    },
    updateExisting,
  )

  await upsert(
    payload,
    'navigation',
    { slug: { equals: 'mobile' } },
    {
      name: 'Mobile Navigation',
      slug: 'mobile',
      location: 'mobile',
      items: [
        { label: 'Home', url: '/', visible: true, order: 1 },
        { label: 'Services', url: '/#services', visible: true, order: 2 },
        { label: 'Industries', url: '/#industries', visible: true, order: 3 },
        { label: 'Contact', url: '/contact', visible: true, order: 4 },
      ],
    },
    updateExisting,
  )

  for (const [name, slug, shortSummary] of services) {
    await upsert(
      payload,
      'services',
      { slug: { equals: slug } },
      {
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
      },
      updateExisting,
    )
  }

  for (const [name, slug, overview] of industries) {
    await upsert(
      payload,
      'industries',
      { slug: { equals: slug } },
      {
        name,
        slug,
        status: status(publish),
        overview,
        challenges: list(['Reliable user support', 'Secure access', 'Workflow visibility', 'Continuity planning']),
        complianceConsiderations:
          'PlusMIT can help align technical operations with the organization policies, retention needs, access controls, and recovery expectations that apply to this environment.',
        cta: { label: 'Discuss Your Environment', url: '/request-assessment' },
        seo: { title: `${name} IT Services | ${companyName}`, description: overview, sitemapInclude: true, sitemapPriority: 0.7 },
      },
      updateExisting,
    )
  }

  const contactForm = seededForms.get('contact')
  const assessmentForm = seededForms.get('request-assessment')

  const pages = [
    ['Home', 'home', 'home', pageBlocks.homepage],
    [
      'Solutions',
      'solutions',
      'standard',
      [
        {
          blockType: 'featureCards',
          eyebrow: 'Solutions',
          title: 'Specialized IT and automation solutions.',
          summary: 'Editable solution pages for focused service positioning.',
          theme: 'white',
          items: [
            {
              title: 'SmartFiche Laserfiche Services',
              summary: 'Laserfiche-focused ECM and automation services.',
              url: '/solutions/smartfiche-laserfiche-services',
              icon: '+',
            },
          ],
        },
      ],
    ],
    [
      'SmartFiche Laserfiche Services',
      'solutions/smartfiche-laserfiche-services',
      'solution',
      [
        {
          blockType: 'smartfiche',
          eyebrow: 'ECM and Laserfiche',
          title: 'SmartFiche and PlusMIT Laserfiche services',
          summary:
            'PlusMIT provides ECM and automation services, while SmartFiche is the specialized Laserfiche-focused presence for workflow automation, forms modernization, repository support, cloud migration planning, ECM process design, and consulting.',
          theme: 'splitDarkBlue',
          primaryCta: { label: 'Request ECM Consultation', url: '/request-assessment' },
          smartFicheUrl: 'https://smartfiche.example.com',
        },
      ],
    ],
    [
      'About',
      'about',
      'standard',
      [
        {
          blockType: 'richText',
          eyebrow: 'About',
          title: 'About PlusMIT',
          body:
            'PlusMIT is focused on dependable IT operations, automation, web implementation, hosting, and recovery services for organizations that need practical technical support.',
          theme: 'white',
        },
      ],
    ],
    [
      'Contact',
      'contact',
      'standard',
      [
        {
          blockType: 'contactForm',
          eyebrow: 'Contact',
          title: "Let's talk about your IT operations.",
          summary: "Tell us a bit about your environment and goals. We'll follow up with practical next steps and a proposed assessment.",
          theme: 'dark',
          layoutVariant: 'contact',
          form: contactForm,
          contactItems: [
            { label: 'Email', value: 'hello@plusmit.com', icon: 'mail' },
            { label: 'Recovery line', value: 'Priority response for compromises', icon: 'shield' },
            { label: 'Support', value: '24/7 help desk for managed clients', icon: 'clock' },
          ],
        },
      ],
    ],
    [
      'Request Assessment',
      'request-assessment',
      'standard',
      [
        {
          blockType: 'contactForm',
          eyebrow: 'Assessment',
          title: 'Request an IT assessment',
          summary: 'Share the environment, goals, urgency, and current challenges.',
          theme: 'dark',
          layoutVariant: 'contact',
          form: assessmentForm,
        },
      ],
    ],
    ['Privacy Policy', 'privacy-policy', 'legal', [{ blockType: 'richText', title: 'Privacy Policy Draft', body: 'This draft policy should be reviewed by qualified counsel before publication.', theme: 'white' }]],
    ['Terms of Service', 'terms-of-service', 'legal', [{ blockType: 'richText', title: 'Terms of Service Draft', body: 'This draft terms page should be reviewed by qualified counsel before publication.', theme: 'white' }]],
    ['Cookie Policy', 'cookie-policy', 'legal', [{ blockType: 'richText', title: 'Cookie Policy Draft', body: 'This draft cookie policy should be reviewed and updated based on enabled analytics and tracking tools.', theme: 'white' }]],
  ]

  for (const [title, slug, pageType, layout] of pages) {
    await upsert(
      payload,
      'pages',
      { slug: { equals: slug } },
      {
        title,
        slug,
        pageType,
        status: status(publish),
        layout,
        seo: { title: `${title} | ${companyName}`, description: `${title} information from ${companyName}.`, sitemapInclude: true },
      },
      updateExisting,
    )
  }

  for (const [question, answer] of [
    ['Can PlusMIT help after a website compromise?', 'PlusMIT can assist with cleanup planning, recovery support, hosting review, and practical hardening steps.'],
    ['Does PlusMIT support Laserfiche automation?', 'Yes. PlusMIT can assist with ECM workflow, forms, repository, and automation planning, with SmartFiche positioned as the specialized Laserfiche presence.'],
    ['Can services be customized by industry?', 'Yes. Service and industry pages are CMS-managed so messaging and recommended services can be refined over time.'],
  ]) {
    await upsert(payload, 'faqs', { question: { equals: question } }, { question, answer, status: status(publish), includeInSchema: true }, updateExisting)
  }

  for (const title of [
    'Why Small Organizations Need a Professional Help Desk Process',
    'How ECM Automation Improves Government and Education Workflows',
    'What to Do After a Website or Database Has Been Compromised',
    'Laserfiche Automation Opportunities for Modern Organizations',
    'Cloud Migration Planning for Small and Mid-Size Organizations',
  ]) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await upsert(
      payload,
      'posts',
      { slug: { equals: slug } },
      {
        title,
        slug,
        status: 'draft',
        excerpt: 'Draft starter resource for the CMS editor to expand before publishing.',
        content: 'This draft starter article should be reviewed, expanded, and customized before publication.',
        seo: { title, description: 'Draft resource prepared for CMS editing.', sitemapInclude: false, noindex: true },
      },
      updateExisting,
    )
  }

  await upsert(
    payload,
    'case-studies',
    { slug: { equals: 'draft-example-automation-project' } },
    {
      title: 'Draft Example Automation Project',
      slug: 'draft-example-automation-project',
      status: 'draft',
      challenge: 'Draft placeholder challenge. Replace with a real client-approved case study before publishing.',
      solution: 'Draft placeholder solution. Replace with actual approved project details.',
      results: 'Draft placeholder results. Do not publish unsupported metrics.',
    },
    updateExisting,
  )

  await upsert(
    payload,
    'testimonials',
    { clientName: { equals: 'Draft Placeholder Reviewer' } },
    {
      clientName: 'Draft Placeholder Reviewer',
      quote: 'Draft placeholder only. Replace with a real permission-confirmed review before publishing.',
      permissionConfirmed: false,
      status: 'draft',
      internalNotes: 'Seeded placeholder. Not public and not eligible for Review schema.',
    },
    updateExisting,
  )
}
