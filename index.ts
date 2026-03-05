// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * @chesapeake/stack
 *
 * A reusable React component library and design system built on top of
 * shadcn/ui with Tailwind CSS.
 *
 * @example
 * ```tsx
 * import { Button } from '@chesapeake/stack/components/ui/button';
 * import { ThemeProvider } from '@chesapeake/stack/components/ux/theme-provider';
 *
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Button variant="default">Click me</Button>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// Re-export everything from subdirectories for convenient imports
export * from "./components/ui/index.ts";
export * from "./components/ux/index.ts";
export * from "./lib/utils.ts";
export { default as tailwindPreset } from "./tailwind.preset.ts";
