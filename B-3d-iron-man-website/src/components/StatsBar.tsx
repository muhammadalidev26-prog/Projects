import { CountUp } from './ui'

const STATS = [
  { value: 85, decimals: 0, suffix: '', label: 'SUIT ITERATIONS', sub: 'MK I → MK LXXXV' },
  { value: 8.4, decimals: 1, suffix: ' GW', label: 'REACTOR OUTPUT', sub: 'CLEAN ENERGY CORE' },
  { value: 1600, decimals: 0, suffix: ' MPH', label: 'MAX VELOCITY', sub: 'MACH 2.1 CAPABLE' },
  { value: 2500, decimals: 0, suffix: ' FT', label: 'DIVE RATING', sub: 'DEEP-SEA READY' },
]

export function StatsBar() {
  return (
    <section className="relative border-y border-white/5 bg-abyss/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-10 md:py-14 ${
              i % 2 === 1 ? 'border-l border-white/5' : ''
            } ${i > 0 ? 'md:border-l md:border-white/5' : ''} ${
              i >= 2 ? 'border-t border-white/5 md:border-t-0' : ''
            }`}
          >
            <div className="font-display text-3xl font-bold text-white md:text-5xl">
              <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-[0.3em] text-crimson">
              {s.label}
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-white/35">
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
