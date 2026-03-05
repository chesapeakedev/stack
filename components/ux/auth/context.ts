// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React, { createContext } from "react";
import type { GoogleAuthConfig } from "./google/config.ts";
import type { GitHubAuthConfig } from "./github/config.ts";

/**
 * Generic user type that applications can extend
 */
export interface AuthUser {
  [key: string]: unknown;
  provider?: "google" | "github";
}

export interface MultiAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  provider: "google" | "github" | null;
  signInWithGoogle: () => void;
  signInWithGitHub: () => void;
  signOut: () => void;
  updateUser: (user: AuthUser | null) => void;
}

export const MultiAuthContext = createContext<MultiAuthContextType | null>(
  null
);

export interface AuthProviderConfig {
  provider: "google" | "github";
  enabled: boolean;
  config?: GoogleAuthConfig | GitHubAuthConfig;
}

export interface MultiAuthProviderProps {
  children: React.ReactNode;
  /** Configuration for which providers are enabled */
  providers: AuthProviderConfig[];
  /** Storage key for user data in localStorage (default: "user") */
  storageKey?: string;
  /** Backend API base URL (default: auto-detect from window.location) */
  apiBaseUrl?: string;
  /** Callback when user is updated */
  onUserUpdate?: (user: AuthUser | null) => void;
}
