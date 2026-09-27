import { motion } from 'framer-motion'
import { ArcReactor, HudCorners, SectionTag } from './ui'

const FACTS = [
  { value: '270', label: 'FUNCTIONAL IQ' },
  { value: '17', label: 'MIT GRADUATE' },
  { value: '85', label: 'SUITS BUILT' },
  { value: '$12.4B', label: 'NET WORTH' },
]

const CORE_SPECS = ['CORE — STABLE', 'OUTPUT — 8.4 GW', 'PALLADIUM — 0%']

export function About() {
  return (
    <section id="legacy" className="bg-grid relative py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,transparent_0%,#04060c_75%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* ---- left: arc reactor panel ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative border border-white/8 bg-panel/40 p-10 backdrop-blur md:p-14">
            <HudCorners />
            <div className="mx-auto max-w-[320px]">
              <ArcReactor size={300} className="w-full" />
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px border border-white/5 bg-white/5">
              {CORE_SPECS.map((s) => (
                <div
                  key={s}
                  className="bg-void px-2 py-3.5 text-center font-mono text-[10px] tracking-[0.18em] text-arc/80"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          {/* floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="absolute -bottom-5 left-8 flex items-center gap-3 border border-arc/30 bg-void px-5 py-3 shadow-[0_0_30px_rgba(95,215,255,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-arc opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-arc" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-arc">
              REACTOR STATUS — ONLINE
            </span>
          </motion.div>
        </motion.div>

        {/* ---- right: text ---- */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2"
        >
          <SectionTag index="03" label="LEGACY" />
          <h2 className="font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            THE MAN
            <br />
            BEHIND THE{' '}
            <span className="bg-gradient-to-r from-gold-bright to-crimson bg-clip-text text-transparent">
              MASK
            </span>
          </h2>

          <p className="mt-7 text-lg leading-relaxed text-white/60">
            Tony Stark — weapons manufacturer, futurist, Avenger. After a
            life-changing captivity in Afghanistan, he miniaturized an arc
            reactor and forged the first Iron Man armor in a cave.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/60">
            Over 85 suits followed, each smarter, faster and more dangerous
            than the last — protecting a world that kept asking who he really
            was. His answer changed history.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-px border border-white/5 bg-white/5 sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="bg-void px-4 py-5 text-center">
                <div className="font-display text-xl font-bold text-gold md:text-2xl">
                  {f.value}
                </div>
                <div className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-white/40">
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          <blockquote className="mt-9 border-l-2 border-crimson pl-5">
            <p className="text-xl italic leading-relaxed text-white/75">
              "Genius, billionaire, playboy, philanthropist."
            </p>
            <cite className="mt-2 block font-mono text-[10px] not-italic tracking-[0.3em] text-white/35">
              — TONY STARK, 2012
            </cite>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}
