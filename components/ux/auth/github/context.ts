// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React, { createContext } from "react";
import type { GitHubAuthConfig } from "./config.ts";

/**
 * Generic user type that applications can extend
 */
export type AuthUser = Record<string, unknown>;

export interface GitHubAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGitHub: () => void;
  signOut: () => void;
  updateUser: (user: AuthUser | null) => void;
}

export const GitHubAuthContext = createContext<GitHubAuthContextType | null>(
  null
);

export interface GitHubAuthProviderProps {
  children: React.ReactNode;
  /** Backend API base URL (default: auto-detect from window.location) */
  apiBaseUrl?: string;
  /** Storage key for user data in localStorage (default: "user") */
  storageKey?: string;
  /** Callback when user is updated */
  onUserUpdate?: (user: AuthUser | null) => void;
  /** Custom GitHub Auth configuration (if not provided, uses default-client) */
  config?: GitHubAuthConfig;
}
