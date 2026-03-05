// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import React, { useCallback, useEffect, useState } from "react";
import { GitHubAuthClient } from "./client.ts";
import { initiateGitHubLogin as defaultInitiateLogin } from "./default-client.ts";

import {
  type AuthUser,
  GitHubAuthContext,
  type GitHubAuthProviderProps,
} from "./context.ts";

/**
 * Generic GitHub Auth Provider component
 * Manages user state and provides auth context to children
 */
export function GitHubAuthProvider({
  children,
  storageKey,
  onUserUpdate,
  config,
}: GitHubAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

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
    (newUser: AuthUser | null) => {
      setUser(newUser);
      const key = storageKey ?? "user";
      if (newUser) {
        localStorage.setItem(key, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(key);
      }
      onUserUpdate?.(newUser);
    },
    [storageKey, onUserUpdate]
  );

  const signInWithGitHub = useCallback(() => {
    if (config) {
      const client = new GitHubAuthClient(config);
      client.initiateLogin();
    } else {
      defaultInitiateLogin();
    }
  }, [config]);

  const signOut = useCallback(() => {
    setLoading(true);
    const key = storageKey ?? "user";
    localStorage.removeItem(key);
    setUser(null);
    onUserUpdate?.(null);
    setLoading(false);
  }, [storageKey, onUserUpdate]);

  return (
    <GitHubAuthContext.Provider
      value={{ user, loading, signInWithGitHub, signOut, updateUser }}
    >
      {children}
    </GitHubAuthContext.Provider>
  );
}

/**
 * Default GitHub Auth Provider with convention-over-configuration
 * Uses sensible defaults: /api/auth/github/callback, storage key "user"
 */
export function DefaultGitHubAuthProvider({
  children,
  onUserUpdate,
}: {
  children: React.ReactNode;
  onUserUpdate?: (user: AuthUser | null) => void;
}) {
  return (
    <GitHubAuthProvider storageKey="user" onUserUpdate={onUserUpdate}>
      {children}
    </GitHubAuthProvider>
  );
}
