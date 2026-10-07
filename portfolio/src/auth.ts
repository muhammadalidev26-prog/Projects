import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  pages: { signIn: "/admin/login" },
  callbacks: {
    // Only the configured GitHub account may sign in.
    signIn({ profile }) {
      const allowed = process.env.ADMIN_GITHUB_USERNAME?.toLowerCase();
      const login = (profile as { login?: string } | undefined)?.login?.toLowerCase();
      return !!allowed && login === allowed;
    },
  },
});
