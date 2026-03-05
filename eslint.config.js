// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint configuration for React + TypeScript apps.
 * Uses strict type checking for better type safety.
 *
 * Note: typescript-eslint flat config API may change; see
 * https://typescript-eslint.io for current recommendations.
 *
 * @param {object} parserOptions - TypeScript parser options
 * @param {string[]} parserOptions.project - TypeScript project files (e.g., ["./tsconfig.node.json", "./tsconfig.app.json"])
 * @param {string} parserOptions.tsconfigRootDir - Root directory for tsconfig resolution (use import.meta.dirname from the consuming app)
 */
export function createEslintConfig(parserOptions) {
  return tseslint.config(
    { ignores: ["dist", "node_modules"] },
    {
      extends: [
        js.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions,
      },
      plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "@typescript-eslint/unified-signatures": "off",
      },
    }
  );
}

// Default export for ESLint to use when linting this package directly
export default createEslintConfig({
  project: ["./tsconfig.json"],
  tsconfigRootDir: import.meta.dirname,
});
