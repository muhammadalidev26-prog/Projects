import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

const nav = [
  ["Messages", "/admin"],
  ["Projects", "/admin/projects"],
  ["Services", "/admin/services"],
  ["Blog posts", "/admin/posts"],
  ["Site settings", "/admin/settings"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await auth())) redirect("/admin/login");
  return (
    <div className="wrap py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <nav className="flex flex-wrap gap-5" aria-label="Admin">
          {nav.map(([label, href]) => <Link key={href} href={href} className="text-muted hover:text-fg">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-accent hover:underline">View site</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button className="btn-ghost !py-1.5 text-sm">Sign out</button>
          </form>
        </div>
      </header>
      <div className="py-8">{children}</div>
    </div>
  );
}
