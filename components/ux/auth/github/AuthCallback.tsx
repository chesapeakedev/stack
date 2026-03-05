// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useEffect, useRef } from "react";
import type { GitHubOAuthProfile } from "./types.ts";
import { GitHubAuthClient } from "./client.ts";
import { handleGitHubCallback as defaultHandleCallback } from "./default-client.ts";
import type { GitHubAuthConfig } from "./config.ts";

export interface GitHubAuthCallbackProps {
  /** Authorization code from URL query params */
  code: string;
  /** State parameter from URL query params (optional) */
  state?: string;
  /** Backend API base URL (default: auto-detect) */
  apiBaseUrl?: string;
  /** Callback when user profile is successfully retrieved */
  onSuccess: (profile: GitHubOAuthProfile) => void | Promise<void>;
  /** Callback when an error occurs */
  onError: (error: Error) => void;
  /** Custom GitHub Auth configuration (if not provided, uses default-client) */
  config?: GitHubAuthConfig;
}

/**
 * Configurable GitHub Auth Callback component
 * Handles OAuth callback and calls appropriate callbacks
 */
export function GitHubAuthCallback({
  code,
  state,
  apiBaseUrl,
  onSuccess,
  onError,
  config,
}: GitHubAuthCallbackProps) {
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        let profile: GitHubOAuthProfile;
        if (config) {
          const client = new GitHubAuthClient(config);
          profile = await client.handleCallback(code, state);
        } else {
          profile = await defaultHandleCallback(code, state);
        }
        await onSuccess(profile);
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    void handleCallback();
  }, [code, state, apiBaseUrl, onSuccess, onError, config]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

export interface DefaultGitHubAuthCallbackProps {
  /** Authorization code from URL query params */
  code: string;
  /** State parameter from URL query params (optional) */
  state?: string;
  /** Callback when existing user is found */
  onUserFound: (profile: GitHubOAuthProfile) => void | Promise<void>;
  /** Callback when new user (not found in system) */
  onUserNotFound: (profile: GitHubOAuthProfile) => void | Promise<void>;
  /** Callback when an error occurs */
  onError: (error: Error) => void;
  /** Backend API endpoint for user lookup (default: /api/users) */
  userLookupEndpoint?: string;
  /** Redirect path after successful login (default: /home) */
  redirectPath?: string;
  /** Redirect path for new users (default: /create-user) */
  newUserRedirectPath?: string;
}

/**
 * Default GitHub Auth Callback component with convention-over-configuration
 * Handles common flow: callback -> lookup user -> redirect
 */
export function DefaultGitHubAuthCallback({
  code,
  state,
  onUserFound,
  onUserNotFound,
  onError,
  userLookupEndpoint,
  redirectPath,
  newUserRedirectPath,
}: DefaultGitHubAuthCallbackProps) {
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Get user profile from backend
        const profile = await defaultHandleCallback(code, state);

        // Look up existing user
        try {
          const response = await fetch(userLookupEndpoint ?? "");
          if (response.ok) {
            const userResponse = (await response.json()) as {
              value?: { githubOAuthId?: number }[];
            };
            const users = userResponse.value ?? [];
            const existingUser = users.find(
              (u: { githubOAuthId?: number }) => u.githubOAuthId === profile.id
            );

            if (existingUser) {
              await onUserFound(profile);
              // Store redirect path if using localStorage
              const storedRedirect =
                localStorage.getItem("redirectAfterLogin") ?? redirectPath;
              if (storedRedirect) {
                // Redirect logic would go here
              }
              localStorage.removeItem("redirectAfterLogin");
              // Note: Actual navigation should be handled by the app's router
              return;
            }
          }
        } catch (lookupError) {
          console.warn(
            "User lookup failed, treating as new user:",
            lookupError
          );
        }

        // New user flow
        localStorage.setItem("oauth_profile", JSON.stringify(profile));
        await onUserNotFound(profile);
        // Note: Actual navigation should be handled by the app's router
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    void handleCallback();
  }, [
    code,
    state,
    onUserFound,
    onUserNotFound,
    onError,
    userLookupEndpoint,
    redirectPath,
    newUserRedirectPath,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
