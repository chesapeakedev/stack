// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { Button } from "../ui/button.tsx";
import { cn } from "../../lib/utils.ts";

/**
 * Props for {@link StickyShopBar}.
 */
export interface StickyShopBarProps {
  /** Label on the persistent commerce button. */
  label: string;
  /** Fired when the shop button is pressed. */
  onShopClick: () => void;
  className?: string;
}

/**
 * Mobile-only bar fixed to the bottom of the viewport with a commerce CTA.
 * Hidden from the `md` breakpoint up.
 *
 * @example
 * ```tsx
 * <StickyShopBar label="Order pickup" onShopClick={() => {}} />
 * ```
 */
export function StickyShopBar({
  label,
  onShopClick,
  className,
}: StickyShopBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3 md:hidden",
        className
      )}
    >
      <Button className="w-full" onClick={onShopClick}>
        {label}
      </Button>
    </div>
  );
}
