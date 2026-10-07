import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { saveService, deleteService } from "../../actions";
import ConfirmButton from "@/components/ConfirmButton";

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const rows = await db().select().from(services).orderBy(asc(services.position));
  const sv = rows.find((r) => String(r.id) === edit);
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-bold">Services</h1>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-4">
              <div><p className="font-semibold">{r.name}</p><p className="text-sm text-muted">Starting at {r.startingPrice}</p></div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/services?edit=${r.id}`} className="text-sm text-accent hover:underline">Edit</Link>
                <form action={deleteService}><input type="hidden" name="id" value={r.id} /><ConfirmButton>Delete</ConfirmButton></form>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold">{sv ? "Edit service" : "Add service"}</h2>
        <form key={sv?.id ?? "new"} action={saveService} className="mt-6 space-y-4">
          {sv && <input type="hidden" name="id" value={sv.id} />}
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="name">Name</label><input id="name" name="name" required defaultValue={sv?.name} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="startingPrice">Starting price (e.g. $150)</label><input id="startingPrice" name="startingPrice" required defaultValue={sv?.startingPrice} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="description">Description</label><textarea id="description" name="description" required rows={3} defaultValue={sv?.description} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="features">What's included (one per line)</label><textarea id="features" name="features" rows={5} defaultValue={sv?.features} className="input" /></div>
          <div><label className="mb-1.5 block text-sm font-medium" htmlFor="position">Order (lower shows first)</label><input id="position" name="position" type="number" defaultValue={sv?.position ?? rows.length + 1} className="input" /></div>
          <div className="flex gap-3"><button className="btn">{sv ? "Save changes" : "Add service"}</button>{sv && <Link href="/admin/services" className="btn-ghost">Cancel</Link>}</div>
        </form>
      </section>
    </div>
  );
}
