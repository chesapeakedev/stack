// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useContext } from "react";
import { MultiAuthContext, type MultiAuthContextType } from "./context.ts";

/**
 * Hook to access Multi Auth context
 */
export function useAuth(): MultiAuthContextType {
  const context = useContext(MultiAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a MultiAuthProvider");
  }
  return context;
}
