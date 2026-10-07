import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof create> | undefined;
function create() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}
/** Lazy so `next build` doesn't need a database connection. */
export const db = () => (_db ??= create());
