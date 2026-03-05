// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { createGitHubAuthConfig } from "./config.ts";
import { GitHubAuthClient } from "./client.ts";
import type { GitHubOAuthProfile } from "./types.ts";

/**
 * Default GitHub OAuth client (convention-over-configuration)
 * Uses sensible defaults and environment variables for easy setup
 */

let defaultClient: GitHubAuthClient | null = null;

/**
 * Gets or creates the default GitHub Auth client
 */
function getDefaultClient(): GitHubAuthClient {
  if (!defaultClient) {
    const config = createGitHubAuthConfig();
    defaultClient = new GitHubAuthClient(config);
  }
  return defaultClient;
}

/**
 * Initiates GitHub OAuth login with default configuration
 * Reads from VITE_GITHUB_CLIENT_ID and VITE_REDIRECT_URI environment variables
 */
export function initiateGitHubLogin(): void {
  getDefaultClient().initiateLogin();
}

/**
 * Handles OAuth callback with default configuration
 * Calls POST /api/auth/github/callback by default
 * @param code Authorization code from GitHub OAuth callback
 * @param state State parameter from GitHub OAuth callback (optional)
 * @returns User profile from backend
 */
export async function handleGitHubCallback(
  code: string,
  state?: string
): Promise<GitHubOAuthProfile> {
  return await getDefaultClient().handleCallback(code, state);
}

/**
 * Default GitHub Auth class for common use cases
 */
export class DefaultGitHubAuth {
  private client: GitHubAuthClient;

  constructor() {
    this.client = getDefaultClient();
  }

  /**
   * Initiates GitHub OAuth login
   */
  login(): void {
    this.client.initiateLogin();
  }

  /**
   * Handles OAuth callback
   */
  async handleCallback(
    code: string,
    state?: string
  ): Promise<GitHubOAuthProfile> {
    return await this.client.handleCallback(code, state);
  }
}
