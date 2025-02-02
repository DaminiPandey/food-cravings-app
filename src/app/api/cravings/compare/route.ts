import { type NextRequest, NextResponse } from "next/server";

import { eq, or } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cravings } from "@/db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const [id1, id2] = searchParams.get("cravings")?.split(",") ?? [];

  if (!id1 || !id2) {
    return NextResponse.json(
      { error: "Invalid request - missing one or more craving ids" },
      { status: 400 },
    );
  }

  const result = await db
    .select()
    .from(cravings)
    .where(or(eq(cravings.id, id1), eq(cravings.id, id2)));

  return NextResponse.json(result);
}
