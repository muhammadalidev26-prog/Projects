import { useEffect, useRef, useState } from "react";
import { ArmorProvider, useArmor, type Focus, type Highlight } from "./context/ArmorContext";
import { suits } from "./data/suits";
import ArmorScene from "./components/ArmorScene";
import { BootScreen } from "./components/BootScreen";
import { CssReactor } from "./components/CssReactor";
import { cn } from "./utils/cn";

const NAV: { href: string; id: Focus; label: string }[] = [
  { href: "#systems", id: "systems", label: "Systems" },
  { href: "#reactor", id: "reactor", label: "Reactor" },
  { href: "#archive", id: "archive", label: "Archive" },
  { href: "#chronicle", id: "chronicle", label: "Chronicle" },
];

const TICKER = [
  "ARC OUTPUT STABLE",
  "REPULSORS ARMED",
  "HULL INTEGRITY NOMINAL",
  "FLIGHT CEILING CLASSIFIED",
  "NANITE LATTICE LOCKED",
  "JARVIS ONLINE",
  "MALIBU PROVING GROUND",
  "GOLD IS A STRUCTURAL DECISION",
  "DO NOT FILE THIS UNDER TOY",
  "THE SUIT IS PLAN B",
];

const SYSTEMS: {
  title: string;
  kicker: string;
  copy: string;
  stat: string;
  highlight: Highlight;
}[] = [
  {
    kicker: "01  /  PALMS",
    title: "Repulsor arrays",
    copy: "Particle beams seated in the gauntlets. Yield runs from a warning flash to a wall that decides to leave.",
    stat: "Variable yield",
    highlight: "repulsor",
  },
  {
    kicker: "02  /  CHEST",
    title: "Arc reactor",
    copy: "Clean core. The heart of the suit and the reason the night has a cyan pulse.",
    stat: "8.4 GW class",
    highlight: "reactor",
  },
  {
    kicker: "03  /  BOOTS",
    title: "Flight rig",
    copy: "Boot jets, back stabilizers, and a gyroscope that forgives ideas the ground would not.",
    stat: "Hover or burn",
    highlight: "flight",
  },
  {
    kicker: "04  /  SKIN",
    title: "Nano assembly",
    copy: "The frame stores itself and climbs the body on command. Thought in, armor out.",
    stat: "Sub-3s deploy",
    highlight: "frame",
  },
  {
    kicker: "05  /  VISOR",
    title: "Tactical HUD",
    copy: "Target lock, structural stress, altitude, and a voice that never lets a bad angle go uncommented.",
    stat: "Eyes up",
    highlight: "eyes",
  },
  {
    kicker: "06  /  FRAME",
    title: "Exo-servos",
    copy: "Gold joints, red plates, and enough torque to treat a sedan like luggage.",
    stat: "Human scale, barely",
    highlight: "frame",
  },
];

const CHRONICLE = [
  {
    mark: "I",
    title: "Cave fire",
    copy: "A box of scraps, a battery, and a deadline. The first flight was mostly a refusal to stay down.",
  },
  {
    mark: "III",
    title: "Hot-rod sky",
    copy: "Red that reads across a skyline. Gold that catches the sun. The silhouette people still sketch from memory.",
  },
  {
    mark: "XLII",
    title: "It comes to you",
    copy: "Armor that does not wait on a rack. Plates cross a room, find a wrist, and argue with physics on the way.",
  },
  {
    mark: "L",
    title: "Under the skin",
    copy: "Nanites stored where a heart should be loud. Deployment becomes a thought. Retraction, a promise.",
  },
  {
    mark: "LXXXV",
    title: "Last light",
    copy: "Everything the armor was built for, spent without hedging. The suit is a tool. The choice to wear it is the point.",
  },
];

function useSectionFocus() {
  const { setFocus } = useArmor();
  useEffect(() => {
    const ids: Focus[] = ["hero", "systems", "reactor", "archive", "chronicle"];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setFocus(visible.target.id as Focus);
      },
      { threshold: [0.35, 0.55], rootMargin: "-18% 0px -28% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [setFocus]);
}

function useKeys() {
  const { booted, finishBoot, toggleMode, fire, nextSuit, replay } = useArmor();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!booted) {
        if (event.key === "Enter" || event.key === "Escape") finishBoot();
        return;
      }
      if (event.key === "f" || event.key === "F") toggleMode();
      if (event.key === " ") {
        event.preventDefault();
        fire();
      }
      if (event.key === "ArrowRight") nextSuit(1);
      if (event.key === "ArrowLeft") nextSuit(-1);
      if (event.key === "r" || event.key === "R") replay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted, finishBoot, toggleMode, fire, nextSuit, replay]);
}

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
      <path d="M32 10 L40 32 L32 27 L24 32 Z" fill="none" stroke="#ff2d2d" strokeWidth="1.4" />
    </svg>
  );
}

