// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

/**
 * TooltipProvider component. Must wrap all Tooltip components.
 * Provides the context for tooltip components.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <App />
 * </TooltipProvider>
 * ```
 */
interface TooltipProviderProps {
  delayDuration?: number;
  children: React.ReactNode;
}

function TooltipProvider({
  delayDuration = 300,
  ...props
}: TooltipProviderProps) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

/**
 * Tooltip component root. Provides the context for tooltip components.
 * Built on top of Radix UI Tooltip primitives for accessibility.
 *
 * @example
 * ```tsx
 * import { Tooltip, TooltipTrigger, TooltipContent } from "@shared/components/ui/tooltip"
 * import { Button } from "@shared/components/ui/button"
 *
 * function MyTooltip() {
 *   return (
 *     <Tooltip>
 *       <TooltipTrigger asChild>
 *         <Button>Hover me</Button>
 *       </TooltipTrigger>
 *       <TooltipContent>
 *         <p>This is a tooltip</p>
 *       </TooltipContent>
 *     </Tooltip>
 *   )
 * }
 * ```
 */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root {...props} />;
}

/**
 * TooltipTrigger component. Wraps the element that shows the tooltip on hover.
 */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * TooltipPortal component. Portals the tooltip content outside the DOM hierarchy.
 */
function TooltipPortal({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Portal>) {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
}

/**
 * TooltipContent component. The main content container for the tooltip.
 * Includes the portal by default.
 *
 * @example
 * ```tsx
 * <Tooltip>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipContent>
 *     <p>Tooltip text</p>
 *   </TooltipContent>
 * </Tooltip>
 * ```
 */
interface TooltipContentProps {
  className?: string;
  sideOffset?: number;
  children?: React.ReactNode;
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className ?? ""
        )}
        {...props}
      />
    </TooltipPortal>
  );
}

export {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
};
