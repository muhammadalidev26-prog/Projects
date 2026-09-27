import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArcReactor } from './ui'

const LINES = [
  'CALIBRATING REPULSORS',
  'SYNCING J.A.R.V.I.S. CORE',
  'NANO-FORMING ARMOR PLATING',
  'FLIGHT SYSTEMS ONLINE',
]

export function BootLoader({ onDone }: { onDone: () => void }) {
  const [line, setLine] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setLine((l) => Math.min(l + 1, LINES.length - 1)),
      600
    )
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      onClick={onDone}
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-void"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <ArcReactor size={160} />
      <div className="mt-10 font-display text-sm font-bold tracking-[0.45em] text-white">
        MARK LXXXV
      </div>
      <div className="mt-3 h-4 font-mono text-[10px] tracking-[0.3em] text-arc/80">
        {LINES[line]}
      </div>
      <div className="mt-8 h-[2px] w-56 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-arc to-crimson shadow-[0_0_12px_rgba(95,215,255,0.8)]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
          onAnimationComplete={onDone}
        />
      </div>
      <div className="mt-5 font-mono text-[9px] tracking-[0.35em] text-white/25">
        CLICK TO SKIP
      </div>
    </motion.div>
  )
}
