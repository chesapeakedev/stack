// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useContext } from "react";
import {
  ThemeProviderContext,
  type ThemeProviderState,
} from "./theme-provider-context.ts";

/**
 * Hook for accessing the current theme and theme setter.
 *
 * Must be used within a ThemeProvider component.
 *
 * @returns {ThemeProviderState} Object containing the current theme and setTheme function
 * @throws {Error} If used outside of a ThemeProvider
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, setTheme } = useTheme();
 *
 *   return (
 *     <div className="flex items-center gap-2">
 *       <span>Current theme: {theme}</span>
 *       <Button onClick={() => setTheme("dark")}>Dark</Button>
 *       <Button onClick={() => setTheme("light")}>Light</Button>
 *       <Button onClick={() => setTheme("system")}>System</Button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
