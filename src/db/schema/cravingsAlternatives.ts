import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { alternatives } from "@/db/schema/alternatives";
import { cravings } from "@/db/schema/cravings";

export const cravingsAlternatives = pgTable(
  "cravings_alternatives",
  {
    craving_id: uuid("craving_id")
      .notNull()
      .references(() => cravings.id, { onDelete: "cascade" }),
    alternative_id: uuid("alternative_id")
      .notNull()
      .references(() => alternatives.id, {
        onDelete: "cascade",
      }),
  },
  (t) => [
    primaryKey({ columns: [t.craving_id, t.alternative_id] }),
    index("cravings_alternatives_craving_id_idx").on(t.craving_id),
    index("cravings_alternatives_alternative_id_idx").on(t.alternative_id),
  ],
);

export const cravingsAlternativesRelations = relations(
  cravingsAlternatives,
  ({ one }) => ({
    craving: one(cravings, {
      fields: [cravingsAlternatives.craving_id],
      references: [cravings.id],
    }),
    alternative: one(alternatives, {
      fields: [cravingsAlternatives.alternative_id],
      references: [alternatives.id],
    }),
  }),
);
