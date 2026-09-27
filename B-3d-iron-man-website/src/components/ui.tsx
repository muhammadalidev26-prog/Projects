import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/* ------------------------------------------------------------------ */
/*  HUD corner brackets                                                */
/* ------------------------------------------------------------------ */
export function HudCorners({ className = '' }: { className?: string }) {
  const base = 'pointer-events-none absolute h-5 w-5 border-arc/50'
  return (
    <>
      <span className={`${base} left-0 top-0 border-l-2 border-t-2 ${className}`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2 ${className}`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2 ${className}`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2 ${className}`} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Section tag —  [ 01 // TECHNOLOGY ]                                */
/* ------------------------------------------------------------------ */
export function SectionTag({
  index,
  label,
  center = false,
}: {
  index: string
  label: string
  center?: boolean
}) {
  return (
    <div
      className={`mb-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-arc ${
        center ? 'justify-center' : ''
      }`}
    >
      <span className="h-1.5 w-1.5 rotate-45 bg-crimson shadow-[0_0_10px_rgba(224,38,49,0.9)]" />
      <span className="whitespace-nowrap">
        [ {index} // {label} ]
      </span>
      {!center && <span className="h-px w-20 bg-gradient-to-r from-arc/60 to-transparent" />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated count-up number                                           */
/* ------------------------------------------------------------------ */
export function CountUp({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1800,
  className = '',
}: {
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      setN(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  const text =
    decimals > 0 ? n.toFixed(decimals) : Math.round(n).toLocaleString('en-US')

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Arc reactor SVG — reused in boot screen, about, footer             */
/* ------------------------------------------------------------------ */
export function ArcReactor({
  size = 120,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="arc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#bff1ff" />
          <stop offset="100%" stopColor="#5fd7ff" stopOpacity="0.08" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#5fd7ff" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#5fd7ff" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 5" />
      <g
        className="animate-spin-slow"
        style={{ transformOrigin: '50px 50px' }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          const x1 = 50 + Math.cos(a) * 33
          const y1 = 50 + Math.sin(a) * 33
          const x2 = 50 + Math.cos(a) * 38
          const y2 = 50 + Math.sin(a) * 38
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#5fd7ff"
              strokeOpacity="0.7"
              strokeWidth="1.4"
            />
          )
        })}
        <circle cx="50" cy="50" r="33" fill="none" stroke="#5fd7ff" strokeOpacity="0.3" strokeWidth="1" />
      </g>
      <circle cx="50" cy="50" r="24" fill="rgba(95,215,255,0.05)" stroke="#5fd7ff" strokeOpacity="0.8" strokeWidth="1.5" />
      <polygon points="50,36 62,57 38,57" fill="none" stroke="#5fd7ff" strokeWidth="1.6" strokeOpacity="0.9" />
      <circle
        cx="50"
        cy="50"
        r="10"
        fill="url(#arc-core)"
        className="animate-pulse-core"
        style={{ transformOrigin: '50px 50px' }}
      />
      <circle cx="50" cy="50" r="3.5" fill="#ffffff" />
    </svg>
  )
}
