import { motion } from 'framer-motion'
import { ArcReactor, SectionTag } from './ui'

const TITLE = 'I AM IRON MAN'

export function QuoteSection() {
  return (
    <section
      id="quote"
      className="relative overflow-hidden border-t border-white/5 py-32 md:py-44"
    >
      {/* giant faint reactor behind */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]">
        <ArcReactor size={860} />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/10 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionTag index="04" label="THE DECLARATION" center />
        </motion.div>

        <h2 className="text-glow-red font-display text-[13vw] font-black leading-none tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
          {TITLE.split('').map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                delay: i * 0.04,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {l === ' ' ? '\u00A0' : l}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/55 md:text-xl"
        >
          The confession that started it all — and the words he spoke again,
          with the stones in his hand, when the universe needed him most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <span className="h-px w-24 bg-gradient-to-r from-transparent via-crimson to-transparent" />
          <p className="font-mono text-[11px] tracking-[0.45em] text-gold text-glow-gold">
            "AND I... LOVE YOU... 3000."
          </p>
        </motion.div>
      </div>
    </section>
  )
}
