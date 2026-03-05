// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { cn } from "../../lib/utils";

interface FireAnimationProps {
  /** Productivity score used to determine fire intensity (0-3: ember, 4-7: small, 8-12: medium, 13+: large) */
  score: number;
  /** Additional CSS classes to apply */
  className?: string;
}

type FireIntensity = "ember" | "small" | "medium" | "large";

/**
 * FireAnimation component displays an animated fire visualization based on a productivity score.
 * The fire intensity scales with the score, providing visual feedback for achievement levels.
 * Uses SVG animations for smooth, performant rendering.
 *
 * Score tiers:
 * - 0-3: Ember (minimal fire, 2 flames)
 * - 4-7: Small Fire (moderate fire, 3 flames)
 * - 8-12: Medium Fire (good fire, 4 flames)
 * - 13+: Large Fire (impressive fire, 5 flames)
 *
 * @example
 * ```tsx
 * import { FireAnimation } from "@shared/components/ux/FireAnimation"
 * import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/components/ui/dialog"
 *
 * // In a completion modal
 * function SessionCompleteModal({ score }: { score: number }) {
 *   return (
 *     <Dialog open={true}>
 *       <DialogContent>
 *         <DialogHeader>
 *           <DialogTitle>Session Complete!</DialogTitle>
 *         </DialogHeader>
 *         <div className="flex flex-col items-center py-4">
 *           <FireAnimation score={score} className="text-orange-500" />
 *           <p className="mt-2 text-sm">Your productivity score: {score}</p>
 *         </div>
 *       </DialogContent>
 *     </Dialog>
 *   )
 * }
 *
 * // Calculate score and display
 * function ProductivityDisplay({ tasksCompleted, tasksCreated, keystrokes }: Props) {
 *   const score = tasksCompleted * 2 + tasksCreated * 1 + Math.floor(keystrokes / 100)
 *
 *   return (
 *     <div className="text-center">
 *       <FireAnimation score={score} className="text-red-500 dark:text-orange-400" />
 *       <p className="mt-2 text-lg font-bold">Score: {score}</p>
 *     </div>
 *   )
 * }
 *
 * // With custom styling
 * function CustomFireDisplay({ score }: { score: number }) {
 *   return (
 *     <div className="bg-gradient-to-b from-transparent to-orange-50 dark:to-orange-950 p-8 rounded-lg">
 *       <FireAnimation
 *         score={score}
 *         className="text-orange-600 dark:text-orange-400"
 *       />
 *     </div>
 *   )
 * }
 * ```
 */
export function FireAnimation({ score, className }: FireAnimationProps) {
  const getIntensity = (score: number): FireIntensity => {
    if (score <= 3) return "ember";
    if (score <= 7) return "small";
    if (score <= 12) return "medium";
    return "large";
  };

  const intensity = getIntensity(score);

  const intensityConfig = {
    ember: {
      flames: 2,
      height: "h-8",
      opacity: "opacity-40",
      scale: "scale-75",
    },
    small: {
      flames: 3,
      height: "h-12",
      opacity: "opacity-60",
      scale: "scale-90",
    },
    medium: {
      flames: 4,
      height: "h-16",
      opacity: "opacity-80",
      scale: "scale-100",
    },
    large: {
      flames: 5,
      height: "h-20",
      opacity: "opacity-100",
      scale: "scale-110",
    },
  };

  const config = intensityConfig[intensity];

  return (
    <div
      className={cn(
        "relative inline-flex items-end justify-center",
        config.height,
        className
      )}
      aria-label={`Fire animation: ${intensity} intensity (score: ${String(score)})`}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn("w-full h-full", config.scale)}
        preserveAspectRatio="xMidYMid meet"
      >
        {Array.from({ length: config.flames }).map((_, i) => {
          const delay = i * 0.15;
          const offset = (i - (config.flames - 1) / 2) * 20;
          const baseHeight = 30 + (i % 2) * 10;
          const baseWidth = 15 + (i % 2) * 5;

          return (
            <g key={i} transform={`translate(${String(50 + offset)}, 80)`}>
              <path
                d={`M 0 0 Q ${String(baseWidth / 2)} -${String(baseHeight * 0.3)} ${String(
                  baseWidth / 2
                )} -${String(baseHeight * 0.6)} T ${String(baseWidth / 2)} -${String(
                  baseHeight
                )} Q ${String(baseWidth / 2)} -${String(baseHeight * 0.9)} ${String(
                  baseWidth / 2
                )} -${String(baseHeight * 0.7)} T 0 0`}
                fill="currentColor"
                className={cn(config.opacity, "animate-fire-flicker")}
                style={{
                  animationDelay: `${String(delay)}s`,
                  transformOrigin: `${String(baseWidth / 2)}px ${String(baseHeight)}px`,
                }}
              >
                <animate
                  attributeName="d"
                  values={`M 0 0 Q ${String(baseWidth / 2)} -${String(baseHeight * 0.3)} ${String(
                    baseWidth / 2
                  )} -${String(baseHeight * 0.6)} T ${String(baseWidth / 2)} -${String(
                    baseHeight
                  )} Q ${String(baseWidth / 2)} -${String(baseHeight * 0.9)} ${String(
                    baseWidth / 2
                  )} -${String(baseHeight * 0.7)} T 0 0;
                          M 0 0 Q ${String(baseWidth / 3)} -${String(baseHeight * 0.35)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.65)} T ${String(baseWidth / 2)} -${String(
                            baseHeight
                          )} Q ${String(baseWidth / 2)} -${String(baseHeight * 0.85)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.75)} T 0 0;
                          M 0 0 Q ${String(baseWidth / 2.5)} -${String(baseHeight * 0.32)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.58)} T ${String(baseWidth / 2)} -${String(
                            baseHeight
                          )} Q ${String(baseWidth / 2)} -${String(baseHeight * 0.92)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.68)} T 0 0;
                          M 0 0 Q ${String(baseWidth / 2)} -${String(baseHeight * 0.3)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.6)} T ${String(baseWidth / 2)} -${String(
                            baseHeight
                          )} Q ${String(baseWidth / 2)} -${String(baseHeight * 0.9)} ${String(
                            baseWidth / 2
                          )} -${String(baseHeight * 0.7)} T 0 0`}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
