import { desc } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { deleteMessage } from "../actions";
import ConfirmButton from "@/components/ConfirmButton";
import { fmtDate } from "@/lib/content";

export default async function Messages() {
  const rows = await db().select().from(messages).orderBy(desc(messages.createdAt));
  return (
    <section>
      <h1 className="text-2xl font-bold">Messages</h1>
      {rows.length === 0 && <p className="mt-6 text-muted">No messages yet. Contact form submissions will appear here.</p>}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {rows.map((m) => (
          <li key={m.id} className="py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p><strong>{m.name}</strong> <a href={`mailto:${m.email}`} className="text-accent hover:underline">{m.email}</a></p>
              <time className="text-sm text-muted">{fmtDate(m.createdAt)}</time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-muted">{m.message}</p>
            <form action={deleteMessage} className="mt-3">
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton>Delete message</ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
