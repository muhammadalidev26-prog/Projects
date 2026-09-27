export type Suit = {
  id: string;
  mark: string;
  name: string;
  codename: string;
  era: string;
  plate: string;
  trim: string;
  dark: string;
  reactor: string;
  eye: string;
  roughness: number;
  metalness: number;
  bulk: number;
  seams: boolean;
  eyeGlow: number;
  summary: string;
  note: string;
  ratings: { power: number; speed: number; agility: number; plating: number };
};

export const suits: Suit[] = [
  {
    id: "mark-85",
    mark: "LXXXV",
    name: "Nanotech Endgame",
    codename: "BLEEDING HEART",
    era: "Current frame",
    plate: "#9d1528",
    trim: "#f0c56a",
    dark: "#2a1218",
    reactor: "#7ef0ff",
    eye: "#d9f8ff",
    roughness: 0.34,
    metalness: 0.94,
    bulk: 0.98,
    seams: true,
    eyeGlow: 5.2,
    summary:
      "Stored in a housing over the heart and deployed like a decision. The latest frame thinks in nanites and answers in gold.",
    note: "Signature move: full-body assembly in under three seconds.",
    ratings: { power: 96, speed: 92, agility: 95, plating: 88 },
  },
  {
    id: "mark-3",
    mark: "III",
    name: "Hot Rod",
    codename: "CLASSIC FLIGHT",
    era: "First red & gold",
    plate: "#c1121f",
    trim: "#e4b15a",
    dark: "#3a1216",
    reactor: "#8be9ff",
    eye: "#f2fbff",
    roughness: 0.3,
    metalness: 0.9,
    bulk: 1.04,
    seams: false,
    eyeGlow: 4.4,
    summary:
      "The suit that taught the sky a new color. Broad plates, honest gold, and a flight computer that finally trusted the pilot.",
    note: "Still the silhouette people draw from memory.",
    ratings: { power: 74, speed: 78, agility: 70, plating: 80 },
  },
  {
    id: "mark-42",
    mark: "XLII",
    name: "Prehensile",
    codename: "HOUSE PARTY",
    era: "Autonomous",
    plate: "#e0b45c",
    trim: "#b91c1c",
    dark: "#4a3a22",
    reactor: "#9af4ff",
    eye: "#fff6df",
    roughness: 0.22,
    metalness: 0.94,
    bulk: 1,
    seams: false,
    eyeGlow: 4.6,
    summary:
      "A suit that does not wait in a hangar. It finds the wearer, piece by piece, and locks on before the argument is over.",
    note: "Each plate can travel alone. Most of them have opinions.",
    ratings: { power: 80, speed: 84, agility: 88, plating: 72 },
  },
  {
    id: "mark-1",
    mark: "I",
    name: "Cave Prototype",
    codename: "BOX OF SCRAPS",
    era: "Origin",
    plate: "#8a8178",
    trim: "#b9854a",
    dark: "#3c3832",
    reactor: "#ff8a2a",
    eye: "#ffd2a8",
    roughness: 0.68,
    metalness: 0.62,
    bulk: 1.16,
    seams: false,
    eyeGlow: 2.4,
    summary:
      "Welded under pressure with scrap steel, a car battery, and no interest in dying quietly. Ugly. Loud. Airborne.",
    note: "Roughness is not a bug. It is the biography.",
    ratings: { power: 28, speed: 22, agility: 14, plating: 54 },
  },
  {
    id: "stealth",
    mark: "VII",
    name: "Midnight Protocol",
    codename: "LOW OBSERVABLE",
    era: "Covert",
    plate: "#17191f",
    trim: "#5c6370",
    dark: "#0c0d11",
    reactor: "#6ec8ff",
    eye: "#c5e8ff",
    roughness: 0.78,
    metalness: 0.48,
    bulk: 1.02,
    seams: false,
    eyeGlow: 2.1,
    summary:
      "Matte, quiet, and almost polite — until the reactor admits it was never unarmed. Built for rooms that should not know you entered.",
    note: "Radar cross-section: classified. Footsteps: still a problem.",
    ratings: { power: 70, speed: 76, agility: 82, plating: 64 },
  },
  {
    id: "bleeding",
    mark: "L",
    name: "Bleeding Edge",
    codename: "UNDER THE SKIN",
    era: "Nanite",
    plate: "#6e0f22",
    trim: "#e8c27a",
    dark: "#1a0a10",
    reactor: "#9af6ff",
    eye: "#e7fdff",
    roughness: 0.2,
    metalness: 0.98,
    bulk: 0.96,
    seams: true,
    eyeGlow: 5.6,
    summary:
      "The armor lives closer than a jacket. Panel lines glow because the energy has nowhere else to hide.",
    note: "Deployment is a thought. Retraction is a promise.",
    ratings: { power: 94, speed: 90, agility: 98, plating: 84 },
  },
  {
    id: "veronica",
    mark: "XLIV",
    name: "Veronica Heavy",
    codename: "CODE GREEN",
    era: "Heavy assault",
    plate: "#8f1d24",
    trim: "#d08a3a",
    dark: "#3a2016",
    reactor: "#ffb15e",
    eye: "#ffe1b8",
    roughness: 0.36,
    metalness: 0.86,
    bulk: 1.28,
    seams: false,
    eyeGlow: 3.6,
    summary:
      "When the problem is bigger than a person, build a bigger answer. Same heart. More shoulders. Less patience.",
    note: "Modular add-ons lock to the base frame. The ground notices.",
    ratings: { power: 99, speed: 48, agility: 36, plating: 99 },
  },
];

export function suitById(id: string) {
  return suits.find((s) => s.id === id) ?? suits[0];
}
