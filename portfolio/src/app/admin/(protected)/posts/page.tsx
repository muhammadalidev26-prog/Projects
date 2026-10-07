import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { savePost, deletePost } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";
import MarkdownEditor from "@/components/MarkdownEditor";

export default async function AdminPosts({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const rows = await db().select().from(posts).orderBy(desc(posts.createdAt));
  const p = rows.find((r) => String(r.id) === edit);
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-bold">Blog posts</h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-4">
              <div><p className="font-semibold">{r.title}</p><p className="text-sm text-muted">/blog/{r.slug} · {r.published ? "Published" : "Draft"}</p></div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/posts?edit=${r.id}`} className="text-sm text-accent hover:underline">Edit</Link>
                <form action={deletePost}><input type="hidden" name="id" value={r.id} /><ConfirmButton>Delete</ConfirmButton></form>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold">{p ? "Edit post" : "Write a post"}</h2>
        <form key={p?.id ?? "new"} action={savePost} className="mt-6 space-y-4">
          {p && <input type="hidden" name="id" value={p.id} />}
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-medium" htmlFor="title">Title</label><input id="title" name="title" required defaultValue={p?.title} className="input" /></div>
            <div><label className="mb-1.5 block text-sm font-medium" htmlFor="slug">URL slug (auto from title if empty)</label><input id="slug" name="slug" defaultValue={p?.slug} className="input" /></div>
          </div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="excerpt">Short excerpt</label><input id="excerpt" name="excerpt" defaultValue={p?.excerpt} className="input" /></div>
          <MarkdownEditor name="content" defaultValue={p?.content} />
          <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? false} /> Publish (uncheck to save as draft)</label>
          <div className="flex gap-3"><button className="btn">{p ? "Save changes" : "Save post"}</button>{p && <Link href="/admin/posts" className="btn-ghost">Cancel</Link>}</div>
        </form>
      </section>
    </div>
  );
}
