import { useEffect } from "react";

export function playWhoosh() {
  try {
    const ctx = new AudioContext();
    const dur = 0.46;
    const length = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const env = Math.pow(1 - i / length, 1.5);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + dur);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.045, ctx.currentTime);
    og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.connect(og);
    og.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
    window.setTimeout(() => void ctx.close(), 800);
  } catch {
    /* audio is optional */
  }
}

export function ReactorHum({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    let ctx: AudioContext;
    try {
      ctx = new AudioContext();
    } catch {
      return;
    }
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 48;
    osc2.type = "triangle";
    osc2.frequency.value = 96;
    osc2.detune.value = 7;
    filter.type = "lowpass";
    filter.frequency.value = 260;
    gain.gain.value = 0.028;
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc2.start();
    return () => {
      osc.stop();
      osc2.stop();
      void ctx.close();
    };
  }, [active]);
  return null;
}
