import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'TECH', href: '#tech' },
  { label: 'SUITS', href: '#marks' },
  { label: 'LEGACY', href: '#legacy' },
  { label: 'QUOTE', href: '#quote' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/5 bg-void/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="group flex items-center gap-3">
          {/* mini arc reactor */}
          <span className="relative grid h-9 w-9 place-items-center">
            <span className="absolute inset-0 rounded-full border border-arc/40" />
            <span
              className="absolute inset-[4px] rounded-full animate-spin-slow"
              style={{
                borderTop: '2px solid transparent',
                borderRight: '2px solid #5fd7ff',
                borderBottom: '2px solid transparent',
                borderLeft: '2px solid transparent',
              }}
            />
            <span className="h-2 w-2 rounded-full bg-arc shadow-[0_0_10px_#5fd7ff]" />
          </span>
          <span className="font-display text-sm font-bold tracking-[0.25em] text-white">
            STARK<span className="text-crimson">//</span>INDUSTRIES
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative font-mono text-[11px] tracking-[0.3em] text-white/55 transition-colors hover:text-arc"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-arc transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="#tech"
            className="border border-crimson/50 bg-crimson/10 px-5 py-2.5 font-mono text-[11px] tracking-[0.3em] text-white transition-all duration-300 hover:bg-crimson/25 hover:shadow-[0_0_25px_rgba(224,38,49,0.4)]"
          >
            SUIT UP
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-white/5 bg-void/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-l-2 border-transparent py-3 pl-4 font-mono text-xs tracking-[0.3em] text-white/70 transition-colors hover:border-crimson hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
