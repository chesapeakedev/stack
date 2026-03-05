// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../lib/utils";
import {
  buttonGroupVariants,
  type ButtonGroupVariantsProps,
} from "./buttonGroupVariants.ts";
import { Separator } from "./separator";

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & ButtonGroupVariantsProps) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  asChild,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(
        "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input relative !m-0 self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
