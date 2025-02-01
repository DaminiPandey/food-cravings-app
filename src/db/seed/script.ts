import { db } from "@/db/drizzle";
import {
  cravings,
  alternatives,
  cravingsAlternatives,
} from "@/db/schema/index";
import { seedData } from "@/db/seed/seed";

const seedDatabase = async () => {
  console.log("Seeding database...");

  try {
    // alternatives
    const alternativeIdMap = new Map();

    for (const alt of seedData.alternatives) {
      const [insertedAlt] = await db
        .insert(alternatives)
        .values({
          name: alt.name,
          calories_min: alt.calories_min,
          calories_max: alt.calories_max,
          carbs_min: alt.carbs_min,
          carbs_max: alt.carbs_max,
          sugar_min: alt.sugar_min,
          sugar_max: alt.sugar_max,
          fat_min: alt.fat_min,
          fat_max: alt.fat_max,
          protein_min: alt.protein_min,
          protein_max: alt.protein_max,
          additional_nutrition: alt.additional_nutrition || {},
          dietary_tags: alt.dietary_tags || [],
        })
        .returning({ id: alternatives.id });

      alternativeIdMap.set(alt.temp_id, insertedAlt.id);
    }

    // cravings
    const cravingIdMap = new Map();

    for (const craving of seedData.cravings) {
      const [insertedCraving] = await db
        .insert(cravings)
        .values({
          name: craving.name,
          calories_min: craving.calories_min,
          calories_max: craving.calories_max,
          carbs_min: craving.carbs_min,
          carbs_max: craving.carbs_max,
          sugar_min: craving.sugar_min,
          sugar_max: craving.sugar_max,
          fat_min: craving.fat_min,
          fat_max: craving.fat_max,
          protein_min: craving.protein_min,
          protein_max: craving.protein_max,
          additional_nutrition: craving.additional_nutrition || {},
        })
        .returning({ id: cravings.id });

      cravingIdMap.set(craving.temp_id, insertedCraving.id);
    }

    // cravings alternatives
    for (const craving of seedData.cravings) {
      const cravingUUID = cravingIdMap.get(craving.temp_id);

      if (!cravingUUID) continue;

      for (const altTempId of craving.alternatives) {
        const alternativeUUID = alternativeIdMap.get(altTempId);

        if (!alternativeUUID) continue;

        await db.insert(cravingsAlternatives).values({
          craving_id: cravingUUID,
          alternative_id: alternativeUUID,
        });
      }
    }

    console.log("Seeding complete! ✅");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

seedDatabase().catch((err) => {
  console.error("Seeding error:", err);
});
