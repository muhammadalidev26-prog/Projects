import { useState, useRef, useEffect } from "react";
import { languages } from "@/data/snippets";

interface LanguageSelectorProps {
  selectedLang: string;
  onSelect: (langId: string) => void;
}

export function LanguageSelector({ selectedLang, onSelect }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = languages.find((l) => l.id === selectedLang) || languages[0];

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono bg-secondary hover:bg-muted transition-colors border border-border"
      >
        <span>{lang.icon}</span>
        <span className="hidden sm:inline">{lang.name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-slide-up">
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full px-2.5 py-1.5 text-sm bg-secondary rounded-md border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">No languages found</p>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    onSelect(l.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                    l.id === selectedLang
                      ? "bg-accent text-accent-foreground"
                      : "text-popover-foreground hover:bg-accent/50"
                  }`}
                >
                  <span>{l.icon}</span>
                  <span>{l.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
