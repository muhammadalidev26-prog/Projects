import { ArcReactor } from './ui'

const LINKS = [
  { label: 'TECH', href: '#tech' },
  { label: 'SUITS', href: '#marks' },
  { label: 'LEGACY', href: '#legacy' },
  { label: 'QUOTE', href: '#quote' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-abyss/70">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <ArcReactor size={54} />
            <div>
              <div className="font-display text-sm font-bold tracking-[0.25em] text-white">
                STARK INDUSTRIES
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-white/40">
                POWERED BY ARC REACTOR TECHNOLOGY
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-9">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-[11px] tracking-[0.3em] text-white/50 transition-colors hover:text-arc"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[10px] tracking-[0.2em] text-white/30 md:flex-row">
          <span>© 2024 STARK INDUSTRIES — ALL RIGHTS RESERVED</span>
          <span>FAN TRIBUTE — IRON MAN™ IS A TRADEMARK OF MARVEL</span>
        </div>
      </div>
    </footer>
  )
}
