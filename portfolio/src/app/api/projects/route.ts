import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { csv } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db().select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.position));
  return NextResponse.json(rows.map(({ published, ...p }) => ({ ...p, tags: csv(p.tags) })));
}
