// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { GitHubOAuthProfile } from "./types.ts";

/**
 * Configuration for GitHub OAuth client
 */
export interface GitHubAuthConfig {
  /** GitHub OAuth client ID */
  clientId: string;
  /** Redirect URI after OAuth authorization */
  redirectUri: string;
  /** Backend API base URL (e.g., "https://api.example.com" or "/api") */
  apiBaseUrl?: string;
  /** OAuth scopes (default: "user:email") */
  scope?: string;
  /** Storage key for user data in localStorage (default: "user") */
  storageKey?: string;
  /** Backend endpoint for OAuth initiation (if backend handles OAuth flow) */
  backendInitEndpoint?: string;
}

/**
 * Default OAuth scopes
 */
export const DEFAULT_SCOPE = "user:email";

/**
 * Creates a GitHubAuthConfig from environment variables
 * Note: This function expects Vite environment variables (import.meta.env)
 */
export function createGitHubAuthConfig(): GitHubAuthConfig {
  // Type assertion for Vite's import.meta.env
  const env = (import.meta as { env?: Record<string, string | undefined> })
    .env as {
    VITE_GITHUB_CLIENT_ID?: string;
    VITE_REDIRECT_URI?: string;
    VITE_API_BASE_URL?: string;
    VITE_GITHUB_BACKEND_INIT_ENDPOINT?: string;
  };

  const clientId = env.VITE_GITHUB_CLIENT_ID;
  if (!clientId && !env.VITE_GITHUB_BACKEND_INIT_ENDPOINT) {
    throw new Error(
      "VITE_GITHUB_CLIENT_ID or VITE_GITHUB_BACKEND_INIT_ENDPOINT environment variable is required"
    );
  }

  const redirectUri =
    env.VITE_REDIRECT_URI ?? `${globalThis.location.origin}/auth/callback`;

  return {
    clientId: clientId ?? "",
    redirectUri,
    apiBaseUrl: env.VITE_API_BASE_URL,
    scope: DEFAULT_SCOPE,
    storageKey: "user",
    backendInitEndpoint: env.VITE_GITHUB_BACKEND_INIT_ENDPOINT,
  };
}

/**
 * Backend API response from OAuth callback endpoint
 */
export interface GitHubAuthCallbackResponse {
  user: GitHubOAuthProfile;
}
