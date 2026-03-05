// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import { cn } from "../../lib/utils";

/**
 * Textarea component for multi-line text input.
 *
 * Provides consistent styling with focus states, disabled states, and error states.
 * Automatically adjusts height based on content when used with appropriate CSS.
 *
 * @example
 * ```tsx
 * // Basic textarea
 * <Textarea placeholder="Enter your message..." />
 *
 * // With rows
 * <Textarea rows={5} placeholder="Longer message..." />
 *
 * // With label
 * <div>
 *   <Label htmlFor="description">Description</Label>
 *   <Textarea id="description" />
 * </div>
 *
 * // Disabled
 * <Textarea disabled placeholder="Disabled textarea" />
 *
 * // With error state
 * <Textarea aria-invalid="true" />
 * ```
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
