import { getPayloadClient } from './payload'
import type { CSSProperties } from 'react'

const colorPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const cssVarNamePattern = /^--[a-z0-9-]+$/i
const cssVarValuePattern = /^#[0-9a-f]{3,8}$|^[0-9.]+(rem|em|px|%)$|^[a-z0-9 -]+$/i

const safeColor = (value: unknown, fallback: string) =>
  typeof value === 'string' && colorPattern.test(value) ? value : fallback

export async function getPublicSettings() {
  const payload = await getPayloadClient()

  const [site, branding] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    payload.findGlobal({ slug: 'branding', depth: 1 }).catch(() => null),
  ])

  const customVariables = Array.isArray(branding?.customCssVariables)
    ? branding.customCssVariables.filter(
        (item) =>
          typeof item?.name === 'string' &&
          typeof item?.value === 'string' &&
          cssVarNamePattern.test(item.name) &&
          cssVarValuePattern.test(item.value),
      )
    : []

  return {
    site: {
      companyName: site?.companyName || 'PlusMIT',
      tagline: site?.tagline || 'Modern IT support, automation, cloud, web, and recovery services.',
      primaryDomain: site?.primaryDomain || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      publicEmail: site?.publicEmail || '',
      phoneNumber: site?.phoneNumber || '',
      serviceArea: site?.serviceArea || '',
      businessHours: site?.businessHours || '',
      defaultCtaLabel: site?.defaultCtaLabel || 'Request Assessment',
      defaultCtaUrl: site?.defaultCtaUrl || '/request-assessment',
      footerText: site?.footerText || '',
      copyrightText: site?.copyrightText || `© ${new Date().getFullYear()} PlusMIT. All rights reserved.`,
      legalLinks: site?.legalLinks || [],
      announcementEnabled: Boolean(site?.announcementEnabled),
      announcementText: site?.announcementText || '',
      announcementLink: site?.announcementLink || '',
      maintenanceMode: Boolean(site?.maintenanceMode),
      maintenanceMessage: site?.maintenanceMessage || 'The site is temporarily unavailable.',
      analytics: {
        enabled: Boolean(site?.analytics?.enabled),
        gaMeasurementId:
          site?.analytics?.gaMeasurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
        gtmId: site?.analytics?.gtmId || process.env.NEXT_PUBLIC_GTM_ID || '',
        searchConsoleVerification: site?.analytics?.searchConsoleVerification || '',
      },
      socialLinks: site?.socialLinks || [],
    },
    branding: {
      primaryColor: safeColor(branding?.primaryColor, '#38bdf8'),
      secondaryColor: safeColor(branding?.secondaryColor, '#1d4ed8'),
      accentColor: safeColor(branding?.accentColor, '#22c55e'),
      backgroundColor: safeColor(branding?.backgroundColor, '#07111f'),
      textColor: safeColor(branding?.textColor, '#f8fafc'),
      cardBackgroundColor: safeColor(branding?.cardBackgroundColor, '#0f1b2d'),
      borderRadiusStyle: branding?.borderRadiusStyle || 'medium',
      buttonStyle: branding?.buttonStyle || 'solid',
      gradientStyle: branding?.gradientStyle || 'infrastructure',
      darkModeEnabled: Boolean(branding?.darkModeEnabled ?? true),
      defaultThemeMode: branding?.defaultThemeMode || 'dark',
      customVariables,
    },
  }
}

export function themeStyle(settings: Awaited<ReturnType<typeof getPublicSettings>>) {
  const radius =
    settings.branding.borderRadiusStyle === 'none'
      ? '0px'
      : settings.branding.borderRadiusStyle === 'small'
        ? '6px'
        : settings.branding.borderRadiusStyle === 'large'
          ? '18px'
          : '10px'

  const variables: Record<string, string> = {
    '--color-primary': settings.branding.primaryColor,
    '--color-secondary': settings.branding.secondaryColor,
    '--color-accent': settings.branding.accentColor,
    '--color-bg': settings.branding.backgroundColor,
    '--color-text': settings.branding.textColor,
    '--color-card': settings.branding.cardBackgroundColor,
    '--radius-ui': radius,
  }

  for (const item of settings.branding.customVariables) {
    variables[item.name] = item.value
  }

  return variables as CSSProperties
}
