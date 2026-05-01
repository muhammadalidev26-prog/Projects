import { useEffect, useRef } from "react";
import type { TypingState } from "@/hooks/useTypingEngine";

interface TypingDisplayProps {
  state: TypingState;
  liveWpm: number;
  showWpm: boolean;
}

export function TypingDisplay({ state, liveWpm, showWpm }: TypingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const container = containerRef.current;
      const cursor = cursorRef.current;
      const containerRect = container.getBoundingClientRect();
      const cursorRect = cursor.getBoundingClientRect();
      
      const cursorRelativeTop = cursorRect.top - containerRect.top;
      const visibleHeight = container.clientHeight;
      
      if (cursorRelativeTop > visibleHeight - 60) {
        container.scrollTop += cursorRelativeTop - visibleHeight + 100;
      }
    }
  }, [state.currentIndex]);

  // Split into lines for rendering
  const lines: Array<Array<{ char: string; status: string; index: number }>> = [];
  let currentLine: Array<{ char: string; status: string; index: number }> = [];

  state.chars.forEach((c, i) => {
    if (c.char === "\n") {
      currentLine.push({ char: "↵", status: c.status, index: i });
      lines.push(currentLine);
      currentLine = [];
    } else {
      currentLine.push({ char: c.char, status: c.status, index: i });
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  return (
    <div className="relative">
      {showWpm && state.isStarted && !state.isComplete && (
        <div className="absolute -top-8 right-0 text-sm font-mono text-muted-foreground">
          {liveWpm} <span className="text-xs">WPM</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="bg-secondary/50 rounded-lg p-6 font-mono text-lg leading-relaxed min-h-[300px] max-h-[520px] overflow-y-auto focus:outline-none select-none"
        tabIndex={0}
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
      >
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="typing-line">
            {line.map((c) => {
              const isCursor = c.index === state.currentIndex;
              let className = "typing-char-pending";
              if (c.status === "correct") className = "typing-char-correct";
              else if (c.status === "error") className = "typing-char-error";

              return (
                <span
                  key={c.index}
                  ref={isCursor ? cursorRef : undefined}
                  className={`${className} ${isCursor ? "typing-char-current" : ""}`}
                >
                  {c.char === " " ? "\u00A0" : c.char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {!state.isStarted && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-muted-foreground animate-pulse text-sm bg-background/80 px-3 py-1 rounded-full backdrop-blur-sm">
            Start typing to begin...
          </p>
        </div>
      )}
    </div>
  );
}
