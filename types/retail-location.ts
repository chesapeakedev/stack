// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * Canonical retail location content model.
 *
 * Shared with the Chesapeake audit rubric (chesapeakedev/chesapeake#485).
 * Phase 1 deep-links into `commerce.platform`; it does not replace checkout.
 */

/** Street address for one store. */
export interface Address {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

/** Lowercase weekday key used by {@link WeeklyHours}. */
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/**
 * Open and close as 24-hour local times (`HH:MM`).
 * A closed day is `null` on {@link WeeklyHours}, not a zero-length range.
 */
export interface DayHours {
  open: string;
  close: string;
}

/** One entry per weekday. `null` means the store is closed that day. */
export type WeeklyHours = Record<Weekday, DayHours | null>;

/** One question and answer on a location page. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Checkout platforms Phase 1 deep-links into. Phase 1 does not replace them. */
export type CommercePlatform =
  | "dutchie"
  | "toast"
  | "shopify"
  | "square"
  | "custom";

/**
 * Public facts for one retail location.
 * `storeId` is the id the commerce platform publishes. When the page does
 * not publish one, use a stable public slug.
 */
export interface RetailLocation {
  slug: string;
  name: string;
  headline: string;
  neighborhood?: string;
  address: Address;
  phone: string;
  email?: string;
  hours: WeeklyHours;
  status?: { preOrderCutoff?: string; badge?: string };
  commerce: {
    platform: CommercePlatform;
    storeId: string;
    shopUrl: string;
    categoryLinks?: Record<string, string>;
  };
  faqs: FaqItem[];
  localSeo?: { landmarks: string[]; serviceAreas: string[]; guide: string };
  social?: { googlePlaceId?: string };
}
