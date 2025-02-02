import { type NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { alternatives, cravings } from "@/db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const cravingId = searchParams.get("craving_id");
  const alternativeId = searchParams.get("alternative_id");

  if (!cravingId || !alternativeId) {
    return NextResponse.json(
      { error: "Invalid request - missing craving or alternative id" },
      { status: 400 },
    );
  }

  const craving = await db
    .select()
    .from(cravings)
    .where(eq(cravings.id, cravingId));

  const alternative = await db
    .select()
    .from(alternatives)
    .where(eq(alternatives.id, alternativeId));

  return NextResponse.json({ craving, alternative });
}
