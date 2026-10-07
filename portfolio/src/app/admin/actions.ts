"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { projects, services, posts, messages, settings } from "@/db/schema";
import { SETTING_KEYS, safeUrl } from "@/lib/content";

// Server actions are public endpoints, so every one re-checks the session.
async function admin() {
  if (!(await auth())) throw new Error("Unauthorized");
}
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string) => Number(fd.get(k)) || 0;
const idOf = (fd: FormData) => Number(str(fd, "id")) || null;
function finish(path: string): never {
  revalidatePath("/");
  revalidatePath("/blog");
  redirect(path);
}

export async function saveProject(fd: FormData) {
  await admin();
  const v = {
    title: str(fd, "title"),
    summary: str(fd, "summary"),
    tags: str(fd, "tags"),
    liveUrl: safeUrl(str(fd, "liveUrl")),
    repoUrl: safeUrl(str(fd, "repoUrl")),
    position: num(fd, "position"),
    published: fd.get("published") === "on",
  };
  if (!v.title || !v.summary) return;
  const id = idOf(fd);
  if (id) await db().update(projects).set(v).where(eq(projects.id, id));
  else await db().insert(projects).values(v);
  finish("/admin/projects");
}
export async function deleteProject(fd: FormData) {
  await admin();
  const id = idOf(fd);
  if (id) await db().delete(projects).where(eq(projects.id, id));
  finish("/admin/projects");
}

export async function saveService(fd: FormData) {
  await admin();
  const v = {
    name: str(fd, "name"),
    description: str(fd, "description"),
    startingPrice: str(fd, "startingPrice"),
    features: str(fd, "features"),
    position: num(fd, "position"),
  };
  if (!v.name || !v.description || !v.startingPrice) return;
  const id = idOf(fd);
  if (id) await db().update(services).set(v).where(eq(services.id, id));
  else await db().insert(services).values(v);
  finish("/admin/services");
}
export async function deleteService(fd: FormData) {
  await admin();
  const id = idOf(fd);
  if (id) await db().delete(services).where(eq(services.id, id));
  finish("/admin/services");
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export async function savePost(fd: FormData) {
  await admin();
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const v = { title, slug, excerpt: str(fd, "excerpt"), content: String(fd.get("content") ?? ""), published: fd.get("published") === "on" };
  if (!v.title || !v.slug) return;
  const id = idOf(fd);
  if (id) await db().update(posts).set(v).where(eq(posts.id, id));
  else await db().insert(posts).values(v);
  finish("/admin/posts");
}
export async function deletePost(fd: FormData) {
  await admin();
  const id = idOf(fd);
  if (id) await db().delete(posts).where(eq(posts.id, id));
  finish("/admin/posts");
}

export async function deleteMessage(fd: FormData) {
  await admin();
  const id = idOf(fd);
  if (id) await db().delete(messages).where(eq(messages.id, id));
  finish("/admin");
}

export async function saveSettings(fd: FormData) {
  await admin();
  for (const key of SETTING_KEYS) {
    let value = String(fd.get(key) ?? "").trim();
    if (["githubUrl", "linkedinUrl", "photoUrl"].includes(key)) value = safeUrl(value);
    await db().insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  finish("/admin/settings");
}
