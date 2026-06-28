import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE IF EXISTS "pages_blocks_hero"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_split_hero"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_services_grid"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_featured_service"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_industry_cards"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_process_timeline"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_feature_cards"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_trust_bar"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_stats"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_testimonials"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_case_study_highlight"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_faq_accordion"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_cta_banner"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_contact_form"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_rich_text"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_image_text"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_technology_stack"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_comparison_table"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_pricing_options"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_security_notice"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_resource_list"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_smartfiche"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_mobile_app_preview"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';

    ALTER TABLE IF EXISTS "pages_blocks_recovery_emergency_cta"
      ADD COLUMN IF NOT EXISTS "design_media_fit" text DEFAULT 'cover',
      ADD COLUMN IF NOT EXISTS "design_media_aspect_ratio" text DEFAULT 'auto',
      ADD COLUMN IF NOT EXISTS "design_media_object_position" text DEFAULT 'center',
      ADD COLUMN IF NOT EXISTS "design_media_frame" text DEFAULT 'card',
      ADD COLUMN IF NOT EXISTS "design_media_padding" text DEFAULT 'none',
      ADD COLUMN IF NOT EXISTS "design_media_background_color" text,
      ADD COLUMN IF NOT EXISTS "design_mobile_layout" text DEFAULT 'stack',
      ADD COLUMN IF NOT EXISTS "design_mobile_media" text DEFAULT 'show',
      ADD COLUMN IF NOT EXISTS "design_mobile_spacing" text DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "design_mobile_cta_layout" text DEFAULT 'stack';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      table_name text;
    BEGIN
      FOREACH table_name IN ARRAY ARRAY[
        'pages_blocks_hero',
        'pages_blocks_split_hero',
        'pages_blocks_services_grid',
        'pages_blocks_featured_service',
        'pages_blocks_industry_cards',
        'pages_blocks_process_timeline',
        'pages_blocks_feature_cards',
        'pages_blocks_trust_bar',
        'pages_blocks_stats',
        'pages_blocks_testimonials',
        'pages_blocks_case_study_highlight',
        'pages_blocks_faq_accordion',
        'pages_blocks_cta_banner',
        'pages_blocks_contact_form',
        'pages_blocks_rich_text',
        'pages_blocks_image_text',
        'pages_blocks_technology_stack',
        'pages_blocks_comparison_table',
        'pages_blocks_pricing_options',
        'pages_blocks_security_notice',
        'pages_blocks_resource_list',
        'pages_blocks_smartfiche',
        'pages_blocks_mobile_app_preview',
        'pages_blocks_recovery_emergency_cta'
      ]
      LOOP
        EXECUTE format(
          'ALTER TABLE IF EXISTS %I
            DROP COLUMN IF EXISTS design_media_fit,
            DROP COLUMN IF EXISTS design_media_aspect_ratio,
            DROP COLUMN IF EXISTS design_media_object_position,
            DROP COLUMN IF EXISTS design_media_frame,
            DROP COLUMN IF EXISTS design_media_padding,
            DROP COLUMN IF EXISTS design_media_background_color,
            DROP COLUMN IF EXISTS design_mobile_layout,
            DROP COLUMN IF EXISTS design_mobile_media,
            DROP COLUMN IF EXISTS design_mobile_spacing,
            DROP COLUMN IF EXISTS design_mobile_cta_layout',
          table_name
        );
      END LOOP;
    END $$;
  `)
}
