// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

// StandardLayout exports
export { StandardLayout } from "./StandardLayout.tsx";
export type { StandardLayoutProps } from "./StandardLayout.tsx";

export { ProfilePage } from "./ProfilePage.tsx";
export type { ProfilePageProps } from "./ProfilePage.tsx";

export {
  PageContainer,
  PageContent,
  PageHeader,
  PageLayout,
} from "./PageLayout.tsx";

export {
  LAYOUT_TIER_COMPACT_MAX_PX,
  LAYOUT_TIER_COMFORTABLE_MIN_PX,
  LAYOUT_TIER_DIALOG_MIN_MEDIA,
  LAYOUT_TIER_MEDIA,
  resolveLayoutTier,
  type LayoutTier,
} from "../../../lib/layoutTier.ts";
export {
  useLayoutTier,
  useLayoutTierWidth,
} from "../../../lib/useLayoutTier.ts";
export { useMediaQuery } from "../../../lib/useMediaQuery.ts";
export type {
  PageContainerProps,
  PageContentProps,
  PageHeaderProps,
  PageLayoutProps,
} from "./PageLayout.tsx";
