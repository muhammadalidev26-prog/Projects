import type { TypingStats } from "@/hooks/useTypingEngine";

interface ResultsScreenProps {
  stats: TypingStats;
  onRetry: () => void;
  onNext?: () => void;
  lessonTitle?: string;
}

export function ResultsScreen({ stats, onRetry, onNext, lessonTitle }: ResultsScreenProps) {
  const sortedProblems = Object.entries(stats.problemKeys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 95) return "text-typing-correct";
    if (acc >= 85) return "text-typing-cursor";
    return "text-typing-error";
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {lessonTitle && (
        <p className="text-sm text-muted-foreground">Results for: {lessonTitle}</p>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="WPM" value={stats.wpm} large className="col-span-2 md:col-span-1" />
        <StatCard
          label="Accuracy"
          value={`${stats.accuracy}%`}
          className={getAccuracyColor(stats.accuracy)}
        />
        <StatCard label="Characters" value={`${stats.correctChars}/${stats.totalChars}`} />
        <StatCard label="Time" value={`${stats.timeTaken.toFixed(1)}s`} />
      </div>

      {sortedProblems.length > 0 && (
        <div className="bg-card rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Problem Keys</h3>
          <div className="flex flex-wrap gap-2">
            {sortedProblems.map(([key, count]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-destructive/10 text-typing-error text-sm font-mono"
              >
                <span className="font-bold">{key === " " ? "␣" : key}</span>
                <span className="text-xs text-muted-foreground">×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium"
        >
          Retry
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Next Lesson →
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  large,
  className = "",
}: {
  label: string;
  value: string | number;
  large?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-card rounded-lg p-4 ${className}`}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p
        className={`font-mono font-bold animate-count-up ${
          large ? "text-4xl text-primary" : "text-2xl text-card-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
