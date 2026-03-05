// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../../lib/utils";

/**
 * A visual separator component for dividing content.
 *
 * Can be rendered horizontally or vertically and is decorative by default
 * (hidden from screen readers). Built on Radix UI's Separator primitive.
 *
 * @example
 * ```tsx
 * // Horizontal separator (default)
 * <Separator />
 *
 * // Vertical separator
 * <Separator orientation="vertical" />
 *
 * // With custom styling
 * <Separator className="my-4" />
 *
 * // Non-decorative (accessible to screen readers)
 * <Separator decorative={false} />
 * ```
 */
function Separator({
  className,
  orientation,
  decorative,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
