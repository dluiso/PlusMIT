import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { seedContent } from '@/seed/seed-content'
import { getPayloadClient } from '@/lib/payload'

const setupSchema = z.object({
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(12),
  companyName: z.string().min(2),
  publicEmail: z.string().email(),
  phoneNumber: z.string().optional(),
  serviceArea: z.string().optional(),
  primaryDomain: z.string().url(),
  primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  defaultSeoTitle: z.string().min(4),
  defaultSeoDescription: z.string().min(20),
  gaMeasurementId: z.string().optional(),
  gtmId: z.string().optional(),
  seedStarterContent: z.boolean().default(true),
  publishStarterContent: z.boolean().default(true),
})

async function setupAvailable() {
  const payload = await getPayloadClient()
  const users = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }).catch(() => null)
  return users.totalDocs === 0 || !settings?.setupCompleted
}

async function completeSetup(formData: FormData) {
  'use server'

  const payload = await getPayloadClient()
  if (!(await setupAvailable())) redirect('/admin')

  const parsed = setupSchema.parse({
    adminName: formData.get('adminName'),
    adminEmail: formData.get('adminEmail'),
    adminPassword: formData.get('adminPassword'),
    companyName: formData.get('companyName'),
    publicEmail: formData.get('publicEmail'),
    phoneNumber: formData.get('phoneNumber') || '',
    serviceArea: formData.get('serviceArea') || '',
    primaryDomain: formData.get('primaryDomain'),
    primaryColor: formData.get('primaryColor'),
    secondaryColor: formData.get('secondaryColor'),
    defaultSeoTitle: formData.get('defaultSeoTitle'),
    defaultSeoDescription: formData.get('defaultSeoDescription'),
    gaMeasurementId: formData.get('gaMeasurementId') || '',
    gtmId: formData.get('gtmId') || '',
    seedStarterContent: formData.get('seedStarterContent') === 'on',
    publishStarterContent: formData.get('publishStarterContent') === 'on',
  })

  const existingUsers = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        name: parsed.adminName,
        email: parsed.adminEmail,
        password: parsed.adminPassword,
        roles: ['super-admin'],
      },
      overrideAccess: true,
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: parsed.companyName,
      publicEmail: parsed.publicEmail,
      phoneNumber: parsed.phoneNumber,
      serviceArea: parsed.serviceArea,
      primaryDomain: parsed.primaryDomain,
      tagline: parsed.defaultSeoDescription,
      analytics: {
        enabled: Boolean(parsed.gaMeasurementId || parsed.gtmId),
        gaMeasurementId: parsed.gaMeasurementId,
        gtmId: parsed.gtmId,
      },
      setupCompleted: true,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'branding',
    data: {
      primaryColor: parsed.primaryColor,
      secondaryColor: parsed.secondaryColor,
    },
    overrideAccess: true,
  })

  if (parsed.seedStarterContent) {
    await seedContent({
      payload,
      publish: parsed.publishStarterContent,
      companyName: parsed.companyName,
      primaryDomain: parsed.primaryDomain,
    })
  }

  await payload.create({
    collection: 'audit-logs',
    data: {
      action: 'setup.completed',
      collection: 'site-settings',
      metadata: { companyName: parsed.companyName },
    },
    overrideAccess: true,
  })

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export default async function SetupPage() {
  if (!(await setupAvailable())) redirect('/admin')

  return (
    <main className="container py-12">
      <div className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-cyan-300">First-run setup</p>
        <h1 className="text-5xl font-black">Configure PlusMIT CMS</h1>
        <p className="mt-4 text-slate-300">
          This route locks after setup is completed. Secrets are configured through environment variables and are never displayed here.
        </p>
      </div>
      <form action={completeSetup} className="surface grid gap-5 p-6">
        <div className="grid-auto">
          <label className="field"><span>Administrator Name</span><input name="adminName" required /></label>
          <label className="field"><span>Administrator Email</span><input name="adminEmail" type="email" required /></label>
          <label className="field"><span>Administrator Password</span><input name="adminPassword" type="password" minLength={12} required /></label>
          <label className="field"><span>Company Name</span><input name="companyName" defaultValue="PlusMIT" required /></label>
          <label className="field"><span>Public Contact Email</span><input name="publicEmail" type="email" required /></label>
          <label className="field"><span>Phone Number</span><input name="phoneNumber" /></label>
          <label className="field"><span>Service Area</span><input name="serviceArea" /></label>
          <label className="field"><span>Main Domain</span><input name="primaryDomain" defaultValue={process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'} required /></label>
          <label className="field"><span>Primary Color</span><input name="primaryColor" defaultValue="#38bdf8" required /></label>
          <label className="field"><span>Secondary Color</span><input name="secondaryColor" defaultValue="#1d4ed8" required /></label>
          <label className="field"><span>Default SEO Title</span><input name="defaultSeoTitle" defaultValue="PlusMIT IT Services" required /></label>
          <label className="field"><span>Default SEO Description</span><textarea name="defaultSeoDescription" defaultValue="PlusMIT helps organizations modernize, secure, and automate their IT operations." required /></label>
          <label className="field"><span>GA4 Measurement ID</span><input name="gaMeasurementId" /></label>
          <label className="field"><span>Google Tag Manager ID</span><input name="gtmId" /></label>
        </div>
        <label className="flex gap-3 text-sm text-slate-300"><input name="seedStarterContent" type="checkbox" defaultChecked /> Seed starter content</label>
        <label className="flex gap-3 text-sm text-slate-300"><input name="publishStarterContent" type="checkbox" defaultChecked /> Publish starter pages immediately</label>
        <button className="button">Complete Setup</button>
      </form>
    </main>
  )
}
