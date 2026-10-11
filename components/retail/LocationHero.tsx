// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { Button } from "../ui/button.tsx";
import { cn } from "../../lib/utils.ts";

/**
 * Props for {@link LocationHero}.
 */
export interface LocationHeroProps {
  /** Local page headline. */
  headline: string;
  /** Neighborhood or district shown above the headline. */
  neighborhood?: string;
  /** Primary commerce action label, such as "Order pickup". */
  primaryLabel: string;
  /** Called when the primary commerce button is clicked. */
  onPrimaryClick: () => void;
  /** Secondary action label, such as "Directions". */
  secondaryLabel: string;
  /** Called when the directions button is clicked. */
  onSecondaryClick: () => void;
  className?: string;
}

/**
 * Location headline with a primary commerce action and a directions action.
 *
 * @example
 * ```tsx
 * <LocationHero
 *   neighborhood="Canton"
 *   headline="Welcome to The Forest Baltimore"
 *   primaryLabel="Order pickup"
 *   onPrimaryClick={() => {}}
 *   secondaryLabel="Directions"
 *   onSecondaryClick={() => {}}
 * />
 * ```
 */
export function LocationHero({
  headline,
  neighborhood,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  className,
}: LocationHeroProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {neighborhood ? (
        <p className="text-sm text-muted-foreground">{neighborhood}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onPrimaryClick}>{primaryLabel}</Button>
        <Button variant="outline" onClick={onSecondaryClick}>
          {secondaryLabel}
        </Button>
      </div>
    </section>
  );
}
