// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { createGoogleAuthConfig } from "./config.ts";
import { GoogleAuthClient } from "./client.ts";
import type { GoogleOAuthProfile } from "./types.ts";

/**
 * Default Google OAuth client (convention-over-configuration)
 * Uses sensible defaults and environment variables for easy setup
 */

let defaultClient: GoogleAuthClient | null = null;

/**
 * Gets or creates the default Google Auth client
 */
function getDefaultClient(): GoogleAuthClient {
  if (!defaultClient) {
    const config = createGoogleAuthConfig();
    defaultClient = new GoogleAuthClient(config);
  }
  return defaultClient;
}

/**
 * Initiates Google OAuth login with default configuration
 * Reads from VITE_GOOGLE_CLIENT_ID and VITE_REDIRECT_URI environment variables
 */
export function initiateGoogleLogin(): void {
  getDefaultClient().initiateLogin();
}

/**
 * Handles OAuth callback with default configuration
 * Calls POST /api/auth/google/callback by default
 * @param code Authorization code from Google OAuth callback
 * @returns User profile from backend
 */
export async function handleGoogleCallback(
  code: string
): Promise<GoogleOAuthProfile> {
  return await getDefaultClient().handleCallback(code);
}

/**
 * Default Google Auth class for common use cases
 */
export class DefaultGoogleAuth {
  private client: GoogleAuthClient;

  constructor() {
    this.client = getDefaultClient();
  }

  /**
   * Initiates Google OAuth login
   */
  login(): void {
    this.client.initiateLogin();
  }

  /**
   * Handles OAuth callback
   */
  async handleCallback(code: string): Promise<GoogleOAuthProfile> {
    return await this.client.handleCallback(code);
  }
}
