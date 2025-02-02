import { type NextRequest, NextResponse } from "next/server";

import { and, eq, type SQL, sql } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { alternatives, cravings, cravingsAlternatives } from "@/db/schema";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  const where: SQL[] = [eq(alternatives.id, id)];

  const result = await db
    .select({
      id: alternatives.id,
      name: alternatives.name,
      calories_min: alternatives.calories_min,
      calories_max: alternatives.calories_max,
      carbs_min: alternatives.carbs_min,
      carbs_max: alternatives.carbs_max,
      sugar_min: alternatives.sugar_min,
      sugar_max: alternatives.sugar_max,
      fat_min: alternatives.fat_min,
      fat_max: alternatives.fat_max,
      protein_min: alternatives.protein_min,
      protein_max: alternatives.protein_max,
      additional_nutrition: alternatives.additional_nutrition,
      dietary_tags: alternatives.dietary_tags,
      cravings: sql`COALESCE(json_agg(DISTINCT ${cravings}) FILTER (WHERE ${cravings.id} IS NOT NULL), '[]')`,
    })
    .from(alternatives)
    .leftJoin(
      cravingsAlternatives,
      eq(cravingsAlternatives.alternative_id, alternatives.id),
    )
    .leftJoin(cravings, eq(cravings.id, cravingsAlternatives.craving_id))
    .where(and(...where))
    .groupBy(alternatives.id);

  return NextResponse.json(result);
}
