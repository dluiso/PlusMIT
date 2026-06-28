import configPromise from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import '@/components/admin/PlusMITDashboard.css'
import '@/components/admin/VisualComposer.css'
import '@/styles/payload-admin.css'
import type { ServerFunctionClient } from 'payload'
import { importMap } from './admin/importMap.js'

export const metadata = {
  title: 'PlusMIT CMS',
  description: 'PlusMIT content management system',
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  const serverFunction: ServerFunctionClient = async (args) => {
    'use server'

    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    })
  }

  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
