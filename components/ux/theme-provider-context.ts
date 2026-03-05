// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState | null>(
  null
);
