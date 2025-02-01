import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

import { cravingsAlternatives } from "@/db/schema/cravingsAlternatives";

export const cravings = pgTable(
  "cravings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    calories_min: integer("calories_min").notNull(),
    calories_max: integer("calories_max").notNull(),
    carbs_min: integer("carbs_min").notNull(),
    carbs_max: integer("carbs_max").notNull(),
    sugar_min: integer("sugar_min").notNull(),
    sugar_max: integer("sugar_max").notNull(),
    fat_min: integer("fat_min").notNull(),
    fat_max: integer("fat_max").notNull(),
    protein_min: integer("protein_min").notNull(),
    protein_max: integer("protein_max").notNull(),
    additional_nutrition: jsonb("additional_nutrition").default({}),
  },
  (t) => [
    index("cravings_name_idx").on(t.name),
    index("cravings_calories_idx").on(t.calories_min, t.calories_max),
    index("cravings_nutrition_idx").on(
      t.carbs_max,
      t.protein_max,
      t.sugar_max,
      t.fat_max,
    ),
  ],
);

export const cravingsRelations = relations(cravings, ({ many }) => ({
  cravingsAlternatives: many(cravingsAlternatives),
}));
