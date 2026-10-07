import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const metadata = { title: "Admin login", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await auth()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <main className="wrap flex min-h-screen flex-col justify-center py-16">
      <div className="max-w-sm">
        <h1 className="text-3xl font-bold">Admin login</h1>
        <p className="mt-3 text-muted">Sign in with the GitHub account set as the admin.</p>
        {error && <p className="mt-4 text-red-400">That GitHub account isn't allowed to sign in.</p>}
        <form action={async () => { "use server"; await signIn("github", { redirectTo: "/admin" }); }} className="mt-6">
          <button className="btn">Sign in with GitHub</button>
        </form>
      </div>
    </main>
  );
}
