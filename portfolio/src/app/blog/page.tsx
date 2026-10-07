import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getSettings, fmtDate } from "@/lib/content";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog" };

export default async function BlogIndex() {
  const s = await getSettings();
  const rows = await db().select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt)).catch(() => []);
  return (
    <>
      <Navbar name={s.name} />
      <main className="wrap py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <div className="mt-10 border-b border-line">
          {rows.length === 0 && <p className="border-t border-line py-8 text-muted">No posts yet.</p>}
          {rows.map((p) => (
            <article key={p.id} className="grid gap-2 border-t border-line py-7 md:grid-cols-[140px_1fr] md:gap-10">
              <time className="text-sm text-muted" dateTime={p.createdAt.toISOString()}>{fmtDate(p.createdAt)}</time>
              <div>
                <h2 className="text-2xl font-semibold"><Link href={`/blog/${p.slug}`} className="hover:text-accent">{p.title}</Link></h2>
                <p className="mt-2 max-w-2xl text-muted">{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
