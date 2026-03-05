// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";

import { cn } from "../../lib/utils";
import { badgeVariants, type BadgeVariantsProps } from "./badgeVariants.ts";

/**
 * Props for the Badge component
 * Extends HTML div props and adds variant options
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    BadgeVariantsProps {}

/**
 * A small label component for displaying status, categories, or counts.
 *
 * Available variants: default, secondary, destructive, outline
 *
 * @example
 * ```tsx
 * // Default badge
 * <Badge>New</Badge>
 *
 * // Secondary variant
 * <Badge variant="secondary">Draft</Badge>
 *
 * // Destructive variant
 * <Badge variant="destructive">Error</Badge>
 *
 * // Outline variant
 * <Badge variant="outline">Pending</Badge>
 *
 * // With count
 * <Badge>42</Badge>
 * ```
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
