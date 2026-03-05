// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from "react";

import { ThemeProviderContext, type Theme } from "./theme-provider-context.ts";

/**
 * Props for the ThemeProvider component
 */
interface ThemeProviderProps {
  /** Child components to be wrapped by the provider */
  children: React.ReactNode;
  /** Default theme to use if none is stored in localStorage */
  defaultTheme?: Theme;
  /** Key used for storing theme preference in localStorage */
  storageKey?: string;
}

/**
 * Provider component for managing application theme (light/dark/system).
 *
 * This component manages the theme state and applies the appropriate
 * CSS class to the document root element. It persists the user's
 * preference in localStorage.
 *
 * The theme system supports:
 * - `light`: Always use light theme
 * - `dark`: Always use dark theme
 * - `system`: Follow the user's OS preference
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="system" storageKey="app-theme">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Using the theme in a component
 * import { useTheme } from "./useTheme";
 *
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 *
 * @sideeffect
 * - Modifies `localStorage` to persist theme preference
 * - Modifies `document.documentElement.classList` to apply theme class
 * - Listens to system preference changes when theme is "system"
 */
export function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey ?? "theme");
    if (
      stored &&
      (stored === "dark" || stored === "light" || stored === "system")
    ) {
      return stored as Theme;
    }
    return defaultTheme ?? "system";
  });

  useEffect(() => {
    const root = globalThis.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey ?? "dark", theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
