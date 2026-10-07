import { db } from "@/db";
import { settings } from "@/db/schema";

export const DEFAULTS = {
  name: "Muhammad Ali",
  role: "Frontend developer",
  heroTitle: "I build fast, clean websites for small businesses and startups.",
  heroSub:
    "I'm Muhammad Ali, a self-taught frontend developer taking on freelance projects: landing pages, business sites, and full-stack web apps.",
  heroBuilds: "fast websites\nresponsive interfaces\nlanding pages that convert",
  aboutText:
    "I taught myself web development by building things: first plain HTML and CSS, then JavaScript, and now full-stack frameworks. I care about pages that load quickly, look right on every screen, and are easy for a client to keep updating.\n\nI work with small businesses, creators, and startups who need a professional site without a long agency process. I handle the design details, the responsive layout, and the code, and I'll tell you honestly what fits your budget and what doesn't.",
  skills:
    "Frontend: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS\nBackend: Node.js, PostgreSQL, REST APIs, Python\nTools: Git, GitHub, Figma, Netlify, Vercel",
  contactEmail: "hello@example.com",
  githubUrl: "https://github.com/your-username",
  linkedinUrl: "",
  photoUrl: "/photo.svg",
};
export type SettingKey = keyof typeof DEFAULTS;
export const SETTING_KEYS = Object.keys(DEFAULTS) as SettingKey[];

export async function getSettings(): Promise<typeof DEFAULTS> {
  try {
    const rows = await db().select().from(settings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULTS, ...map };
  } catch {
    return DEFAULTS;
  }
}

export const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
export const csv = (s: string) => s.split(",").map((t) => t.trim()).filter(Boolean);

export function parseSkills(s: string) {
  return lines(s).map((l) => {
    const i = l.indexOf(":");
    return { group: i > -1 ? l.slice(0, i).trim() : "Skills", items: csv(i > -1 ? l.slice(i + 1) : l) };
  });
}

export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(d);

/** Only allow http(s) or site-relative URLs, so admin input can't inject javascript: links. */
export function safeUrl(u: string) {
  const v = u.trim();
  return /^(https?:\/\/|\/)/i.test(v) ? v : "";
}
