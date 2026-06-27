import configPromise from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
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
