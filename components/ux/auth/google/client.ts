// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { GoogleAuthCallbackResponse, GoogleAuthConfig } from "./config.ts";
import type { GoogleOAuthProfile } from "./types.ts";

/**
 * Configurable Google OAuth client (config-over-convention)
 * Provides full control over all OAuth parameters
 */
export class GoogleAuthClient {
  private config: GoogleAuthConfig;

  constructor(config: GoogleAuthConfig) {
    // Validate config
    if (!config.backendInitEndpoint && !config.clientId) {
      throw new Error(
        "Either clientId or backendInitEndpoint must be provided"
      );
    }
    this.config = config;
  }

  /**
   * Initiates Google OAuth login flow by redirecting to Google or backend endpoint
   */
  initiateLogin(): void {
    // If backend handles OAuth initiation, redirect to backend endpoint
    if (this.config.backendInitEndpoint) {
      globalThis.location.href = this.config.backendInitEndpoint;
      return;
    }

    // Otherwise, redirect directly to Google
    if (!this.config.clientId) {
      throw new Error(
        "clientId is required when backendInitEndpoint is not provided"
      );
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scope ?? "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    globalThis.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Handles OAuth callback by exchanging code for user profile via backend
   * @param code Authorization code from Google OAuth callback
   * @returns User profile from backend
   */
  async handleCallback(code: string): Promise<GoogleOAuthProfile> {
    const apiBaseUrl = this.config.apiBaseUrl ?? "";
    const endpoint = `${apiBaseUrl}/api/auth/google/callback`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = (await response.json().catch(() => ({
        error: "Failed to exchange code for token",
      }))) as {
        error_description?: string;
        error?: string;
      };
      throw new Error(
        error.error_description ??
          error.error ??
          "Failed to exchange code for token"
      );
    }

    const data = (await response.json()) as GoogleAuthCallbackResponse;
    return data.user;
  }

  /**
   * Updates the configuration
   */
  updateConfig(config: Partial<GoogleAuthConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets the current configuration
   */
  getConfig(): GoogleAuthConfig {
    return { ...this.config };
  }
}

/**
 * Standalone function to initiate Google OAuth login with configuration
 */
export function initiateGoogleLogin(config: GoogleAuthConfig): void {
  const client = new GoogleAuthClient(config);
  client.initiateLogin();
}
