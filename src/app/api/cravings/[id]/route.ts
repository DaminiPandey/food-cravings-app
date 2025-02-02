import { NextResponse, type NextRequest } from "next/server";

import { type SQL, sql, eq, and, arrayOverlaps } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { alternatives, cravings, cravingsAlternatives } from "@/db/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const searchParams = req.nextUrl.searchParams;
  const { id } = await params;

  const tags = searchParams.get("dietary_tags")?.split(",") ?? [];

  const where: SQL[] = [eq(cravings.id, id)];

  const [result] = await db
    .select({
      id: cravings.id,
      name: cravings.name,
      calories_min: cravings.calories_min,
      calories_max: cravings.calories_max,
      carbs_min: cravings.carbs_min,
      carbs_max: cravings.carbs_max,
      sugar_min: cravings.sugar_min,
      sugar_max: cravings.sugar_max,
      fat_min: cravings.fat_min,
      fat_max: cravings.fat_max,
      protein_min: cravings.protein_min,
      protein_max: cravings.protein_max,
      additional_nutrition: cravings.additional_nutrition,
      alternatives: sql`COALESCE(json_agg(DISTINCT ${alternatives}) FILTER (WHERE ${alternatives.id} IS NOT NULL ), '[]')`,
    })
    .from(cravings)
    .leftJoin(
      cravingsAlternatives,
      eq(cravings.id, cravingsAlternatives.craving_id),
    )
    .leftJoin(
      alternatives,
      and(
        eq(cravingsAlternatives.alternative_id, alternatives.id),
        tags.length > 0
          ? arrayOverlaps(alternatives.dietary_tags, tags)
          : undefined,
      ),
    )
    .where(and(...where))
    .groupBy(cravings.id);

  if (!result) {
    return NextResponse.json({ error: "Craving not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
