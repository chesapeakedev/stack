// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useContext } from "react";
import { GoogleAuthContext, type GoogleAuthContextType } from "./context.ts";

/**
 * Hook to access Google Auth context
 */
export function useGoogleAuth(): GoogleAuthContextType {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
}
