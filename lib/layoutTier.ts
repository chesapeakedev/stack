// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** Three-tier layout names aligned with Tailwind default breakpoints. */
export type LayoutTier = "compact" | "hybrid" | "comfortable";

/** Max width (px) for compact tier (below md). */
export const LAYOUT_TIER_COMPACT_MAX_PX = 767;

/** Min width (px) for comfortable tier (lg and up). */
export const LAYOUT_TIER_COMFORTABLE_MIN_PX = 1024;

export const LAYOUT_TIER_MEDIA = {
  compact: `(max-width: ${String(LAYOUT_TIER_COMPACT_MAX_PX)}px)`,
  hybrid: `(min-width: 768px) and (max-width: ${String(LAYOUT_TIER_COMFORTABLE_MIN_PX - 1)}px)`,
  comfortable: `(min-width: ${String(LAYOUT_TIER_COMFORTABLE_MIN_PX)}px)`,
} as const;

/** Dialog vs drawer: at md and above use dialog shell. */
export const LAYOUT_TIER_DIALOG_MIN_MEDIA = "(min-width: 768px)";

export function resolveLayoutTier(viewportWidthPx: number): LayoutTier {
  if (viewportWidthPx <= LAYOUT_TIER_COMPACT_MAX_PX) return "compact";
  if (viewportWidthPx < LAYOUT_TIER_COMFORTABLE_MIN_PX) return "hybrid";
  return "comfortable";
}
