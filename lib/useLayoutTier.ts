// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import {
  LAYOUT_TIER_MEDIA,
  type LayoutTier,
  resolveLayoutTier,
} from "./layoutTier.ts";
import { useMediaQuery } from "./useMediaQuery.ts";
import { useMemo } from "react";

/**
 * Current viewport layout tier (compact / hybrid / comfortable).
 */
export function useLayoutTier(): LayoutTier {
  const compact = useMediaQuery(LAYOUT_TIER_MEDIA.compact);
  const comfortable = useMediaQuery(LAYOUT_TIER_MEDIA.comfortable);

  return useMemo(() => {
    if (compact) return "compact";
    if (comfortable) return "comfortable";
    return "hybrid";
  }, [compact, comfortable]);
}

export function useLayoutTierWidth(): number {
  if (typeof window === "undefined") return 1280;
  return window.innerWidth;
}

export { resolveLayoutTier };
