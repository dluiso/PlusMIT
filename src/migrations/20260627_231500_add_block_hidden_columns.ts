import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

const blockTables = [
  'pages_blocks_case_study_highlight',
  'pages_blocks_comparison_table',
  'pages_blocks_contact_form',
  'pages_blocks_cta_banner',
  'pages_blocks_faq_accordion',
  'pages_blocks_feature_cards',
  'pages_blocks_featured_service',
  'pages_blocks_hero',
  'pages_blocks_image_text',
  'pages_blocks_industry_cards',
  'pages_blocks_mobile_app_preview',
  'pages_blocks_pricing_options',
  'pages_blocks_process_timeline',
  'pages_blocks_recovery_emergency_cta',
  'pages_blocks_resource_list',
  'pages_blocks_rich_text',
  'pages_blocks_security_notice',
  'pages_blocks_services_grid',
  'pages_blocks_smartfiche',
  'pages_blocks_split_hero',
  'pages_blocks_stats',
  'pages_blocks_technology_stack',
  'pages_blocks_testimonials',
  'pages_blocks_trust_bar',
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of blockTables) {
    await db.execute(sql.raw(`ALTER TABLE IF EXISTS "${table}" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;`))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of blockTables) {
    await db.execute(sql.raw(`ALTER TABLE IF EXISTS "${table}" DROP COLUMN IF EXISTS "hidden";`))
  }
}
