// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useContext } from "react";
import { GitHubAuthContext, type GitHubAuthContextType } from "./context.ts";

/**
 * Hook to access GitHub Auth context
 */
export function useGitHubAuth(): GitHubAuthContextType {
  const context = useContext(GitHubAuthContext);
  if (!context) {
    throw new Error("useGitHubAuth must be used within a GitHubAuthProvider");
  }
  return context;
}
