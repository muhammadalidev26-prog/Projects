import { motion } from 'framer-motion'
import {
  Atom,
  Cpu,
  Crosshair,
  Layers,
  Rocket,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { HudCorners, SectionTag } from './ui'

type Feature = {
  icon: LucideIcon
  title: string
  desc: string
  spec: string
  tone: 'arc' | 'crimson' | 'gold'
}

const FEATURES: Feature[] = [
  {
    icon: Atom,
    title: 'ARC REACTOR',
    desc: 'A palladium-free clean-energy heart. 8.4 gigawatts of raw power contained in a chest-sized core.',
    spec: 'SPEC — CLEAN ENERGY / 8.4 GW',
    tone: 'arc',
  },
  {
    icon: Zap,
    title: 'REPULSORS',
    desc: 'Muon-based directed-energy emitters built into both palms and boot soles. Precision devastation.',
    spec: 'SPEC — MUA BEAMS / 500 kJ',
    tone: 'crimson',
  },
  {
    icon: Cpu,
    title: 'J.A.R.V.I.S. AI',
    desc: 'Natural-language AI copilot managing flight, diagnostics, combat targeting and sarcasm levels.',
    spec: 'SPEC — AI CORE v9.3',
    tone: 'arc',
  },
  {
    icon: Layers,
    title: 'NANOTECH',
    desc: 'Vibranium-laced nanoparticles that form armor, blades and cannons on demand — in seconds.',
    spec: 'SPEC — NANO-PARTICLE ARRAY',
    tone: 'gold',
  },
  {
    icon: Rocket,
    title: 'FLIGHT SYSTEMS',
    desc: 'Gyro-stabilized boot jets rated to Mach 2 with full atmospheric and orbital control.',
    spec: 'SPEC — MACH 2.1 SUSTAINED',
    tone: 'crimson',
  },
  {
    icon: Crosshair,
    title: 'COMBAT HUD',
    desc: '360° threat assessment, life support and targeting overlay projected inside the helmet.',
    spec: 'SPEC — 360° THREAT SCAN',
    tone: 'arc',
  },
]

const TONE_STYLES: Record<
  Feature['tone'],
  { icon: string; border: string; shadow: string; chip: string }
> = {
  arc: {
    icon: 'text-arc',
    border: 'hover:border-arc/50',
    shadow: 'hover:shadow-[0_0_45px_rgba(95,215,255,0.14)]',
    chip: 'bg-arc/10 text-arc border-arc/30',
  },
  crimson: {
    icon: 'text-crimson',
    border: 'hover:border-crimson/50',
    shadow: 'hover:shadow-[0_0_45px_rgba(224,38,49,0.14)]',
    chip: 'bg-crimson/10 text-crimson border-crimson/30',
  },
  gold: {
    icon: 'text-gold',
    border: 'hover:border-gold/50',
    shadow: 'hover:shadow-[0_0_45px_rgba(217,164,40,0.14)]',
    chip: 'bg-gold/10 text-gold border-gold/30',
  },
}

export function TechSection() {
  return (
    <section id="tech" className="bg-grid relative py-28 md:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#04060c_75%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionTag index="01" label="TECHNOLOGY" />
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            WEAPONS-GRADE{' '}
            <span className="bg-gradient-to-r from-arc via-white to-gold bg-clip-text text-transparent">
              BRILLIANCE
            </span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/50">
            Every system engineered from scratch. No government oversight, no
            committee approval — just one genius in a workshop.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const tone = TONE_STYLES[f.tone]
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.7,
                  delay: (i % 3) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative border border-white/8 bg-panel/50 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${tone.border} ${tone.shadow}`}
              >
                <HudCorners className="border-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  className={`grid h-12 w-12 place-items-center border border-white/10 bg-white/[0.03] ${tone.icon} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-wider text-white">
                  {f.title}
                </h3>
                <p className="mt-2.5 min-h-[72px] text-[15px] leading-relaxed text-white/55">
                  {f.desc}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">
                    {f.spec}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rotate-45 border ${tone.chip} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
