import { db } from "./index";
import { projects, services, posts, settings } from "./schema";
import { DEFAULTS } from "../lib/content";

async function main() {
  const d = db();

  await d
    .insert(settings)
    .values(Object.entries(DEFAULTS).map(([key, value]) => ({ key, value })))
    .onConflictDoNothing();

  if ((await d.select().from(projects)).length === 0) {
    await d.insert(projects).values([
      {
        title: "Roastery landing page",
        summary:
          "A one-page site for a small coffee roaster: product sections, an order form, and images converted to WebP so it loads fast on mobile data.",
        tags: "HTML, CSS, JavaScript, Netlify Forms",
        position: 1,
      },
      {
        title: "Fitness tracker dashboard",
        summary:
          "A responsive dashboard with workout logs and progress charts, built as a React app with a REST API behind it.",
        tags: "React, TypeScript, Node.js, PostgreSQL",
        position: 2,
      },
      {
        title: "This portfolio",
        summary:
          "The site you're on: a full-stack Next.js app with a Postgres database, a protected admin panel, a markdown blog, and a contact form that emails me.",
        tags: "Next.js, TypeScript, Tailwind CSS, Drizzle, Auth.js",
        position: 3,
      },
    ]);
  }

  if ((await d.select().from(services)).length === 0) {
    await d.insert(services).values([
      {
        name: "Landing page",
        description: "One focused page that explains what you offer and gets people to contact you.",
        startingPrice: "$150",
        features: "Custom responsive design\nContact form\nSEO basics and fast loading\nOne round of revisions",
        position: 1,
      },
      {
        name: "Business website",
        description: "A multi-page site for your business, with a layout you can grow into.",
        startingPrice: "$300",
        features: "Up to 5 pages\nMobile-first design\nContact form and social links\nDeployment and domain setup",
        position: 2,
      },
      {
        name: "Web app",
        description: "A full-stack app with a database, user accounts, and an admin area.",
        startingPrice: "$600",
        features: "Frontend and backend\nDatabase and API\nLogin and admin panel\nHandover with documentation",
        position: 3,
      },
    ]);
  }

  if ((await d.select().from(posts)).length === 0) {
    await d.insert(posts).values([
      {
        slug: "from-html-css-to-nextjs",
        title: "From HTML and CSS to Next.js: what actually changed",
        excerpt: "Rebuilding a plain HTML portfolio as a full-stack app showed me what frameworks add and what they cost.",
        published: true,
        content: `When you build a site with plain HTML and CSS, the browser gets exactly the files you wrote. That is simple, and it is hard to beat for a small static page.

A framework like Next.js changes three things.

## Components replace copy and paste

A navbar is written once and reused on every page. Change it in one place and the whole site updates.

## The server becomes part of your project

Pages can read from a database before they are sent to the browser. A blog post or a project list no longer has to live in an HTML file.

## More tools, more to learn

You now deal with a build step, environment variables, and deployment settings. For a one-page site that is overkill. For a site with a blog, an admin panel, and a contact form, it pays for itself.`,
      },
      {
        slug: "dark-mode-without-the-flash",
        title: "Dark and light themes without the flash",
        excerpt: "Why pages flicker to the wrong theme on load, and the small script that fixes it.",
        published: true,
        content: `If you save a theme choice in \`localStorage\` and apply it with JavaScript at the bottom of the page, visitors see the default theme for a split second before yours kicks in. That flash is called FOUC.

## The fix

Apply the saved theme before the page paints. A tiny inline script in the \`<head>\` does it:

\`\`\`html
<script>
  const t = localStorage.getItem("theme");
  if (t) document.documentElement.dataset.theme = t;
</script>
\`\`\`

Because it runs before the body is rendered, the first paint already uses the right colors.

## Keep the colors in CSS variables

Define colors once on \`:root\` and override them under \`[data-theme="light"]\`. The script only flips one attribute and the stylesheet does the rest.`,
      },
    ]);
  }

  console.log("Seeded.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
