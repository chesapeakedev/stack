// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "../../lib/utils";

/**
 * Label component for form elements.
 *
 * Built on top of Radix UI's Label primitive for accessibility.
 * Provides proper association with form controls and disabled state handling.
 *
 * @example
 * ```tsx
 * // Basic label
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" type="email" />
 *
 * // With required indicator
 * <Label htmlFor="name">
 *   Name <span className="text-red-500">*</span>
 * </Label>
 *
 * // Associated with disabled input
 * <Label htmlFor="disabled">Disabled Field</Label>
 * <Input id="disabled" disabled />
 * ```
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
