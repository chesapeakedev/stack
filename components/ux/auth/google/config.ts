// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { GoogleOAuthProfile } from "./types.ts";

/**
 * Configuration for Google OAuth client
 */
export interface GoogleAuthConfig {
  /** Google OAuth client ID (required if backendInitEndpoint is not provided) */
  clientId?: string;
  /** Redirect URI after OAuth authorization */
  redirectUri: string;
  /** Backend endpoint that initiates OAuth flow (e.g., "/api/auth/google") */
  backendInitEndpoint?: string;
  /** Backend API base URL (e.g., "https://api.example.com" or "/api") */
  apiBaseUrl?: string;
  /** OAuth scopes (default: "openid email profile") */
  scope?: string;
  /** Storage key for user data in localStorage (default: "user") */
  storageKey?: string;
}

/**
 * Default OAuth scopes
 */
export const DEFAULT_SCOPE = "openid email profile";

/**
 * Creates a GoogleAuthConfig from environment variables
 * Note: This function expects Vite environment variables (import.meta.env)
 */
export function createGoogleAuthConfig(): GoogleAuthConfig {
  // Type assertion for Vite's import.meta.env
  const env = (import.meta as { env?: Record<string, string | undefined> })
    .env as {
    VITE_GOOGLE_CLIENT_ID?: string;
    VITE_REDIRECT_URI?: string;
    VITE_API_BASE_URL?: string;
  };

  const clientId = env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("VITE_GOOGLE_CLIENT_ID environment variable is required");
  }

  const redirectUri =
    env.VITE_REDIRECT_URI ??
    `${globalThis.location.origin}/api/auth/google/callback`;

  return {
    clientId,
    redirectUri,
    apiBaseUrl: env.VITE_API_BASE_URL,
    scope: DEFAULT_SCOPE,
    storageKey: "user",
  };
}

/**
 * Backend API response from OAuth callback endpoint
 */
export interface GoogleAuthCallbackResponse {
  user: GoogleOAuthProfile;
}
