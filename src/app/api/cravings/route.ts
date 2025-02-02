import { type NextRequest, NextResponse } from "next/server";

import { ilike } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { cravings } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") ?? "";

    const cravingsList = await db
      .select()
      .from(cravings)
      .where(ilike(cravings.name, `%${q}%`));

    return NextResponse.json(cravingsList);
  } catch (error) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
