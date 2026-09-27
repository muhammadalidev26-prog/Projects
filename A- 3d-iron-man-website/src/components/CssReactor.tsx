import { cn } from "../utils/cn";

export function CssReactor({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn("reactor", className)}
      style={{ "--reactor": color } as React.CSSProperties}
      aria-hidden
    >
      <i />
      <i />
      <i />
      <span className="tri" />
      <span className="core" />
    </div>
  );
}
