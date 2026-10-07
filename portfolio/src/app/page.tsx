import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, services, posts } from "@/db/schema";
import { getSettings, lines, csv, parseSkills, fmtDate } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function Home() {
  const s = await getSettings();
  const [projectRows, serviceRows, postRows] = await Promise.all([
    db().select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.position)).catch(() => []),
    db().select().from(services).orderBy(asc(services.position)).catch(() => []),
    db().select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt)).limit(3).catch(() => []),
  ]);

  return (
    <>
      <Navbar name={s.name} />
      <main>
        <Hero name={s.name} role={s.role} title={s.heroTitle} sub={s.heroSub} builds={lines(s.heroBuilds)} />

        <section id="about" className="section border-t border-line">
          <div className="wrap grid gap-10 md:grid-cols-[280px_1fr] md:gap-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.photoUrl} alt={`Portrait of ${s.name}`} width={280} height={336} className="aspect-[5/6] w-full max-w-[280px] rounded-lg border border-line object-cover" />
            <div>
              <h2 className="h2">About me</h2>
              <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted">
                {s.aboutText.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section border-t border-line">
          <div className="wrap">
            <h2 className="h2">Skills and tools</h2>
            <div className="mt-10 border-b border-line">
              {parseSkills(s.skills).map((g) => (
                <div key={g.group} className="grid gap-3 border-t border-line py-6 sm:grid-cols-[200px_1fr]">
                  <h3 className="text-lg font-semibold">{g.group}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((i) => <li key={i} className="chip text-sm">{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section border-t border-line">
          <div className="wrap">
            <h2 className="h2">Projects</h2>
            <div className="mt-10 border-b border-line">
              {projectRows.length === 0 && <p className="border-t border-line py-8 text-muted">Projects will show up here once you add them in the admin panel.</p>}
              {projectRows.map((p) => (
                <article key={p.id} className="grid gap-4 border-t border-line py-8 md:grid-cols-[1fr_auto] md:gap-12">
                  <div>
                    <h3 className="text-2xl font-semibold">{p.title}</h3>
                    <p className="mt-3 max-w-2xl text-muted">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {csv(p.tags).map((t) => <li key={t} className="chip">{t}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-3 md:flex-col md:items-end">
                    {p.liveUrl && <a href={p.liveUrl} className="btn-ghost" target="_blank" rel="noreferrer">Live site</a>}
                    {p.repoUrl && <a href={p.repoUrl} className="btn-ghost" target="_blank" rel="noreferrer">Source code</a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section border-t border-line">
          <div className="wrap">
            <h2 className="h2">Services</h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
              {serviceRows.map((sv) => (
                <div key={sv.id} className="bg-ink p-7">
                  <h3 className="text-xl font-semibold">{sv.name}</h3>
                  <p className="mt-5 text-sm text-muted">Starting at</p>
                  <p className="text-4xl font-bold text-accent">{sv.startingPrice}</p>
                  <p className="mt-5 text-muted">{sv.description}</p>
                  <ul className="mt-5 list-disc space-y-1.5 pl-5 marker:text-accent">
                    {lines(sv.features).map((f) => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">Final price depends on scope. Send me your project details for an exact quote.</p>
          </div>
        </section>

        <section id="blog" className="section border-t border-line">
          <div className="wrap">
            <div className="flex items-end justify-between gap-4">
              <h2 className="h2">From the blog</h2>
              <Link href="/blog" className="text-accent hover:underline">All posts</Link>
            </div>
            <div className="mt-10 border-b border-line">
              {postRows.length === 0 && <p className="border-t border-line py-8 text-muted">No posts yet.</p>}
              {postRows.map((p) => (
                <article key={p.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[140px_1fr] md:gap-10">
                  <time className="text-sm text-muted" dateTime={p.createdAt.toISOString()}>{fmtDate(p.createdAt)}</time>
                  <div>
                    <h3 className="text-xl font-semibold"><Link href={`/blog/${p.slug}`} className="hover:text-accent">{p.title}</Link></h3>
                    <p className="mt-2 max-w-2xl text-muted">{p.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section border-t border-line">
          <div className="wrap grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="h2">Let's talk about your project</h2>
              <p className="mt-6 max-w-md text-lg text-muted">Tell me what you need and when you need it. I reply within a couple of days.</p>
              <ul className="mt-8 space-y-2">
                <li><a href={`mailto:${s.contactEmail}`} className="text-accent hover:underline">{s.contactEmail}</a></li>
                {s.githubUrl && <li><a href={s.githubUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">GitHub</a></li>}
                {s.linkedinUrl && <li><a href={s.linkedinUrl} className="text-muted hover:text-fg" target="_blank" rel="noreferrer">LinkedIn</a></li>}
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="border-t border-line py-8">
        <p className="wrap text-sm text-muted">© {new Date().getFullYear()} {s.name}. Built with Next.js, Postgres, and Tailwind CSS.</p>
      </footer>
    </>
  );
}
