import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ChevronDown, Move3d } from 'lucide-react'
import { Scene } from './Scene'
import { HudCorners } from './ui'

/* ------------------------------------------------------------------ */
/*  Live JARVIS-style telemetry                                        */
/* ------------------------------------------------------------------ */
function Telemetry() {
  const [tele, setTele] = useState({ pwr: 98.2, temp: 36.4, thrust: 12, alt: 1240 })

  useEffect(() => {
    const id = setInterval(() => {
      setTele({
        pwr: 96 + Math.random() * 3.8,
        temp: 33 + Math.random() * 6,
        thrust: 6 + Math.random() * 14,
        alt: 1050 + Math.random() * 400,
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  const items = [
    { k: 'PWR OUTPUT', v: `${tele.pwr.toFixed(1)}%`, bar: tele.pwr / 100 },
    { k: 'CORE TEMP', v: `${tele.temp.toFixed(1)}°C`, bar: tele.temp / 60 },
    { k: 'THRUST', v: `${Math.round(tele.thrust)} kN`, bar: tele.thrust / 20 },
    { k: 'ALTITUDE', v: `${Math.round(tele.alt)} FT`, bar: tele.alt / 1600 },
  ]

  return (
    <div className="grid w-full max-w-xl grid-cols-2 gap-x-8 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.k}>
          <div className="font-mono text-[9px] tracking-[0.2em] text-white/40">
            {i.k}
          </div>
          <div className="mt-0.5 font-display text-sm text-arc">{i.v}</div>
          <div className="mt-1.5 h-[3px] w-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-arc-dim to-arc transition-all duration-700"
              style={{ width: `${Math.min(100, i.bar * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Targeting reticle that follows the cursor                          */
/* ------------------------------------------------------------------ */
function Reticle() {
  const x = useMotionValue(-300)
  const y = useMotionValue(-300)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const el = document.getElementById('top')
      if (!el) return
      const r = el.getBoundingClientRect()
      if (e.clientY >= r.top && e.clientY <= r.bottom) {
        x.set(e.clientX - r.left)
        y.set(e.clientY - r.top)
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle
            cx="28"
            cy="28"
            r="20"
            stroke="#5fd7ff"
            strokeOpacity=".5"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle cx="28" cy="28" r="3" fill="#5fd7ff" />
          <path
            d="M28 4v8M28 44v8M4 28h8M44 28h8"
            stroke="#5fd7ff"
            strokeOpacity=".7"
            strokeWidth="1"
          />
        </svg>
        <div className="absolute left-9 top-8 whitespace-nowrap font-mono text-[9px] tracking-[0.25em] text-arc/70">
          TGT-LOCK 98.2%
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Hero entrance variants                                             */
/* ------------------------------------------------------------------ */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export function Hero({ booted }: { booted: boolean }) {
  return (
    <section
      id="top"
      className="scanlines relative h-screen min-h-[700px] overflow-hidden"
    >
      {/* 3D canvas — shifted right on desktop so type sits on the left */}
      <div className="absolute inset-0 md:left-[22%] lg:left-[26%]">
        <Scene />
      </div>

      {/* cinematic overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(4,6,12,0.6)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-void to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void/90 to-transparent" />

      {/* HUD frame */}
      <div className="pointer-events-none absolute inset-4 md:inset-7">
        <HudCorners />
        <div className="absolute left-6 top-6 font-mono text-[10px] leading-relaxed tracking-[0.3em] text-white/50">
          <div className="text-crimson">STARK INDUSTRIES</div>
          <div className="mt-1">MK LXXXV // FLIGHT READY</div>
        </div>
        <div className="absolute right-6 top-6 hidden items-center gap-2.5 font-mono text-[10px] tracking-[0.25em] text-emerald-400/90 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          ALL SYSTEMS NOMINAL
        </div>
        <div className="absolute bottom-5 left-6 hidden font-mono text-[10px] tracking-[0.3em] text-white/35 lg:block">
          SUIT SCHEMATIC — RENDER VIEW 01
        </div>
        <div className="absolute bottom-5 right-6 hidden items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-arc/70 md:flex">
          <Move3d size={12} />
          DRAG TO ROTATE
        </div>
      </div>

      <Reticle />

      {/* content */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 md:justify-center md:pb-0 md:pl-10 lg:pl-16">
        <motion.div
          initial="hidden"
          animate={booted ? 'show' : 'hidden'}
          variants={stagger}
          className="max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.4em] text-arc"
          >
            <span className="inline-block h-[6px] w-[6px] rotate-45 bg-crimson shadow-[0_0_12px_rgba(224,38,49,0.9)]" />
            MARK LXXXV — THE FINAL SUIT
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[17vw] font-black leading-[0.86] tracking-tight sm:text-8xl lg:text-[9.5rem]"
          >
            <span className="block text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]">
              IRON
            </span>
            <span className="block bg-gradient-to-b from-gold-bright via-crimson to-crimson-deep bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(224,38,49,0.4)]">
              MAN
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/60"
          >
            Genius-engineered armor. Nanotech war machine. The suit that saved
            the universe — forged from 85 iterations of brilliance.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#tech"
              className="group relative overflow-hidden border border-crimson/60 bg-crimson/15 px-7 py-3.5 font-mono text-xs tracking-[0.25em] text-white transition-all duration-300 hover:bg-crimson/30 hover:shadow-[0_0_35px_rgba(224,38,49,0.45)]"
            >
              <span className="absolute left-0 top-0 h-full w-[2px] bg-gold" />
              EXPLORE THE SUIT
            </a>
            <a
              href="#legacy"
              className="border border-arc/30 bg-arc/5 px-7 py-3.5 font-mono text-xs tracking-[0.25em] text-arc transition-all duration-300 hover:border-arc/70 hover:bg-arc/10 hover:shadow-[0_0_30px_rgba(95,215,255,0.3)]"
            >
              SUIT SYSTEMS
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="pointer-events-auto mt-10">
            <Telemetry />
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[9px] tracking-[0.45em] text-white/40">
          SCROLL
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce text-arc" />
      </div>
    </section>
  )
}
