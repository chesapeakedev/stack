// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { WeeklyHours } from "../../types/retail-location.ts";
import { Badge } from "../ui/badge.tsx";
import { cn } from "../../lib/utils.ts";
import { hoursForDay, isOpenAt } from "./hours.ts";

/**
 * Props for {@link HoursStatusStrip}.
 */
export interface HoursStatusStripProps {
  /** Weekly hours. A `null` day is closed. */
  hours: WeeklyHours;
  /**
   * Instant used to decide open/closed and which day's range to show.
   * Defaults to the current local time.
   */
  now?: Date;
  /** Pre-order cutoff label, already formatted (for example `21:00`). */
  preOrderCutoff?: string;
  className?: string;
}

/**
 * Open/closed badge, today's hours, and an optional pre-order cutoff.
 *
 * @example
 * ```tsx
 * <HoursStatusStrip
 *   hours={location.hours}
 *   preOrderCutoff={location.status?.preOrderCutoff}
 * />
 * ```
 */
export function HoursStatusStrip({
  hours,
  now = new Date(),
  preOrderCutoff,
  className,
}: HoursStatusStripProps) {
  const open = isOpenAt(hours, now);
  const today = hoursForDay(hours, now);
  const range = today ? `${today.open}–${today.close}` : "Closed today";

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-sm", className)}>
      <Badge variant={open ? "default" : "secondary"}>
        {open ? "Open" : "Closed"}
      </Badge>
      <span>{range}</span>
      {preOrderCutoff ? <span>Order by {preOrderCutoff}</span> : null}
    </div>
  );
}
