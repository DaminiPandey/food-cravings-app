import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

config({ path: ".env" });

export const db = drizzle(process.env.DATABASE_URL!, { schema });
