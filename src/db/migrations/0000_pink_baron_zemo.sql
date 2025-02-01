CREATE TABLE "cravings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"calories_min" integer NOT NULL,
	"calories_max" integer NOT NULL,
	"carbs_min" integer NOT NULL,
	"carbs_max" integer NOT NULL,
	"sugar_min" integer NOT NULL,
	"sugar_max" integer NOT NULL,
	"fat_min" integer NOT NULL,
	"fat_max" integer NOT NULL,
	"protein_min" integer NOT NULL,
	"protein_max" integer NOT NULL,
	"additional_nutrition" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "cravings_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "alternatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"calories_min" integer NOT NULL,
	"calories_max" integer NOT NULL,
	"carbs_min" integer NOT NULL,
	"carbs_max" integer NOT NULL,
	"sugar_min" integer NOT NULL,
	"sugar_max" integer NOT NULL,
	"fat_min" integer NOT NULL,
	"fat_max" integer NOT NULL,
	"protein_min" integer NOT NULL,
	"protein_max" integer NOT NULL,
	"additional_nutrition" jsonb DEFAULT '{}'::jsonb,
	"dietary_tags" text[] DEFAULT '{}',
	CONSTRAINT "alternatives_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "cravings_alternatives" (
	"craving_id" uuid NOT NULL,
	"alternative_id" uuid NOT NULL,
	CONSTRAINT "cravings_alternatives_craving_id_alternative_id_pk" PRIMARY KEY("craving_id","alternative_id")
);
--> statement-breakpoint
ALTER TABLE "cravings_alternatives" ADD CONSTRAINT "cravings_alternatives_craving_id_cravings_id_fk" FOREIGN KEY ("craving_id") REFERENCES "public"."cravings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cravings_alternatives" ADD CONSTRAINT "cravings_alternatives_alternative_id_alternatives_id_fk" FOREIGN KEY ("alternative_id") REFERENCES "public"."alternatives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cravings_name_idx" ON "cravings" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cravings_calories_idx" ON "cravings" USING btree ("calories_min","calories_max");--> statement-breakpoint
CREATE INDEX "cravings_nutrition_idx" ON "cravings" USING btree ("carbs_max","protein_max","sugar_max","fat_max");--> statement-breakpoint
CREATE INDEX "alternatives_name_idx" ON "alternatives" USING btree ("name");--> statement-breakpoint
CREATE INDEX "alternatives_calories_idx" ON "alternatives" USING btree ("calories_min","calories_max");--> statement-breakpoint
CREATE INDEX "alternatives_nutrition_idx" ON "alternatives" USING btree ("carbs_max","protein_max","sugar_max","fat_max");--> statement-breakpoint
CREATE INDEX "alternatives_dietary_tags_idx" ON "alternatives" USING gin ("dietary_tags");--> statement-breakpoint
CREATE INDEX "cravings_alternatives_craving_id_idx" ON "cravings_alternatives" USING btree ("craving_id");--> statement-breakpoint
CREATE INDEX "cravings_alternatives_alternative_id_idx" ON "cravings_alternatives" USING btree ("alternative_id");