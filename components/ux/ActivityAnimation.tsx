// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { cn } from "../../lib/utils";

interface ActivityAnimationProps {
  /** Animation type: "pulse" for pulsing/spinner style, "particles" for particle motion */
  type?: "pulse" | "particles";
  /** Additional CSS classes to apply */
  className?: string;
  /** Size of the animation indicator */
  size?: "sm" | "md" | "lg";
}

/**
 * ActivityAnimation component displays animated activity indicators.
 * Supports two animation types: pulse (spinner-style) and particles (motion-based).
 * Useful for indicating active states, loading, or ongoing processes.
 *
 * @example
 * ```tsx
 * import { ActivityAnimation } from "@shared/components/ux/ActivityAnimation"
 * import { Button } from "@shared/components/ui/button"
 *
 * // Pulse animation (default)
 * function LoadingButton() {
 *   return (
 *     <Button disabled>
 *       <ActivityAnimation type="pulse" size="sm" className="mr-2" />
 *       Processing...
 *     </Button>
 *   )
 * }
 *
 * // Particles animation
 * function ActiveIndicator() {
 *   return (
 *     <div className="flex items-center gap-2">
 *       <ActivityAnimation type="particles" size="md" />
 *       <span>Active session</span>
 *     </div>
 *   )
 * }
 *
 * // Inline with text
 * function TimerButton({ isRunning }: { isRunning: boolean }) {
 *   return (
 *     <Button variant={isRunning ? "destructive" : "default"}>
 *       {isRunning && (
 *         <ActivityAnimation type="pulse" size="sm" className="mr-1" />
 *       )}
 *       {isRunning ? "25:00" : "Start Timer"}
 *     </Button>
 *   )
 * }
 * ```
 */
export function ActivityAnimation({
  type,
  className,
  size,
}: ActivityAnimationProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (type === "pulse") {
    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        aria-label="Activity indicator"
      >
        <div
          className={cn(
            "rounded-full bg-current opacity-75",
            sizeClasses[size ?? "md"],
            "animate-pulse"
          )}
        />
        <div
          className={cn(
            "absolute rounded-full bg-current opacity-40",
            sizeClasses[size ?? "md"],
            "animate-ping"
          )}
        />
      </div>
    );
  }

  // Particles animation
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      aria-label="Activity indicator"
      style={{
        width: size === "sm" ? "12px" : size === "md" ? "16px" : "20px",
      }}
    >
      {[0, 1, 2].map((i) => {
        const offset = size === "sm" ? "-4px" : size === "md" ? "-6px" : "-8px";
        const rotation = i * 120;
        return (
          <div
            key={i}
            className={cn(
              "absolute rounded-full bg-current opacity-60",
              size === "sm"
                ? "w-1 h-1"
                : size === "md"
                  ? "w-1.5 h-1.5"
                  : "w-2 h-2"
            )}
            style={{
              animation: `particle-float-opacity 2s ease-in-out infinite`,
              animationDelay: `${String(i * 0.3)}s`,
              transform: `rotate(${String(rotation)}deg) translateY(${offset})`,
              transformOrigin: "center",
            }}
            data-particle-index={i}
            data-rotation={rotation}
          />
        );
      })}
    </div>
  );
}
