// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useEffect, useRef } from "react";
import type { GoogleOAuthProfile } from "./types.ts";
import { GoogleAuthClient } from "./client.ts";
import { handleGoogleCallback as defaultHandleCallback } from "./default-client.ts";
import type { GoogleAuthConfig } from "./config.ts";

export interface GoogleAuthCallbackProps {
  /** Authorization code from URL query params */
  code: string;
  /** Backend API base URL (default: auto-detect) */
  apiBaseUrl?: string;
  /** Callback when user profile is successfully retrieved */
  onSuccess: (profile: GoogleOAuthProfile) => void | Promise<void>;
  /** Callback when an error occurs */
  onError: (error: Error) => void;
  /** Custom Google Auth configuration (if not provided, uses default-client) */
  config?: GoogleAuthConfig;
}

/**
 * Configurable Google Auth Callback component
 * Handles OAuth callback and calls appropriate callbacks
 */
export function GoogleAuthCallback({
  code,
  apiBaseUrl,
  onSuccess,
  onError,
  config,
}: GoogleAuthCallbackProps) {
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        let profile: GoogleOAuthProfile;
        if (config) {
          const client = new GoogleAuthClient(config);
          profile = await client.handleCallback(code);
        } else {
          profile = await defaultHandleCallback(code);
        }
        await onSuccess(profile);
      } catch (error) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };

    void handleCallback();
  }, [code, apiBaseUrl, onSuccess, onError, config]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

export interface DefaultGoogleAuthCallbackProps {
  /** Authorization code from URL query params */
  code: string;
  /** Callback when existing user is found */
  onUserFound: (profile: GoogleOAuthProfile) => void | Promise<void>;
  /** Callback when new user (not found in system) */
  onUserNotFound: (profile: GoogleOAuthProfile) => void | Promise<void>;
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
 * Default Google Auth Callback component with convention-over-configuration
 * Handles common flow: callback -> lookup user -> redirect
 */
export function DefaultGoogleAuthCallback({
  code,
  onUserFound,
  onUserNotFound,
  onError,
  userLookupEndpoint,
  redirectPath,
  newUserRedirectPath,
}: DefaultGoogleAuthCallbackProps) {
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Get user profile from backend
        const profile = await defaultHandleCallback(code);

        // Look up existing user
        try {
          const response = await fetch(userLookupEndpoint ?? "");
          if (response.ok) {
            const userResponse = (await response.json()) as {
              value?: { googleOAuthId?: string }[];
            };
            const users = userResponse.value ?? [];
            const existingUser = users.find(
              (u: { googleOAuthId?: string }) => u.googleOAuthId === profile.sub
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
