import type { GlobalConfig } from 'payload'
import { analyticsFields } from '@/lib/fields'
import { contentAccess, systemFieldAccess } from '@/lib/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Website',
    description: 'Public company, contact, SEO, analytics, footer, announcement, and maintenance settings.',
  },
  access: {
    read: () => true,
    update: contentAccess,
  },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'PlusMIT' },
    { name: 'tagline', type: 'text' },
    { name: 'primaryDomain', type: 'text' },
    { name: 'publicEmail', type: 'email' },
    { name: 'phoneNumber', type: 'text' },
    { name: 'address', type: 'textarea' },
    { name: 'serviceArea', type: 'text' },
    { name: 'businessHours', type: 'textarea' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'defaultCtaLabel', type: 'text', defaultValue: 'Request Assessment' },
    { name: 'defaultCtaUrl', type: 'text', defaultValue: '/request-assessment' },
    analyticsFields,
    { name: 'defaultSeoImage', type: 'upload', relationTo: 'media' },
    { name: 'defaultOpenGraphImage', type: 'upload', relationTo: 'media' },
    { name: 'footerText', type: 'textarea' },
    { name: 'copyrightText', type: 'text' },
    {
      name: 'legalLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'announcementEnabled', type: 'checkbox', defaultValue: false },
    { name: 'announcementText', type: 'text' },
    { name: 'announcementLink', type: 'text' },
    { name: 'maintenanceMode', type: 'checkbox', defaultValue: false },
    { name: 'maintenanceMessage', type: 'textarea' },
    {
      name: 'setupCompleted',
      type: 'checkbox',
      defaultValue: false,
      access: { update: systemFieldAccess },
      admin: {
        readOnly: true,
        description: 'Managed by the first-run setup wizard or recovery commands.',
      },
    },
  ],
}

export const Branding: GlobalConfig = {
  slug: 'branding',
  label: 'Branding / Theme Settings',
  admin: {
    group: 'Website',
    description: 'Logo, favicon, colors, typography, and safe CSS variable values.',
  },
  access: {
    read: () => true,
    update: contentAccess,
  },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'darkLogo', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'hideCompanyNameInHeader',
      label: 'Hide company name in header when logo is available',
      type: 'checkbox',
      defaultValue: false,
    },
    { name: 'primaryColor', type: 'text', defaultValue: '#38bdf8' },
    { name: 'secondaryColor', type: 'text', defaultValue: '#1d4ed8' },
    { name: 'accentColor', type: 'text', defaultValue: '#22c55e' },
    { name: 'backgroundColor', type: 'text', defaultValue: '#07111f' },
    { name: 'textColor', type: 'text', defaultValue: '#f8fafc' },
    { name: 'cardBackgroundColor', type: 'text', defaultValue: '#0f1b2d' },
    { name: 'borderRadiusStyle', type: 'select', defaultValue: 'medium', options: ['none', 'small', 'medium', 'large'] },
    { name: 'buttonStyle', type: 'select', defaultValue: 'solid', options: ['solid', 'outline', 'glass'] },
    { name: 'gradientStyle', type: 'select', defaultValue: 'infrastructure', options: ['none', 'infrastructure', 'cloud', 'automation'] },
    { name: 'darkModeEnabled', type: 'checkbox', defaultValue: true },
    { name: 'defaultThemeMode', type: 'select', defaultValue: 'dark', options: ['dark', 'light', 'system'] },
    {
      name: 'customCssVariables',
      type: 'array',
      admin: { description: 'Only CSS custom property names and color/size token values are allowed.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'headingFont', type: 'text', defaultValue: 'Inter' },
    { name: 'bodyFont', type: 'text', defaultValue: 'Inter' },
  ],
}

export const globals: GlobalConfig[] = [SiteSettings, Branding]
