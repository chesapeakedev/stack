// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type {
  DayHours,
  Weekday,
  WeeklyHours,
} from "../../types/retail-location.ts";

const WEEKDAYS: readonly Weekday[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

/** Hours for the local weekday of `at`. `null` means that day is closed. */
export function hoursForDay(hours: WeeklyHours, at: Date): DayHours | null {
  const key = WEEKDAYS[at.getDay()];
  return hours[key];
}

function minutesOfDay(hhmm: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!match) {
    return null;
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    return null;
  }
  return hour * 60 + minute;
}

/**
 * Whether `at` falls inside that local day's open range.
 * A `null` day, an unparsable `HH:MM` value, or a time outside
 * `[open, close)` is closed.
 */
export function isOpenAt(hours: WeeklyHours, at: Date): boolean {
  const day = hoursForDay(hours, at);
  if (!day) {
    return false;
  }
  const open = minutesOfDay(day.open);
  const close = minutesOfDay(day.close);
  if (open === null || close === null) {
    return false;
  }
  const now = at.getHours() * 60 + at.getMinutes();
  return now >= open && now < close;
}
