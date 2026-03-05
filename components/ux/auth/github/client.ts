// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import type { GitHubAuthCallbackResponse, GitHubAuthConfig } from "./config.ts";
import type { GitHubOAuthProfile } from "./types.ts";

/**
 * Configurable GitHub OAuth client (config-over-convention)
 * Provides full control over all OAuth parameters
 */
export class GitHubAuthClient {
  private config: GitHubAuthConfig;

  constructor(config: GitHubAuthConfig) {
    // Validate config
    if (!config.backendInitEndpoint && !config.clientId) {
      throw new Error(
        "Either clientId or backendInitEndpoint must be provided"
      );
    }
    this.config = config;
  }

  /**
   * Initiates GitHub OAuth login flow by redirecting to GitHub or backend endpoint
   */
  initiateLogin(): void {
    // If backend handles OAuth initiation, redirect to backend endpoint
    if (this.config.backendInitEndpoint) {
      globalThis.location.href = this.config.backendInitEndpoint;
      return;
    }

    // Otherwise, redirect directly to GitHub
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope ?? "user:email",
      state: this.generateState(),
    });

    // Store state in sessionStorage for validation
    const state = params.get("state");
    if (state) {
      sessionStorage.setItem(`github_oauth_state_${state}`, "pending");
    }

    globalThis.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Generates a secure random state parameter for OAuth
   */
  private generateState(): string {
    return crypto.randomUUID();
  }

  /**
   * Handles OAuth callback by exchanging code for user profile via backend
   * @param code Authorization code from GitHub OAuth callback
   * @param state State parameter from GitHub OAuth callback (optional, for validation)
   * @returns User profile from backend
   */
  async handleCallback(
    code: string,
    state?: string
  ): Promise<GitHubOAuthProfile> {
    // Validate state if provided
    if (state) {
      const storedState = sessionStorage.getItem(`github_oauth_state_${state}`);
      if (!storedState) {
        throw new Error("Invalid state parameter");
      }
      sessionStorage.removeItem(`github_oauth_state_${state}`);
    }

    const apiBaseUrl = this.config.apiBaseUrl ?? "";
    const endpoint = `${apiBaseUrl}/api/auth/github/callback`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
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

    const data = (await response.json()) as GitHubAuthCallbackResponse;
    return data.user;
  }

  /**
   * Updates the configuration
   */
  updateConfig(config: Partial<GitHubAuthConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Gets the current configuration
   */
  getConfig(): GitHubAuthConfig {
    return { ...this.config };
  }
}

/**
 * Standalone function to initiate GitHub OAuth login with configuration
 */
export function initiateGitHubLogin(config: GitHubAuthConfig): void {
  const client = new GitHubAuthClient(config);
  client.initiateLogin();
}
