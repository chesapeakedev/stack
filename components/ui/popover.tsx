// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../lib/utils";

/**
 * Root component for the Popover.
 * Manages the open/closed state of the popover.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Open Popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <p>Popover content goes here</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Trigger element that opens/closes the popover when clicked.
 * Can be rendered as a child component using the asChild prop.
 *
 * @example
 * ```tsx
 * <PopoverTrigger asChild>
 *   <Button>Open</Button>
 * </PopoverTrigger>
 * ```
 */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Content container for the popover.
 * Displays when the popover is open, positioned relative to the trigger.
 *
 * @example
 * ```tsx
 * <PopoverContent align="start" sideOffset={8}>
 *   <div className="grid gap-4">
 *     <div className="space-y-2">
 *       <h4 className="font-medium">Dimensions</h4>
 *       <p className="text-sm text-muted-foreground">
 *         Set the dimensions for the layer.
 *       </p>
 *     </div>
 *   </div>
 * </PopoverContent>
 * ```
 */
function PopoverContent({
  className,
  align,
  sideOffset,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/**
 * Anchor element for the popover.
 * Allows the popover to be positioned relative to a different element than the trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor asChild>
 *     <div>Anchor element</div>
 *   </PopoverAnchor>
 *   <PopoverContent>
 *     <p>Positioned relative to anchor</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
