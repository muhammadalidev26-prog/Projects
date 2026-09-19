import { useState, useCallback, useRef, useEffect } from "react";

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeTaken: number;
  problemKeys: Record<string, number>;
}

export interface TypingState {
  currentIndex: number;
  chars: Array<{ char: string; status: "pending" | "correct" | "error" }>;
  isComplete: boolean;
  isStarted: boolean;
  stats: TypingStats | null;
  startTime: number | null;
  elapsedTime: number;
}

export function useTypingEngine(text: string, tabWidth: number = 2) {
  const expandedText = text.replace(/\t/g, " ".repeat(tabWidth));
  
  const [state, setState] = useState<TypingState>(() => initState(expandedText));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const problemKeysRef = useRef<Record<string, number>>({});

  function initState(t: string): TypingState {
    return {
      currentIndex: 0,
      chars: t.split("").map((char) => ({ char, status: "pending" as const })),
      isComplete: false,
      isStarted: false,
      stats: null,
      startTime: null,
      elapsedTime: 0,
    };
  }

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    problemKeysRef.current = {};
    setState(initState(expandedText));
  }, [expandedText]);

  useEffect(() => {
    reset();
  }, [expandedText, reset]);

  useEffect(() => {
    if (state.isStarted && !state.isComplete) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          elapsedTime: prev.startTime ? (Date.now() - prev.startTime) / 1000 : 0,
        }));
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isStarted, state.isComplete]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.isComplete) return;
      
      if (e.key === "Tab") {
        e.preventDefault();
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Shift" || e.key === "CapsLock" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;

      setState((prev) => {
        if (prev.isComplete) return prev;

        const newChars = [...prev.chars];
        let newIndex = prev.currentIndex;
        let startTime = prev.startTime;
        let isStarted = prev.isStarted;

        if (!isStarted) {
          isStarted = true;
          startTime = Date.now();
        }

        if (e.key === "Backspace") {
          if (newIndex > 0) {
            newIndex--;
            newChars[newIndex] = { ...newChars[newIndex], status: "pending" };
          }
          return { ...prev, currentIndex: newIndex, chars: newChars, isStarted, startTime };
        }

        if (newIndex >= newChars.length) return prev;

        let typedChar = e.key;
        if (e.key === "Tab") {
          // Handle tab: type spaces
          const spacesToType = Math.min(tabWidth, newChars.length - newIndex);
          for (let i = 0; i < spacesToType; i++) {
            if (newIndex + i < newChars.length) {
              const expected = newChars[newIndex + i].char;
              if (expected === " ") {
                newChars[newIndex + i] = { ...newChars[newIndex + i], status: "correct" };
              } else {
                newChars[newIndex + i] = { ...newChars[newIndex + i], status: "error" };
                problemKeysRef.current[expected] = (problemKeysRef.current[expected] || 0) + 1;
              }
            }
          }
          newIndex += spacesToType;
        } else if (e.key === "Enter") {
          typedChar = "\n";
          const expected = newChars[newIndex].char;
          if (expected === typedChar) {
            newChars[newIndex] = { ...newChars[newIndex], status: "correct" };
          } else {
            newChars[newIndex] = { ...newChars[newIndex], status: "error" };
            problemKeysRef.current[expected] = (problemKeysRef.current[expected] || 0) + 1;
          }
          newIndex++;
        } else if (typedChar.length === 1) {
          const expected = newChars[newIndex].char;
          if (typedChar === expected) {
            newChars[newIndex] = { ...newChars[newIndex], status: "correct" };
          } else {
            newChars[newIndex] = { ...newChars[newIndex], status: "error" };
            problemKeysRef.current[expected] = (problemKeysRef.current[expected] || 0) + 1;
          }
          newIndex++;
        }

        const isComplete = newIndex >= newChars.length;
        let stats: TypingStats | null = null;

        if (isComplete && startTime) {
          const timeTaken = (Date.now() - startTime) / 1000;
          const correctChars = newChars.filter((c) => c.status === "correct").length;
          const incorrectChars = newChars.filter((c) => c.status === "error").length;
          const wpm = Math.round((correctChars / 5) / (timeTaken / 60));
          const accuracy = Math.round((correctChars / newChars.length) * 100);
          stats = {
            wpm,
            accuracy,
            correctChars,
            incorrectChars,
            totalChars: newChars.length,
            timeTaken,
            problemKeys: { ...problemKeysRef.current },
          };
        }

        return {
          ...prev,
          currentIndex: newIndex,
          chars: newChars,
          isStarted,
          startTime,
          isComplete,
          stats,
          elapsedTime: startTime ? (Date.now() - startTime) / 1000 : 0,
        };
      });
    },
    [state.isComplete, tabWidth]
  );

  const liveWpm = state.isStarted && state.elapsedTime > 0
    ? Math.round(
        (state.chars.filter((c) => c.status === "correct").length / 5) /
          (state.elapsedTime / 60)
      )
    : 0;

  return { state, handleKeyDown, reset, liveWpm };
}
