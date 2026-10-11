/**
 * Location page composed from the P0 retail blocks.
 *
 * Demonstrates: LocationHero, HoursStatusStrip, StoreSwitcher, StickyShopBar.
 *
 * `now` is a fixed Thursday midday so Baltimore's published Thursday hours
 * render as Open. Switching stores changes the headline, neighborhood, and
 * today's range. The shop button records the click in the page.
 */

import { useState } from "react";
import { LocationHero } from "@chesapeake/stack/components/retail/LocationHero";
import { HoursStatusStrip } from "@chesapeake/stack/components/retail/HoursStatusStrip";
import { StickyShopBar } from "@chesapeake/stack/components/retail/StickyShopBar";
import { StoreSwitcher } from "@chesapeake/stack/components/retail/StoreSwitcher";
import type { WeeklyHours } from "@chesapeake/stack/types/retail-location";

/** Thursday 8 Oct 2026, 12:00 local. Baltimore is open 10:00–21:00 that day. */
const DEMO_NOW = new Date(2026, 9, 8, 12, 0, 0);

interface SampleStore {
  slug: string;
  name: string;
  headline: string;
  neighborhood: string;
  hours: WeeklyHours;
  preOrderCutoff?: string;
}

const WEEKDAY = { open: "10:00", close: "21:00" };
const WEEKEND = { open: "09:00", close: "21:00" };
const SUNDAY = { open: "10:00", close: "20:00" };
const CINCINNATI_DAY = { open: "09:00", close: "21:00" };

const STORES: SampleStore[] = [
  {
    slug: "baltimore-md",
    name: "The Forest Baltimore",
    headline: "Welcome to The Forest Baltimore",
    neighborhood: "Canton",
    preOrderCutoff: "21:00",
    hours: {
      mon: WEEKDAY,
      tue: WEEKDAY,
      wed: WEEKDAY,
      thu: WEEKDAY,
      fri: WEEKEND,
      sat: WEEKEND,
      sun: SUNDAY,
    },
  },
  {
    slug: "cincinnati-oh",
    name: "The Forest Cincinnati",
    headline: "Welcome to The Forest Cincinnati",
    neighborhood: "Mt Carmel",
    hours: {
      mon: CINCINNATI_DAY,
      tue: CINCINNATI_DAY,
      wed: CINCINNATI_DAY,
      thu: CINCINNATI_DAY,
      fri: CINCINNATI_DAY,
      sat: CINCINNATI_DAY,
      sun: CINCINNATI_DAY,
    },
  },
];

/**
 * Two-store location page. The switcher writes the slug to localStorage and
 * a cookie; leave `selectedSlug` unset on first paint so a stored choice
 * can be restored.
 */
export function RetailLocationPageExample() {
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [shopClicks, setShopClicks] = useState(0);
  const [directionsFor, setDirectionsFor] = useState<string | null>(null);
  const active = STORES.find((store) => store.slug === slug) ?? STORES[0];

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <StoreSwitcher
        locations={STORES.map((store) => ({
          slug: store.slug,
          name: store.name,
        }))}
        selectedSlug={slug}
        onSelect={setSlug}
      />
      <LocationHero
        neighborhood={active.neighborhood}
        headline={active.headline}
        primaryLabel="Order pickup"
        onPrimaryClick={() => {
          setShopClicks((count) => count + 1);
        }}
        secondaryLabel="Directions"
        onSecondaryClick={() => {
          setDirectionsFor(active.neighborhood);
        }}
      />
      <HoursStatusStrip
        hours={active.hours}
        now={DEMO_NOW}
        preOrderCutoff={active.preOrderCutoff}
      />
      <p className="text-sm text-muted-foreground">
        Shop clicks: {shopClicks}
        {directionsFor ? ` · Directions for ${directionsFor}` : ""}
      </p>
      <StickyShopBar
        label="Order pickup"
        onShopClick={() => {
          setShopClicks((count) => count + 1);
        }}
      />
    </div>
  );
}
