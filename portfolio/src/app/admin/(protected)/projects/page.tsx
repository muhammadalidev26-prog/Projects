import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { saveProject, deleteProject } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const rows = await db().select().from(projects).orderBy(asc(projects.position));
  const p = rows.find((r) => String(r.id) === edit);
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-bold">Projects</h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-muted">Order {r.position}{r.published ? "" : " · hidden"}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/projects?edit=${r.id}`} className="text-sm text-accent hover:underline">Edit</Link>
                <form action={deleteProject}><input type="hidden" name="id" value={r.id} /><ConfirmButton>Delete</ConfirmButton></form>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold">{p ? "Edit project" : "Add project"}</h2>
        <form key={p?.id ?? "new"} action={saveProject} className="mt-6 space-y-4">
          {p && <input type="hidden" name="id" value={p.id} />}
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="title">Title</label><input id="title" name="title" required defaultValue={p?.title} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="summary">Summary</label><textarea id="summary" name="summary" required rows={4} defaultValue={p?.summary} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="tags">Tags (comma separated)</label><input id="tags" name="tags" defaultValue={p?.tags} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="liveUrl">Live site URL</label><input id="liveUrl" name="liveUrl" type="url" defaultValue={p?.liveUrl} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="repoUrl">Source code URL</label><input id="repoUrl" name="repoUrl" type="url" defaultValue={p?.repoUrl} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="position">Order (lower shows first)</label><input id="position" name="position" type="number" defaultValue={p?.position ?? rows.length + 1} className="input" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" name="published" defaultChecked={p?.published ?? true} /> Show on site</label>
          <div className="flex gap-3"><button className="btn">{p ? "Save changes" : "Add project"}</button>{p && <Link href="/admin/projects" className="btn-ghost">Cancel</Link>}</div>
        </form>
      </section>
    </div>
  );
}
