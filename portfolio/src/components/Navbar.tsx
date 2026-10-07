"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["About", "/#about"],
  ["Skills", "/#skills"],
  ["Projects", "/#projects"],
  ["Services", "/#services"],
  ["Blog", "/#blog"],
  ["Contact", "/#contact"],
] as const;

export default function Navbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <Link href="/" className="text-lg font-bold tracking-tight">{name}</Link>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <li key={href}><Link href={href} className="text-muted transition hover:text-fg">{label}</Link></li>
          ))}
        </ul>
        <Link href="/#contact" className="btn hidden md:inline-flex">Hire me</Link>
        <button
          className="rounded-md border border-line px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>
      {open && (
        <ul id="mobile-menu" className="wrap flex flex-col gap-1 border-t border-line pb-4 pt-2 md:hidden">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className="block py-2 text-muted hover:text-fg">{label}</Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
