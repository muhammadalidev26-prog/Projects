import { languages } from "@/data/snippets";

export type Mode = "lessons" | "special" | "test" | "upload";

interface AppSidebarProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  progress: Record<string, number>;
}

export function AppSidebar({
  mode,
  setMode,
  selectedLang,
  setSelectedLang,
  isOpen,
  onToggle,
  progress,
}: AppSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-sidebar border-r border-sidebar-border transition-transform duration-300 w-64 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {isOpen ? (
            <h1 className="text-lg font-bold text-sidebar-primary font-mono tracking-tight">
              &lt;KeyCode/&gt;
            </h1>
          ) : (
            <span className="hidden lg:block text-sidebar-primary font-bold font-mono text-lg mx-auto">
              KC
            </span>
          )}
          <button
            onClick={onToggle}
            className="text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Mode selector */}
        <nav className="p-2 space-y-1">
          {([
            { key: "lessons" as const, icon: "📖", label: "Lessons" },
            { key: "special" as const, icon: "⌨️", label: "Special Chars" },
            { key: "test" as const, icon: "⏱️", label: "Typing Test" },
            { key: "upload" as const, icon: "📁", label: "File Upload" },
          ]).map((item) => (
            <button
              key={item.key}
              onClick={() => setMode(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                mode === item.key
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <span>{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Language list (only in lessons mode) */}
        {mode === "lessons" && isOpen && (
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
              Languages
            </p>
            {languages.map((lang) => {
              const pct = progress[lang.id] || 0;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedLang === lang.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {pct > 0 && (
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
}
