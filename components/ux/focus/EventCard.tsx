// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from "react";
import { FocusCard } from "./FocusCard.tsx";

export interface EventCardProps {
  title: string;
  time: ReactNode;
  location?: ReactNode;
  metadata?: ReactNode;
  actions?: ReactNode;
  allDay?: boolean;
  className?: string;
}

/** Read-only calendar event presentation; consumers own calendar mutations. */
export function EventCard({
  title,
  time,
  location,
  metadata,
  actions,
  allDay = false,
  className,
}: EventCardProps) {
  return (
    <FocusCard
      className={className}
      leading={
        <div
          aria-hidden="true"
          className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-primary/60"
        />
      }
      actions={actions}
    >
      <div className="space-y-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">
          {allDay ? "All day" : time}
        </div>
        {location}
        {metadata}
      </div>
    </FocusCard>
  );
}