function SiteNav() {
  const { suit, audio, toggleAudio } = useArmor();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        scrolled || open ? "bg-ink/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-8">
        <a href="#hero" className="flex items-center gap-3 text-cream">
          <Mark className="h-9 w-9 text-gold" />
          <span className="leading-none">
            <span className="block font-mono text-[10px] tracking-[0.32em] text-gold">STARK</span>
            <span className="font-display text-2xl tracking-wide">ARMORY</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.22em] text-cream/70 uppercase transition hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            className={cn(
              "hidden border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase md:inline-flex",
              audio ? "border-[var(--reactor)] text-[var(--reactor)]" : "border-white/15 text-cream/70",
            )}
            aria-pressed={audio}
          >
            {audio ? "Reactor hum on" : "Reactor hum"}
          </button>
          <span className="hidden items-center gap-2 border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-cream/80 lg:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--reactor)]" />
            MARK {suit.mark}
          </span>
          <button
            type="button"
            className="border border-white/15 px-3 py-2 font-mono text-[10px] tracking-[0.18em] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-display text-3xl tracking-wide"
            >
              {item.label}
            </a>
          ))}
          <button type="button" className="btn-ghost mt-2 w-full" onClick={toggleAudio}>
            {audio ? "Silence reactor" : "Enable reactor hum"}
          </button>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { suit, mode, toggleMode, fire, replay, booted, power } = useArmor();
  const [alt, setAlt] = useState(mode === "flight" ? 240 : 14);
  const [speed, setSpeed] = useState(mode === "flight" ? 480 : 0);
  useEffect(() => {
    const id = window.setInterval(() => {
      const flying = mode === "flight";
      setAlt((flying ? 220 + power.flight * 4 : 11) + Math.random() * 6);
      setSpeed(flying ? 360 + power.flight * 6 + Math.random() * 18 : Math.random() * 1.4);
    }, 800);
    return () => window.clearInterval(id);
  }, [mode, power.flight]);

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-end md:items-center">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52vh] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden" />
      <div className="relative z-10 w-full px-5 pt-[56vh] pb-24 md:w-[min(640px,46vw)] md:px-10 md:pt-24 md:pb-16">
        <p className={cn("font-mono text-[11px] tracking-[0.34em] text-gold", booted && "rise")}>
          ARMOR DIVISION  ·  FILE TS-1970
        </p>
        <h1 className={cn("mt-3 font-display text-[clamp(4.4rem,9vw,7.6rem)] leading-[0.82] text-cream drop-shadow-[0_10px_28px_rgba(0,0,0,0.75)]", booted && "rise d1")}>
          <span className="block text-[0.32em] tracking-[0.38em] text-gold">I AM</span>
          IRON
          <span className="block bg-gradient-to-b from-white to-gold bg-clip-text text-transparent">MAN</span>
        </h1>
        <p className={cn("mt-5 max-w-md text-lg leading-snug text-cream/80 md:text-xl", booted && "rise d2")}>
          A live suit, not a still. Move the cursor and the armor tracks you. Deploy it, burn the boots, or put a hole in the dark with the chest beam.
        </p>
        <div className={cn("mt-7 flex flex-wrap gap-3", booted && "rise d3")}>
          <button type="button" className="btn-solid" onClick={replay}>
            Deploy armor
          </button>
          <button type="button" className="btn-ghost" onClick={fire}>
            Repulsor test
          </button>
          <button type="button" className="btn-ghost" onClick={toggleMode}>
            {mode === "flight" ? "Return to hover" : "Engage flight"}
          </button>
        </div>
        <dl className={cn("mt-8 grid grid-cols-3 gap-3", booted && "rise d4")}>
          {[
            ["Altitude", `${alt.toFixed(0)} m`],
            ["Velocity", `${speed.toFixed(0)} kph`],
            ["Frame", `MK ${suit.mark}`],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-white/15 pt-2">
              <dt className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{label}</dt>
              <dd className="font-display text-2xl text-cream">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 hidden font-mono text-[10px] tracking-[0.18em] text-cream/45 md:block">
          CURSOR TRACKS  ·  F FLIGHT  ·  SPACE REPULSOR  ·  ARROWS CHANGE FRAME
        </p>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="marquee relative z-10">
      <div className="marquee-track font-mono text-[11px] tracking-[0.28em] text-gold">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-6">
            {item}
            <span className="text-crimson">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Systems() {
  const { setHighlight, doScan } = useArmor();
  return (
    <section id="systems" className="relative z-10 px-5 py-20 md:px-10 md:py-28">
      <div className="md:w-[min(680px,48vw)]">
        <p className="font-mono text-[11px] tracking-[0.32em] text-gold">SYSTEMS  /  06 LIVE</p>
        <h2 className="mt-2 font-display text-6xl leading-none text-cream md:text-7xl">What the metal is for</h2>
        <p className="mt-4 max-w-lg text-lg text-muted">
          Select a system and the suit answers — chest, palms, boots, visor. On a phone, it jumps you back to the live armor.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {SYSTEMS.map((system) => (
            <article
              key={system.title}
              role="button"
              tabIndex={0}
              className="panel group relative cursor-pointer p-4 transition hover:-translate-y-0.5"
              onMouseEnter={() => {
                setHighlight(system.highlight);
                if (system.highlight === "frame") doScan();
              }}
              onMouseLeave={() => setHighlight(null)}
              onClick={() => {
                setHighlight(system.highlight);
                if (system.highlight === "frame") doScan();
                if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setHighlight(system.highlight);
                if (system.highlight === "frame") doScan();
              }}
            >
              <span className="corner tl" />
              <span className="corner br" />
              <p className="font-mono text-[10px] tracking-[0.22em] text-gold">{system.kicker}</p>
              <h3 className="mt-2 font-display text-3xl leading-none">{system.title}</h3>
              <p className="mt-2 text-[15px] leading-snug text-cream/75">{system.copy}</p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-[var(--reactor)] uppercase">{system.stat}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReactorSection() {
  const { suit, power, setPowerKey } = useArmor();
  const tilt = useRef<HTMLDivElement>(null);
  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = tilt.current;
    const bounds = node?.getBoundingClientRect();
    if (!node || !bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    node.style.transform = `rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 16).toFixed(2)}deg)`;
  };
  const gw = (2.4 + power.weapons * 0.048 + power.shields * 0.02 + power.flight * 0.012).toFixed(2);
  const mach = (0.4 + power.flight * 0.022).toFixed(2);

  return (
    <section id="reactor" className="relative z-10 px-5 py-16 md:px-10 md:py-24">
      <div className="panel relative md:w-[min(680px,48vw)] p-5 md:p-7">
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <p className="font-mono text-[11px] tracking-[0.32em] text-gold">ARC  /  POWER BUS</p>
        <h2 className="mt-2 font-display text-6xl leading-[0.86] md:text-7xl">The heart that does not quit</h2>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Split the core between weapons, flight, and shields. The chest light on the suit follows the bus — hotter when the weapons take the share.
        </p>
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[220px_1fr]">
          <div
            className="reactor-stage mx-auto w-52"
            onMouseMove={onMove}
            onMouseLeave={() => {
              if (tilt.current) tilt.current.style.transform = "";
            }}
          >
            <div ref={tilt} className="reactor-tilt">
              <CssReactor color={power.weapons > 55 ? "#ffb15e" : suit.reactor} />
            </div>
          </div>
          <div>
            <div className="mb-4 flex h-3 overflow-hidden rounded-full">
              <div style={{ width: `${power.weapons}%` }} className="bg-[#ff4d3a]" />
              <div style={{ width: `${power.flight}%` }} className="bg-gold" />
              <div style={{ width: `${power.shields}%` }} className="bg-[var(--reactor)]" />
            </div>
            {(
              [
                ["weapons", "Weapons", power.weapons],
                ["flight", "Flight", power.flight],
                ["shields", "Shields", power.shields],
              ] as const
            ).map(([key, label, value]) => (
              <label key={key} className="mb-3 block">
                <span className="mb-1 flex justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                  {label}
                  <span className="text-cream">{value}%</span>
                </span>
                <input
                  type="range"
                  min={8}
                  max={78}
                  value={value}
                  onChange={(event) => setPowerKey(key, Number(event.target.value))}
                  aria-label={`${label} power allocation`}
                />
              </label>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="border border-white/10 p-3">
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted">OUTPUT</p>
                <p className="font-display text-4xl text-[var(--reactor)]">{gw}</p>
                <p className="font-mono text-[10px] text-muted">GW NOMINAL</p>
              </div>
              <div className="border border-white/10 p-3">
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted">CEILING</p>
                <p className="font-display text-4xl text-gold">M {mach}</p>
                <p className="font-mono text-[10px] text-muted">THEORETICAL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Archive() {
  const { suit, setSuitId, replay } = useArmor();
  return (
    <section id="archive" className="relative z-10 px-5 py-16 md:px-10 md:py-24">
      <div className="h-[58vh] md:hidden" />
      <div className="panel relative p-5 md:w-[min(700px,50vw)] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.32em] text-gold">ARCHIVE  /  07 FRAMES</p>
            <h2 className="mt-2 font-display text-6xl leading-none md:text-7xl">Pick a century of bad ideas</h2>
          </div>
          <span className="stamp mt-3">UNOFFICIAL</span>
        </div>
        <p className="mt-3 max-w-xl text-lg text-muted">
          Every card retints the live armor. Cave iron, hot-rod red, stealth matte, nanotech seams, and the heavy frame that makes doorways nervous.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {suits.map((item) => {
            const active = item.id === suit.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSuitId(item.id)}
                className={cn(
                  "border px-3 py-3 text-left transition",
                  active ? "border-gold bg-white/5" : "border-white/10 hover:border-white/30",
                )}
              >
                <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-gold">
                  MARK {item.mark}
                  <span className="flex gap-1">
                    <i className="h-2.5 w-2.5 rounded-full" style={{ background: item.plate }} />
                    <i className="h-2.5 w-2.5 rounded-full" style={{ background: item.trim }} />
                    <i className="h-2.5 w-2.5 rounded-full" style={{ background: item.reactor }} />
                  </span>
                </span>
                <span className="mt-1 block font-display text-3xl leading-none">{item.name}</span>
                <span className="mt-1 block text-sm text-muted">{item.era}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 border border-white/10 p-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--reactor)]">{suit.codename}</p>
          <h3 className="font-display text-4xl leading-none">
            Mark {suit.mark} — {suit.name}
          </h3>
          <p className="mt-2 text-cream/80">{suit.summary}</p>
          <p className="mt-2 font-mono text-xs text-gold">{suit.note}</p>
          <div className="mt-4 grid gap-2">
            {(
              [
                ["Power", suit.ratings.power],
                ["Speed", suit.ratings.speed],
                ["Agility", suit.ratings.agility],
                ["Plating", suit.ratings.plating],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="grid grid-cols-[88px_1fr_36px] items-center gap-2 text-sm">
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{label}</span>
                <span className="bar">
                  <span style={{ width: `${value}%` }} />
                </span>
                <span className="text-right font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-solid mt-5"
            onClick={() => {
              replay();
              if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Deploy this frame
          </button>
        </div>
      </div>
    </section>
  );
}

function Chronicle() {
  return (
    <section id="chronicle" className="relative z-10 px-5 py-16 md:px-10 md:py-28">
      <div className="md:w-[min(640px,46vw)]">
        <p className="font-mono text-[11px] tracking-[0.32em] text-gold">CHRONICLE</p>
        <h2 className="mt-2 font-display text-6xl leading-none md:text-7xl">A line of flight</h2>
        <ol className="mt-8 border-l border-gold/40 pl-6">
          {CHRONICLE.map((entry) => (
            <li key={entry.mark} className="relative mb-8">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border border-gold bg-ink" />
              <p className="font-mono text-[10px] tracking-[0.22em] text-gold">MARK {entry.mark}</p>
              <h3 className="font-display text-4xl leading-none">{entry.title}</h3>
              <p className="mt-1 text-lg text-muted">{entry.copy}</p>
            </li>
          ))}
        </ol>
        <blockquote className="border-l-2 border-crimson pl-4 text-xl text-cream/90">
          “I did not build it to be admired. I built it because the sky was unoccupied.”
          <footer className="mt-2 font-mono text-[10px] tracking-[0.2em] text-gold">FIELD NOTE  ·  T.S.</footer>
        </blockquote>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { replay } = useArmor();
  return (
    <footer className="relative z-10 mt-8 border-t border-white/10 bg-ink/90 px-5 pt-10 pb-28 md:px-10 md:pb-10">
      <div className="flex flex-col gap-6 md:max-w-[680px]">
        <div className="flex items-center gap-3">
          <Mark className="h-10 w-10 text-gold" />
          <div>
            <p className="font-display text-3xl leading-none">Iron Man Armor Archive</p>
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted">POINT DUME PROVING GROUND</p>
          </div>
        </div>
        <p className="max-w-xl text-sm text-muted">
          A fan-made visual experiment. Iron Man, Stark, JARVIS, and related names are trademarks of Marvel. This page is not affiliated with or endorsed by Marvel or Disney.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-solid"
            onClick={() => {
              replay();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Suit up again
          </button>
          <a href="#archive" className="btn-ghost">
            Open archive
          </a>
        </div>
      </div>
    </footer>
  );
}

function SuitRail() {
  const { suit, setSuitId } = useArmor();
  return (
    <div className="pointer-events-none fixed top-24 right-4 z-30 hidden flex-col items-end gap-3 md:flex">
      <div className="text-right">
        <p className="font-mono text-[10px] tracking-[0.28em] text-gold">ACTIVE FRAME</p>
        <p className="font-display text-3xl leading-none">{suit.name}</p>
        <p className="font-mono text-[10px] text-cream/60">MARK {suit.mark}</p>
      </div>
      <div className="pointer-events-auto flex flex-col gap-2">
        {suits.map((item) => (
          <button
            key={item.id}
            type="button"
            title={`Mark ${item.mark} ${item.name}`}
            aria-label={`Select Mark ${item.mark} ${item.name}`}
            onClick={() => setSuitId(item.id)}
            className={cn(
              "h-3.5 w-3.5 rounded-full border",
              item.id === suit.id ? "scale-125 border-white" : "border-white/30",
            )}
            style={{ background: item.plate }}
          />
        ))}
      </div>
    </div>
  );
}

function SuitToast() {
  const { suit } = useArmor();
  const first = useRef(true);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), 1700);
    return () => window.clearTimeout(id);
  }, [suit.id]);
  if (!visible) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-30 flex justify-center">
      <div className="toast">MARK {suit.mark}  ·  {suit.name.toUpperCase()}</div>
    </div>
  );
}

function CursorLock() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let x = window.innerWidth * 0.72;
    let y = window.innerHeight * 0.46;
    let tx = x;
    let ty = y;
    const onMove = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    let frame = 0;
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      node.style.transform = `translate(${x}px, ${y}px)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <div ref={ref} className="cursor-lock pointer-events-none fixed top-0 left-0 z-20 hidden md:block" />;
}

function MobileDock() {
  const { mode, toggleMode, fire, replay } = useArmor();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-white/10 bg-black/75 p-3 backdrop-blur-md md:hidden">
      <button type="button" className="btn-solid flex-1 !px-2 !py-3 !text-xs" onClick={replay}>
        Deploy
      </button>
      <button type="button" className="btn-ghost flex-1 !px-2 !py-3 !text-xs" onClick={fire}>
        Repulsor
      </button>
      <button type="button" className="btn-ghost flex-1 !px-2 !py-3 !text-xs" onClick={toggleMode}>
        {mode === "flight" ? "Hover" : "Flight"}
      </button>
    </div>
  );
}

function Shell() {
  const { suit } = useArmor();
  useSectionFocus();
  useKeys();
  return (
    <div
      className="site relative min-h-screen"
      style={
        {
          "--plate": suit.plate,
          "--trim": suit.trim,
          "--reactor": suit.reactor,
        } as React.CSSProperties
      }
    >
      <p className="sr-only">
        Interactive 3D Iron Man armor. Move the cursor to track the suit, switch frames in the archive, and test flight or repulsors.
      </p>
      <ArmorScene />
      <div className="vignette pointer-events-none fixed inset-0 z-20" />
      <div className="grain pointer-events-none fixed inset-0 z-20" />
      <SiteNav />
      <SuitRail />
      <SuitToast />
      <CursorLock />
      <main className="relative z-10 pb-20 md:pb-0">
        <Hero />
        <Ticker />
        <Systems />
        <ReactorSection />
        <Archive />
        <Chronicle />
      </main>
      <SiteFooter />
      <MobileDock />
      <BootScreen />
    </div>
  );
}

export default function App() {
  return (
    <ArmorProvider>
      <Shell />
    </ArmorProvider>
  );
}
