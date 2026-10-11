// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { cn } from "../../lib/utils.ts";

/** One row in {@link StoreSwitcher}. */
export interface StoreOption {
  slug: string;
  name: string;
}

/**
 * Props for {@link StoreSwitcher}.
 *
 * Nearest-store detection is not implemented. `RetailLocation` has no
 * coordinates, so this control only persists an explicit choice.
 */
export interface StoreSwitcherProps {
  /** Stores the shopper can choose. */
  locations: StoreOption[];
  /** Selected slug. Omit it to restore the last stored slug on mount. */
  selectedSlug?: string;
  /** Called with the slug when the shopper picks a store, or when a stored slug is restored. */
  onSelect: (slug: string) => void;
  /**
   * `localStorage` key and cookie name.
   * @default "chesapeake.retail.location"
   */
  storageKey?: string;
  className?: string;
}

const DEFAULT_STORAGE_KEY = "chesapeake.retail.location";

function readStoredSlug(storageKey: string): string | null {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return stored;
    }
  } catch {
    // Private mode and disabled storage still allow the in-memory selection.
  }
  const prefix = `${encodeURIComponent(storageKey)}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

function writeStoredSlug(storageKey: string, slug: string): void {
  try {
    localStorage.setItem(storageKey, slug);
  } catch {
    // Cookie write below still records the choice when storage is blocked.
  }
  document.cookie = `${encodeURIComponent(storageKey)}=${encodeURIComponent(slug)}; Path=/; SameSite=Lax`;
}

/**
 * Store picker that remembers the selection in `localStorage` and a
 * `SameSite=Lax` cookie. Use it to keep the page's shopping context on
 * the location in the URL.
 *
 * @example
 * ```tsx
 * <StoreSwitcher
 *   locations={[{ slug: "baltimore-md", name: "Baltimore" }]}
 *   selectedSlug={slug}
 *   onSelect={setSlug}
 * />
 * ```
 */
export function StoreSwitcher({
  locations,
  selectedSlug,
  onSelect,
  storageKey = DEFAULT_STORAGE_KEY,
  className,
}: StoreSwitcherProps) {
  useEffect(() => {
    if (selectedSlug) {
      return;
    }
    const stored = readStoredSlug(storageKey);
    if (stored && locations.some((location) => location.slug === stored)) {
      onSelect(stored);
    }
  }, [locations, onSelect, selectedSlug, storageKey]);

  const handleChange = (slug: string) => {
    writeStoredSlug(storageKey, slug);
    onSelect(slug);
  };

  return (
    <Select value={selectedSlug} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-full max-w-xs", className)}>
        <SelectValue placeholder="Choose a store" />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.slug} value={location.slug}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
