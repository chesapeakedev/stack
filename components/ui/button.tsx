// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../lib/utils";
import { buttonVariants, type ButtonVariantsProps } from "./buttonVariants.ts";

/**
 * Props for the Button component
 * Extends HTML button props and adds variant/size options from buttonVariants
 */
interface ButtonProps
  extends
    Omit<React.ComponentPropsWithoutRef<"button">, "ref">,
    ButtonVariantsProps {
  /**
   * When true, the button will pass all props to its child element.
   * Useful for rendering buttons as links or other elements.
   * @default false
   */
  asChild?: boolean;
}

/**
 * A versatile button component with multiple variants and sizes.
 *
 * Supports various styles including default, destructive, outline, secondary, ghost, and link.
 * Can be rendered as a different element using the asChild prop.
 *
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 *
 * // Destructive variant
 * <Button variant="destructive">Delete</Button>
 *
 * // Different sizes
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 *
 * // As a link
 * <Button asChild>
 *   <a href="/path">Link Button</a>
 * </Button>
 *
 * // Outline style
 * <Button variant="outline">Outline</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
