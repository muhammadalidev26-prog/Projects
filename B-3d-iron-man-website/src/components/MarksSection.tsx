import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { HudCorners, SectionTag } from './ui'

type Mark = {
  mk: string
  year: string
  name: string
  desc: string
  status: string
  tone: 'red' | 'dim' | 'gold' | 'arc'
}

const MARKS: Mark[] = [
  {
    mk: 'MK I',
    year: '2008',
    name: 'THE CAVE',
    desc: 'Forged in captivity from weapon scraps and a car battery. Heavy, crude — and the beginning of everything.',
    status: 'DESTROYED',
    tone: 'red',
  },
  {
    mk: 'MK III',
    year: '2008',
    name: 'FIRST FLIGHT',
    desc: 'The iconic red-and-gold. J.A.R.V.I.S. integration, flight stabilization and the hot-rod red finish.',
    status: 'RETIRED',
    tone: 'dim',
  },
  {
    mk: 'MK VII',
    year: '2012',
    name: 'AVENGERS ASSEMBLE',
    desc: 'Battle of New York. Flew a nuclear missile through a wormhole and closed the portal from the other side.',
    status: 'DESTROYED',
    tone: 'red',
  },
  {
    mk: 'MK XLII',
    year: '2013',
    name: 'PREHENSILE',
    desc: 'Modular pieces that fly to Tony on command — piloted remotely by gesture and subdermal implants.',
    status: 'DESTROYED',
    tone: 'red',
  },
  {
    mk: 'MK XLIV',
    year: '2015',
    name: 'HULKBUSTER',
    desc: 'The Veronica protocol. An orbital-deployed heavyweight built to go toe-to-toe with a Hulk.',
    status: 'DAMAGED',
    tone: 'gold',
  },
  {
    mk: 'MK L',
    year: '2018',
    name: 'NANOTECH',
    desc: 'Fully nano-particle armor formed from the chest reactor in seconds. Blades, cannons, shields on demand.',
    status: 'DESTROYED',
    tone: 'red',
  },
  {
    mk: 'MK LXXXV',
    year: '2023',
    name: 'ENDGAME',
    desc: 'The final suit. 85 iterations of genius — strong enough to hold the Infinity Stones and save the universe.',
    status: 'LEGENDARY',
    tone: 'arc',
  },
]

const TONE_BADGES: Record<Mark['tone'], string> = {
  red: 'border-crimson/40 bg-crimson/10 text-crimson',
  dim: 'border-white/15 bg-white/5 text-white/45',
  gold: 'border-gold/40 bg-gold/10 text-gold',
  arc: 'border-arc/50 bg-arc/10 text-arc shadow-[0_0_20px_rgba(95,215,255,0.25)]',
}

export function MarksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.55'],
  })

  return (
    <section id="marks" className="relative overflow-hidden py-28 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-crimson/8 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-arc/8 blur-[160px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <SectionTag index="02" label="SUIT EVOLUTION" center />
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            FROM A <span className="text-gold text-glow-gold">BOX OF SCRAPS</span>
            <br />
            TO <span className="text-crimson text-glow-red">LEGEND</span>
          </h2>
        </motion.div>

        <div ref={ref} className="relative">
          {/* timeline spine + progress fill */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/8 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-arc via-crimson to-gold shadow-[0_0_12px_rgba(95,215,255,0.6)] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-10 md:space-y-16">
            {MARKS.map((m, i) => (
              <motion.div
                key={m.mk}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative md:grid md:grid-cols-2 md:gap-16"
              >
                {/* node */}
                <span className="absolute left-4 top-7 z-10 h-3 w-3 -translate-x-1/2 rotate-45 border border-arc bg-void shadow-[0_0_14px_rgba(95,215,255,0.7)] md:left-1/2" />

                <div
                  className={`pl-12 md:pl-0 ${
                    i % 2 === 1 ? 'md:col-start-2' : 'md:col-start-1'
                  }`}
                >
                  <div className="group relative border border-white/8 bg-panel/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-arc/40 hover:shadow-[0_0_45px_rgba(95,215,255,0.1)] md:p-7">
                    <HudCorners className="border-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-3xl font-bold text-white transition-colors duration-300 group-hover:text-arc md:text-4xl">
                        {m.mk}
                      </span>
                      <span className="font-mono text-xs tracking-[0.25em] text-arc">
                        {m.year}
                      </span>
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] tracking-[0.35em] text-gold">
                      {m.name}
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                      {m.desc}
                    </p>
                    <div
                      className={`mt-5 inline-flex items-center gap-2.5 border px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] ${TONE_BADGES[m.tone]}`}
                    >
                      <span className="h-1 w-1 rounded-full bg-current" />
                      STATUS — {m.status}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
