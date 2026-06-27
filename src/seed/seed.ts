import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { seedContent } from './seed-content'

try {
  const payload = await getPayload({ config })

  await seedContent({
    payload,
    publish: process.env.SEED_PUBLISH !== 'false',
    companyName: process.env.SEED_COMPANY_NAME || 'PlusMIT',
    primaryDomain: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    updateExisting: process.env.SEED_UPDATE_EXISTING === 'true',
  })

  await payload.destroy()
  console.log('Seed completed.')
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
