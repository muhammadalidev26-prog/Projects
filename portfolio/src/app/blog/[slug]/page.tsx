import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import ReactMarkdown from "react-markdown";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getSettings, fmtDate } from "@/lib/content";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const [post] = await db().select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1);
  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug).catch(() => undefined);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const post = await getPost((await params).slug).catch(() => undefined);
  if (!post) notFound();
  const s = await getSettings();
  return (
    <>
      <Navbar name={s.name} />
      <main className="wrap py-16 sm:py-24">
        <Link href="/blog" className="text-sm text-accent hover:underline">All posts</Link>
        <article className="mt-6 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
          <time className="mt-3 block text-sm text-muted" dateTime={post.createdAt.toISOString()}>{fmtDate(post.createdAt)}</time>
          <div className="prose prose-invert mt-10 max-w-none prose-a:text-accent prose-code:font-mono prose-pre:border prose-pre:border-line prose-pre:bg-surface">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
}
