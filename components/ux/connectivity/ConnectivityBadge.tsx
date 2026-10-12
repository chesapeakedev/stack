import type { KeyboardEvent } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CloudOff,
  Loader2,
} from "lucide-react";

export type ConnectivityTone =
  | "offline"
  | "syncing"
  | "online"
  | "degraded"
  | "conflict";

export interface ConnectivityBadgeProps {
  label: string;
  tone: ConnectivityTone;
  tooltip?: string;
  onAction?: () => void;
  actionLabel?: string;
  locked?: boolean;
  className?: string;
}

export function ConnectivityBadge({
  label,
  tone,
  tooltip,
  onAction,
  actionLabel,
  locked = false,
  className,
}: ConnectivityBadgeProps) {
  const interactive = onAction != null && !locked;
  const title = tooltip ?? label;
  const icon =
    tone === "syncing" ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : tone === "degraded" ? (
      <AlertTriangle className="h-4 w-4" />
    ) : tone === "conflict" ? (
      <AlertCircle className="h-4 w-4" />
    ) : tone === "online" ? (
      <Check className="h-4 w-4" />
    ) : (
      <CloudOff className="h-4 w-4" />
    );

  return (
    <div
      role={interactive ? "button" : "status"}
      tabIndex={interactive ? 0 : undefined}
      aria-label={actionLabel ?? label}
      aria-live="polite"
      title={title}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium ${tone === "online" ? "border-primary/60 text-primary bg-primary/5" : tone === "degraded" || tone === "conflict" ? "border-destructive/50 text-destructive bg-destructive/5" : "border-muted-foreground/40 text-muted-foreground bg-muted/40"} ${interactive ? "cursor-pointer" : ""} ${className ?? ""}`}
      onClick={interactive ? onAction : undefined}
      onKeyDown={
        interactive
          ? (event: KeyboardEvent) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onAction();
              }
            }
          : undefined
      }
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}
