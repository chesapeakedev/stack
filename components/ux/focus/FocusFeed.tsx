// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { ReactNode } from "react";

export interface FocusFeedProps {
  children: ReactNode;
  loading?: boolean;
  empty?: ReactNode;
  className?: string;
  label?: string;
}

/** A narrow, accessible feed surface for mixed todo and event cards. */
export function FocusFeed({
  children,
  loading = false,
  empty,
  className,
  label = "Focus feed",
}: FocusFeedProps) {
  const content = loading ? (
    <div className="text-muted-foreground p-8 text-center" role="status">
      Loading feed...
    </div>
  ) : (
    (empty ?? children)
  );

  return (
    <div
      aria-label={label}
      className={`flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 ${className ?? ""}`}
      role="list"
    >
      {content}
    </div>
  );
}
