// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from "react";
import { Card } from "../../ui/card.tsx";

export interface FocusCardProps {
  children: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
  completed?: boolean;
  className?: string;
}

/** Shared surface and layout for every item in a focus feed. */
export function FocusCard({
  children,
  leading,
  actions,
  completed = false,
  className,
}: FocusCardProps) {
  return (
    <Card
      role="listitem"
      className={`bg-background min-w-0 p-4 transition-shadow hover:shadow-md ${
        completed ? "bg-muted/50 opacity-75" : ""
      } ${className ?? ""}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {leading}
        <div className="min-w-0 flex-1">{children}</div>
        {actions}
      </div>
    </Card>
  );
}
