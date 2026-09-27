import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { suitById, suits, type Suit } from "../data/suits";
import { playWhoosh, ReactorHum } from "../lib/audio";

export type Focus = "hero" | "systems" | "reactor" | "archive" | "chronicle";
export type Mode = "hover" | "flight";
export type Highlight = "reactor" | "repulsor" | "flight" | "eyes" | "frame" | null;
export type Power = { weapons: number; flight: number; shields: number };

type Ctx = {
  suit: Suit;
  setSuitId: (id: string) => void;
  nextSuit: (dir: 1 | -1) => void;
  focus: Focus;
  setFocus: (f: Focus) => void;
  mode: Mode;
  toggleMode: () => void;
  blast: number;
  fire: () => void;
  assembleAt: number | null;
  replay: () => void;
  scan: number;
  doScan: () => void;
  audio: boolean;
  toggleAudio: () => void;
  power: Power;
  setPowerKey: (key: keyof Power, value: number) => void;
  booted: boolean;
  finishBoot: () => void;
  highlight: Highlight;
  setHighlight: (h: Highlight) => void;
};

const ArmorContext = createContext<Ctx | null>(null);

export function useArmor() {
  const value = useContext(ArmorContext);
  if (!value) throw new Error("useArmor must be used within ArmorProvider");
  return value;
}

export function ArmorProvider({ children }: { children: ReactNode }) {
  const [suitId, setSuitIdState] = useState(suits[0].id);
  const [focus, setFocusState] = useState<Focus>("hero");
  const [mode, setMode] = useState<Mode>("hover");
  const [blast, setBlast] = useState(0);
  const [assembleAt, setAssembleAt] = useState<number | null>(null);
  const [scan, setScan] = useState(0);
  const [audio, setAudio] = useState(false);
  const [booted, setBooted] = useState(false);
  const [highlight, setHighlight] = useState<Highlight>(null);
  const [power, setPower] = useState<Power>({ weapons: 38, flight: 34, shields: 28 });
  const bootedRef = useRef(false);

  const finishBoot = useCallback(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    setBooted(true);
    setAssembleAt(performance.now());
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setTimeout(() => finishBoot(), reduce ? 280 : 2600);
    return () => window.clearTimeout(id);
  }, [finishBoot]);

  const setSuitId = useCallback((id: string) => {
    setSuitIdState(id);
    setScan(performance.now());
  }, []);

  const nextSuit = useCallback((dir: 1 | -1) => {
    setSuitIdState((current) => {
      const index = suits.findIndex((s) => s.id === current);
      const next = (index + dir + suits.length) % suits.length;
      return suits[next].id;
    });
    setScan(performance.now());
  }, []);

  const setFocus = useCallback((f: Focus) => {
    setFocusState((prev) => (prev === f ? prev : f));
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "hover" ? "flight" : "hover"));
  }, []);

  const fire = useCallback(() => {
    setBlast(performance.now());
    playWhoosh();
  }, []);

  const replay = useCallback(() => {
    setAssembleAt(performance.now());
    setScan(performance.now());
  }, []);

  const doScan = useCallback(() => setScan(performance.now()), []);
  const toggleAudio = useCallback(() => setAudio((v) => !v), []);

  const setPowerKey = useCallback((key: keyof Power, value: number) => {
    setPower((prev) => {
      const nextValue = Math.max(8, Math.min(78, Math.round(value)));
      const others = (Object.keys(prev) as (keyof Power)[]).filter((k) => k !== key);
      const remain = 100 - nextValue;
      const sumOthers = others.reduce((sum, k) => sum + prev[k], 0) || 1;
      const next: Power = { ...prev, [key]: nextValue };
      others.forEach((k) => {
        next[k] = Math.round((prev[k] / sumOthers) * remain);
      });
      const drift = 100 - (next.weapons + next.flight + next.shields);
      next[others[0]] += drift;
      return next;
    });
  }, []);

  const suit = suitById(suitId);

  const value = useMemo<Ctx>(
    () => ({
      suit,
      setSuitId,
      nextSuit,
      focus,
      setFocus,
      mode,
      toggleMode,
      blast,
      fire,
      assembleAt,
      replay,
      scan,
      doScan,
      audio,
      toggleAudio,
      power,
      setPowerKey,
      booted,
      finishBoot,
      highlight,
      setHighlight,
    }),
    [
      suit,
      setSuitId,
      nextSuit,
      focus,
      setFocus,
      mode,
      toggleMode,
      blast,
      fire,
      assembleAt,
      replay,
      scan,
      doScan,
      audio,
      toggleAudio,
      power,
      setPowerKey,
      booted,
      finishBoot,
      highlight,
    ],
  );

  return (
    <ArmorContext.Provider value={value}>
      <ReactorHum active={audio} />
      {children}
    </ArmorContext.Provider>
  );
}
