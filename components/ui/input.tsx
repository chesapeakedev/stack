// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import { cn } from "../../lib/utils";

/**
 * Input component for text entry.
 *
 * Supports all standard HTML input types and provides consistent styling
 * with focus states, disabled states, and error states.
 * Forwards ref to the underlying native input.
 *
 * @example
 * ```tsx
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 *
 * // Email input
 * <Input type="email" placeholder="email@example.com" />
 *
 * // Password input
 * <Input type="password" placeholder="Enter password" />
 *
 * // With error state
 * <Input aria-invalid="true" placeholder="Invalid input" />
 *
 * // Disabled input
 * <Input disabled placeholder="Disabled input" />
 *
 * // With label
 * <div>
 *   <Label htmlFor="email">Email</Label>
 *   <Input id="email" type="email" />
 * </div>
 * ```
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
});

export { Input };
