"use client";
import { useEffect, useState } from "react";

type Props = { name: string; role: string; title: string; sub: string; builds: string[] };

// Colors strings, comments and keywords in the typed code.
function tint(code: string) {
  return code.split(/("[^"]*"?|\/\/.*|\b(?:const|true|false)\b)/).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"')) return <span key={i} className="text-accent">{part}</span>;
    if (part.startsWith("//")) return <span key={i} className="text-muted">{part}</span>;
    if (/^(const|true|false)$/.test(part)) return <span key={i} className="text-sky-300">{part}</span>;
    return <span key={i}>{part}</span>;
  });
}

export default function Hero({ name, role, title, sub, builds }: Props) {
  const code = [
    "// portfolio.ts",
    "const developer = {",
    `  name: ${JSON.stringify(name)},`,
    `  role: ${JSON.stringify(role)},`,
    "  builds: [",
    ...builds.map((b) => `    ${JSON.stringify(b)},`),
    "  ],",
    "  openToWork: true,",
    "};",
  ].join("\n");

  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(code.length);
      return;
    }
    const id = setInterval(() => setN((c) => (c >= code.length ? (clearInterval(id), c) : c + 1)), 28);
    return () => clearInterval(id);
  }, [code]);

  return (
    <section className="wrap grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{sub}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn">See my projects</a>
          <a href="#contact" className="btn-ghost">Get in touch</a>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface" aria-hidden="true">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="ml-3 font-mono text-xs text-muted">portfolio.ts</span>
        </div>
        <pre
          className="overflow-x-auto p-5 font-mono text-sm leading-7 sm:text-base"
          style={{ minHeight: `${(code.split("\n").length * 1.75 + 2.5).toFixed(2)}rem` }}
        >
          <code>{tint(code.slice(0, n))}<span className="caret" /></code>
        </pre>
      </div>
      <p className="sr-only">{name}, {role}. Open to freelance work.</p>
    </section>
  );
}
