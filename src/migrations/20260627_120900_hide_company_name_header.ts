import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branding"
    ADD COLUMN IF NOT EXISTS "hide_company_name_in_header" boolean DEFAULT false;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branding"
    DROP COLUMN IF EXISTS "hide_company_name_in_header";
  `)
}
