import { useEffect, useState } from "react";
import { useArmor } from "../context/ArmorContext";
import { CssReactor } from "./CssReactor";

const LINES = [
  "STARK ARMORY  //  SECURE UPLINK",
  "> biometric lock released",
  "> arc reactor spooling to 98.6%",
  "> nanite lattice synchronized",
  "> repulsors calibrated",
  "> JARVIS: the armor is ready when you are",
];

export function BootScreen() {
  const { booted, finishBoot, suit } = useArmor();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!booted) return;
    const id = window.setTimeout(() => setGone(true), 760);
    return () => window.clearTimeout(id);
  }, [booted]);
  if (gone) return null;
  return (
    <div className={`boot ${booted ? "boot-out" : ""}`} aria-hidden={booted}>
      <div className="boot-grid" />
      <div className="w-full max-w-xl px-6">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-14 w-14">
            <CssReactor color={suit.reactor} />
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.32em] text-gold">ARMOR MATRIX</p>
            <p className="font-display text-4xl leading-none text-cream">INITIALIZING</p>
          </div>
        </div>
        <div className="space-y-2 font-mono text-sm text-cream/80">
          {LINES.map((line, i) => (
            <p key={line} className="boot-line" style={{ animationDelay: `${0.15 + i * 0.28}s` }}>
              {line}
            </p>
          ))}
        </div>
        <div className="mt-8 h-[3px] overflow-hidden bg-white/10">
          <div className="boot-bar h-full bg-gradient-to-r from-crimson via-gold to-[var(--reactor)]" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted">MARK {suit.mark} ON STANDBY</p>
          <button type="button" className="btn-ghost !px-4 !py-2" onClick={finishBoot}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
