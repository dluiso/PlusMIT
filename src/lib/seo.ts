import type { Metadata } from 'next'
import { getPublicSettings } from './public-settings'

type SeoDoc = {
  title?: string
  name?: string
  seo?: {
    title?: string
    description?: string
    canonicalUrl?: string
    openGraphTitle?: string
    openGraphDescription?: string
    noindex?: boolean
    nofollow?: boolean
  }
}

export async function buildMetadata(doc?: SeoDoc | null | any): Promise<Metadata> {
  const settings = await getPublicSettings()
  const title = doc?.seo?.title || doc?.title || doc?.name || settings.site.companyName
  const description =
    doc?.seo?.description ||
    settings.site.tagline ||
    `${settings.site.companyName} helps organizations modernize, secure, and automate IT operations.`
  const openGraphImage = settings.site.defaultOpenGraphImage?.url

  return {
    title,
    description,
    metadataBase: new URL(settings.site.primaryDomain),
    alternates: doc?.seo?.canonicalUrl ? { canonical: doc.seo.canonicalUrl } : undefined,
    robots: {
      index: !doc?.seo?.noindex,
      follow: !doc?.seo?.nofollow,
    },
    openGraph: {
      title: doc?.seo?.openGraphTitle || title,
      description: doc?.seo?.openGraphDescription || description,
      images: openGraphImage ? [{ url: openGraphImage }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: openGraphImage ? [openGraphImage] : undefined,
    },
    verification: settings.site.analytics.searchConsoleVerification
      ? { google: settings.site.analytics.searchConsoleVerification }
      : undefined,
  }
}
