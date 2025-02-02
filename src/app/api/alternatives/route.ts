import { type NextRequest, NextResponse } from "next/server";

import { and, arrayOverlaps, ilike, type SQL } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { alternatives } from "@/db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q") ?? "";
  const tags = searchParams.get("tags")?.split(",") ?? [];

  const where: SQL[] = [ilike(alternatives.name, `%${q}%`)];

  if (tags.length > 0) {
    where.push(arrayOverlaps(alternatives.dietary_tags, tags));
  }

  const alternativesList = await db
    .select()
    .from(alternatives)
    .where(and(...where));

  return NextResponse.json(alternativesList);
}
