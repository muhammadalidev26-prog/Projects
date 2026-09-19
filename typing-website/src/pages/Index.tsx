import { useState, useEffect, useCallback, useRef } from "react";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { TypingDisplay } from "@/components/TypingDisplay";
import { ResultsScreen } from "@/components/ResultsScreen";
import { AppSidebar, type Mode } from "@/components/AppSidebar";
import { LanguageSelector } from "@/components/LanguageSelector";
import { languages, specialCharSnippets, getTestSnippet } from "@/data/snippets";

function getProgress(): Record<string, Record<string, boolean>> {
  try {
    return JSON.parse(localStorage.getItem("keycode-progress") || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, Record<string, boolean>>) {
  localStorage.setItem("keycode-progress", JSON.stringify(progress));
}

function computeLangProgress(progress: Record<string, Record<string, boolean>>): Record<string, number> {
  const result: Record<string, number> = {};
  languages.forEach((lang) => {
    const completed = Object.keys(progress[lang.id] || {}).length;
    result[lang.id] = Math.round((completed / lang.snippets.length) * 100);
  });
  return result;
}

export default function Index() {
  const [mode, setMode] = useState<Mode>("lessons");
  const [selectedLang, setSelectedLang] = useState("python");
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [specialIdx, setSpecialIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [testDuration, setTestDuration] = useState(30);
  const [testVariant, setTestVariant] = useState<"code" | "symbols">("code");
  const [testText, setTestText] = useState(() => getTestSnippet("code"));
  const [testTimeLeft, setTestTimeLeft] = useState<number | null>(null);
  const [uploadText, setUploadText] = useState<string | null>(null);
  const [showWpm, setShowWpm] = useState(true);
  const [progress, setProgress] = useState(getProgress);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lang = languages.find((l) => l.id === selectedLang) || languages[0];

  const getText = useCallback(() => {
    if (mode === "lessons") return lang.snippets[snippetIdx]?.code || "";
    if (mode === "special") return specialCharSnippets[specialIdx]?.code || "";
    if (mode === "test") return testText;
    if (mode === "upload") return uploadText || "";
    return "";
  }, [mode, lang, snippetIdx, specialIdx, testText, uploadText]);

  const text = getText();
  const { state, handleKeyDown, reset, liveWpm } = useTypingEngine(text);

  // Global key listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Test timer
  useEffect(() => {
    if (mode === "test" && state.isStarted && !state.isComplete) {
      setTestTimeLeft(testDuration);
      timerRef.current = setInterval(() => {
        setTestTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            // Force complete
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [mode, state.isStarted, state.isComplete, testDuration]);

  // Save progress on lesson complete
  useEffect(() => {
    if (state.isComplete && mode === "lessons") {
      const snippet = lang.snippets[snippetIdx];
      if (snippet) {
        const newProgress = { ...progress };
        if (!newProgress[lang.id]) newProgress[lang.id] = {};
        newProgress[lang.id][snippet.id] = true;
        setProgress(newProgress);
        saveProgress(newProgress);
      }
    }
  }, [state.isComplete, mode]);

  const handleNext = () => {
    if (mode === "lessons") {
      const nextIdx = (snippetIdx + 1) % lang.snippets.length;
      setSnippetIdx(nextIdx);
    } else if (mode === "special") {
      const nextIdx = (specialIdx + 1) % specialCharSnippets.length;
      setSpecialIdx(nextIdx);
    } else if (mode === "test") {
      setTestText(getTestSnippet(testVariant));
      setTestTimeLeft(null);
    }
  };

  const handleRetry = () => {
    if (mode === "test") setTestTimeLeft(null);
    reset();
  };

  const startNewTest = () => {
    setTestText(getTestSnippet(testVariant));
    setTestTimeLeft(null);
    reset();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = (ev.target?.result as string)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim()
        .slice(0, 2000);
      setUploadText(content);
    };
    reader.readAsText(file);
  };

  const langProgress = computeLangProgress(progress);
  const currentTitle =
    mode === "lessons"
      ? lang.snippets[snippetIdx]?.title
      : mode === "special"
      ? specialCharSnippets[specialIdx]?.title
      : mode === "test"
      ? "Typing Test"
      : "Custom File";

  // Reset snippet index when changing language
  useEffect(() => {
    setSnippetIdx(0);
  }, [selectedLang]);

  return (
    <div className="min-h-screen flex">
      <AppSidebar
        mode={mode}
        setMode={(m) => {
          setMode(m);
          if (m === "test") startNewTest();
        }}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        progress={langProgress}
      />

      <main className="flex-1 lg:ml-16 min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center px-4 gap-4 sticky top-0 bg-background/95 backdrop-blur-sm z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="text-sm font-mono text-muted-foreground">
            {mode === "lessons" && <LanguageSelector selectedLang={selectedLang} onSelect={setSelectedLang} />}
            {mode === "special" && "⌨️ Special Characters"}
            {mode === "test" && "⏱️ Typing Test"}
            {mode === "upload" && "📁 Custom File"}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {currentTitle}
          </span>
          <button
            onClick={() => setShowWpm(!showWpm)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showWpm ? "Hide WPM" : "Show WPM"}
          </button>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Test controls */}
          {mode === "test" && !state.isStarted && (
            <div className="flex flex-wrap gap-3 items-center animate-slide-up">
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {[15, 30, 60, 120].map((d) => (
                  <button
                    key={d}
                    onClick={() => setTestDuration(d)}
                    className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
                      testDuration === d
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
              <div className="flex gap-1 bg-secondary rounded-lg p-1">
                {(["code", "symbols"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setTestVariant(v);
                      setTestText(getTestSnippet(v));
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-mono capitalize transition-colors ${
                      testVariant === v
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer display for test mode */}
          {mode === "test" && testTimeLeft !== null && testTimeLeft > 0 && (
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-primary">
                {testTimeLeft}s
              </span>
            </div>
          )}

          {/* Upload controls */}
          {mode === "upload" && !uploadText && (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center animate-slide-up">
              <p className="text-muted-foreground mb-4">
                Upload a file to practice typing your own code
              </p>
              <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors font-medium">
                Choose File
                <input
                  type="file"
                  accept=".txt,.js,.py,.ts,.rs,.go,.jsx,.tsx,.css,.html,.json,.yaml,.yml,.sh"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Snippet navigation for lessons */}
          {mode === "lessons" && !state.isComplete && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {lang.snippets.map((s, i) => {
                const done = progress[lang.id]?.[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => setSnippetIdx(i)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                      i === snippetIdx
                        ? "bg-primary text-primary-foreground"
                        : done
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-secondary-foreground hover:bg-muted"
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Special chars navigation */}
          {mode === "special" && !state.isComplete && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {specialCharSnippets.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSpecialIdx(i)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                    i === specialIdx
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {/* Typing area or results */}
          {text && !state.isComplete ? (
            <TypingDisplay state={state} liveWpm={liveWpm} showWpm={showWpm} />
          ) : state.isComplete && state.stats ? (
            <ResultsScreen
              stats={state.stats}
              onRetry={handleRetry}
              onNext={mode !== "upload" ? handleNext : undefined}
              lessonTitle={currentTitle}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
