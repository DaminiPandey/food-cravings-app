import { type NextRequest, NextResponse } from "next/server";

import { eq, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { alternatives } from "@/db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const [id1, id2] = searchParams.get("alternatives")?.split(",") ?? [];

  if (!id1 || !id2) {
    return NextResponse.json(
      { error: "Invalid request - missing one or more alternative ids" },
      { status: 400 },
    );
  }

  const result = await db
    .select()
    .from(alternatives)
    .where(or(eq(alternatives.id, id1), eq(alternatives.id, id2)));

  return NextResponse.json(result);
}
