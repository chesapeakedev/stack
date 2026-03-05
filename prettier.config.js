// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * Shared Prettier configuration for React + TypeScript apps.
 * Import and re-export from your project's prettier.config.js.
 */
export default {
  // Use single quotes for consistency
  singleQuote: false,
  // Use semicolons for better compatibility
  semi: true,
  // Use 2 spaces for indentation
  tabWidth: 2,
  // Use spaces instead of tabs
  useTabs: false,
  // Print width of 80 characters
  printWidth: 80,
  // Trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: "es5",
  // Add spaces between brackets in object literals
  bracketSpacing: true,
  // Put the > of a multi-line JSX element at the end of the last line
  bracketSameLine: false,
  // Arrow function parentheses: always
  arrowParens: "always",
  // End of line: use lf for consistency across platforms
  endOfLine: "lf",
};
