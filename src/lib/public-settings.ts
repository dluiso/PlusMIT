import { getPayloadClient } from './payload'
import { getMediaInfo } from './media'
import type { CSSProperties } from 'react'

const colorPattern = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const cssVarNamePattern = /^--[a-z0-9-]+$/i
const cssVarValuePattern = /^#[0-9a-f]{3,8}$|^[0-9.]+(rem|em|px|%)$|^[a-z0-9 -]+$/i
const gaPattern = /^G-[A-Z0-9]+$/i
const gtmPattern = /^GTM-[A-Z0-9]+$/i
const fontPattern = /^[a-z0-9 ,'"-]+$/i

const safeColor = (value: unknown, fallback: string) =>
  typeof value === 'string' && colorPattern.test(value) ? value : fallback

const safePattern = (value: unknown, pattern: RegExp) =>
  typeof value === 'string' && pattern.test(value) ? value : ''

const safeFont = (value: unknown, fallback: string) =>
  typeof value === 'string' && fontPattern.test(value) ? value : fallback

const darkDefaults = {
  background: '#07111f',
  text: '#f8fafc',
  card: '#0f1b2d',
}

const lightDefaults = {
  background: '#f7fafc',
  text: '#102033',
  card: '#ffffff',
}

function themedColor(value: unknown, darkFallback: string, lightFallback: string, mode: string) {
  const safeValue = safeColor(value, mode === 'light' ? lightFallback : darkFallback)
  if (mode === 'light' && safeValue.toLowerCase() === darkFallback.toLowerCase()) {
    return lightFallback
  }
  return safeValue
}

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

  const defaultThemeMode = branding?.defaultThemeMode || 'dark'

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
      copyrightText: site?.copyrightText || `(c) ${new Date().getFullYear()} PlusMIT. All rights reserved.`,
      legalLinks: site?.legalLinks || [],
      defaultSeoImage: getMediaInfo(site?.defaultSeoImage, 'og'),
      defaultOpenGraphImage: getMediaInfo(site?.defaultOpenGraphImage || site?.defaultSeoImage, 'og'),
      announcementEnabled: Boolean(site?.announcementEnabled),
      announcementText: site?.announcementText || '',
      announcementLink: site?.announcementLink || '',
      maintenanceMode: Boolean(site?.maintenanceMode),
      maintenanceMessage: site?.maintenanceMessage || 'The site is temporarily unavailable.',
      analytics: {
        enabled: Boolean(site?.analytics?.enabled),
        gaMeasurementId: safePattern(
          site?.analytics?.gaMeasurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
          gaPattern,
        ),
        gtmId: safePattern(site?.analytics?.gtmId || process.env.NEXT_PUBLIC_GTM_ID, gtmPattern),
        searchConsoleVerification: site?.analytics?.searchConsoleVerification || '',
      },
      socialLinks: site?.socialLinks || [],
    },
    branding: {
      logo: getMediaInfo(branding?.logo, 'card'),
      darkLogo: getMediaInfo(branding?.darkLogo, 'card'),
      favicon: getMediaInfo(branding?.favicon),
      hideCompanyNameInHeader: Boolean(branding?.hideCompanyNameInHeader),
      primaryColor: safeColor(branding?.primaryColor, '#38bdf8'),
      secondaryColor: safeColor(branding?.secondaryColor, '#1d4ed8'),
      accentColor: safeColor(branding?.accentColor, '#22c55e'),
      backgroundColor: themedColor(branding?.backgroundColor, darkDefaults.background, lightDefaults.background, defaultThemeMode),
      textColor: themedColor(branding?.textColor, darkDefaults.text, lightDefaults.text, defaultThemeMode),
      cardBackgroundColor: themedColor(branding?.cardBackgroundColor, darkDefaults.card, lightDefaults.card, defaultThemeMode),
      borderRadiusStyle: branding?.borderRadiusStyle || 'medium',
      buttonStyle: branding?.buttonStyle || 'solid',
      gradientStyle: branding?.gradientStyle || 'infrastructure',
      darkModeEnabled: Boolean(branding?.darkModeEnabled ?? true),
      defaultThemeMode,
      headingFont: safeFont(branding?.headingFont, 'Inter'),
      bodyFont: safeFont(branding?.bodyFont, 'Inter'),
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
    '--color-muted': `color-mix(in srgb, ${settings.branding.textColor} 68%, transparent)`,
    '--color-subtle': `color-mix(in srgb, ${settings.branding.textColor} 12%, transparent)`,
    '--color-border': `color-mix(in srgb, ${settings.branding.textColor} 18%, transparent)`,
    '--color-header': `color-mix(in srgb, ${settings.branding.cardBackgroundColor} 88%, transparent)`,
    '--font-heading': `${settings.branding.headingFont}, ui-sans-serif, system-ui, sans-serif`,
    '--font-body': `${settings.branding.bodyFont}, ui-sans-serif, system-ui, sans-serif`,
    '--radius-ui': radius,
    colorScheme: settings.branding.defaultThemeMode === 'light' ? 'light' : 'dark',
  }

  for (const item of settings.branding.customVariables) {
    variables[item.name] = item.value
  }

  return variables as CSSProperties
}
