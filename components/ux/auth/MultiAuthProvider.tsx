// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useCallback, useEffect, useState } from "react";
import type { GoogleAuthConfig } from "./google/config.ts";
import type { GitHubAuthConfig } from "./github/config.ts";
import { GoogleAuthProvider } from "./google/AuthProvider.tsx";
import { GitHubAuthProvider } from "./github/AuthProvider.tsx";
import { GoogleAuthClient } from "./google/client.ts";
import { GitHubAuthClient } from "./github/client.ts";
import { initiateGoogleLogin as defaultInitiateGoogleLogin } from "./google/default-client.ts";
import { initiateGitHubLogin as defaultInitiateGitHubLogin } from "./github/default-client.ts";

import {
  type AuthUser,
  MultiAuthContext,
  type MultiAuthProviderProps,
} from "./context.ts";

/**
 * Multi-Provider Auth Provider component
 * Wraps individual providers and provides unified auth interface
 */
export function MultiAuthProvider({
  children,
  providers,
  storageKey,
  apiBaseUrl,
  onUserUpdate,
}: MultiAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProvider, setActiveProvider] = useState<
    "google" | "github" | null
  >(null);

  const googleConfig = providers.find(
    (p) => p.provider === "google" && p.enabled
  );
  const githubConfig = providers.find(
    (p) => p.provider === "github" && p.enabled
  );

  useEffect(() => {
    // Initial load from localStorage
    const key = storageKey ?? "user";
    const storedUser = localStorage.getItem(key);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        // Validate that parsed user is actually a valid user object
        // Reject null, empty objects, or invalid values
        if (
          typeof parsedUser === "object" &&
          Object.keys(parsedUser).length > 0
        ) {
          setUser(parsedUser);
          setActiveProvider(
            (parsedUser as { provider?: "google" | "github" }).provider ?? null
          );
        } else {
          // Invalid user data, clear it
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(key);
      }
    }
    setLoading(false);
  }, [storageKey]);

  const updateUser = useCallback(
    (newUser: AuthUser | null, provider?: "google" | "github") => {
      setUser(newUser);
      const key = storageKey ?? "user";
      if (newUser) {
        const userWithProvider = {
          ...newUser,
          provider:
            provider ??
            (newUser as { provider?: "google" | "github" }).provider,
        };
        localStorage.setItem(key, JSON.stringify(userWithProvider));
        setActiveProvider(
          provider ??
            (newUser as { provider?: "google" | "github" }).provider ??
            null
        );
      } else {
        localStorage.removeItem(key);
        setActiveProvider(null);
      }
      onUserUpdate?.(newUser);
    },
    [storageKey, onUserUpdate]
  );

  const signOut = useCallback(() => {
    setLoading(true);
    const key = storageKey ?? "user";
    localStorage.removeItem(key);
    setUser(null);
    setActiveProvider(null);
    onUserUpdate?.(null);
    setLoading(false);
  }, [storageKey, onUserUpdate]);

  const signInWithGoogle = useCallback(() => {
    if (googleConfig) {
      if (googleConfig.config) {
        const client = new GoogleAuthClient(
          googleConfig.config as GoogleAuthConfig
        );
        client.initiateLogin();
      } else {
        defaultInitiateGoogleLogin();
      }
    }
  }, [googleConfig]);

  const signInWithGitHub = useCallback(() => {
    if (githubConfig) {
      if (githubConfig.config) {
        const client = new GitHubAuthClient(
          githubConfig.config as GitHubAuthConfig
        );
        client.initiateLogin();
      } else {
        defaultInitiateGitHubLogin();
      }
    }
  }, [githubConfig]);

  // Render providers based on configuration
  let content = children;

  // Wrap with GitHub provider if enabled
  if (githubConfig) {
    content = (
      <GitHubAuthProvider
        apiBaseUrl={apiBaseUrl}
        storageKey={storageKey}
        config={githubConfig.config as GitHubAuthConfig}
        onUserUpdate={(user) => {
          if (user) {
            updateUser(user as AuthUser, "github");
          } else if (activeProvider === "github") {
            updateUser(null);
          }
        }}
      >
        {content}
      </GitHubAuthProvider>
    );
  }

  // Wrap with Google provider if enabled
  if (googleConfig) {
    content = (
      <GoogleAuthProvider
        apiBaseUrl={apiBaseUrl}
        storageKey={storageKey}
        config={googleConfig.config as GoogleAuthConfig}
        onUserUpdate={(user) => {
          if (user) {
            updateUser(user as AuthUser, "google");
          } else if (activeProvider === "google") {
            updateUser(null);
          }
        }}
      >
        {content}
      </GoogleAuthProvider>
    );
  }

  return (
    <MultiAuthContext.Provider
      value={{
        user,
        loading,
        provider: activeProvider,
        signInWithGoogle,
        signInWithGitHub,
        signOut,
        updateUser: (user) => {
          updateUser(user, activeProvider ?? undefined);
        },
      }}
    >
      {content}
    </MultiAuthContext.Provider>
  );
}
