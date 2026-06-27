import { NextResponse } from 'next/server'
import { getPublicSettings } from '@/lib/public-settings'

export async function GET() {
  const settings = await getPublicSettings()
  return NextResponse.json(settings, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
