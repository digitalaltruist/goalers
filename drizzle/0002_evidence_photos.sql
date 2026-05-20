ALTER TABLE "evidence_posts" DROP COLUMN IF EXISTS "visual_stamp";--> statement-breakpoint
ALTER TABLE "evidence_posts" ADD COLUMN IF NOT EXISTS "photo_url" text;--> statement-breakpoint
ALTER TABLE "evidence_posts" ADD COLUMN IF NOT EXISTS "photo_key" text;--> statement-breakpoint
UPDATE "evidence_posts" SET "photo_url" = '', "photo_key" = '' WHERE "photo_url" IS NULL;--> statement-breakpoint
ALTER TABLE "evidence_posts" ALTER COLUMN "photo_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "evidence_posts" ALTER COLUMN "photo_key" SET NOT NULL;
