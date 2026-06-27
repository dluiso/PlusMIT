import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { seedContent } from './seed-content'

const payload = await getPayload({ config })

await seedContent({
  payload,
  publish: process.env.SEED_PUBLISH !== 'false',
  companyName: process.env.SEED_COMPANY_NAME || 'PlusMIT',
  primaryDomain: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
})

await payload.destroy()
console.log('Seed completed.')
