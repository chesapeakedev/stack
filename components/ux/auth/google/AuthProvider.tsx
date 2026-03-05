// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import React, { useCallback, useEffect, useState } from "react";
import { GoogleAuthClient } from "./client.ts";
import { initiateGoogleLogin as defaultInitiateLogin } from "./default-client.ts";

import {
  type AuthUser,
  GoogleAuthContext,
  type GoogleAuthProviderProps,
} from "./context.ts";

/**
 * Generic Google Auth Provider component
 * Manages user state and provides auth context to children
 */
export function GoogleAuthProvider({
  children,
  storageKey,
  onUserUpdate,
  config,
}: GoogleAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load from localStorage
    const storedUser = localStorage.getItem(storageKey ?? "user");
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
          localStorage.removeItem(storageKey ?? "user");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem(storageKey ?? "user");
      }
    }
    setLoading(false);
  }, [storageKey]);

  const updateUser = useCallback(
    (newUser: AuthUser | null) => {
      setUser(newUser);
      if (newUser) {
        localStorage.setItem(storageKey ?? "user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem(storageKey ?? "user");
      }
      onUserUpdate?.(newUser);
    },
    [storageKey, onUserUpdate]
  );

  const signInWithGoogle = useCallback(() => {
    if (config) {
      const client = new GoogleAuthClient(config);
      client.initiateLogin();
    } else {
      defaultInitiateLogin();
    }
  }, [config]);

  const signOut = useCallback(() => {
    setLoading(true);
    localStorage.removeItem(storageKey ?? "user");
    setUser(null);
    onUserUpdate?.(null);
    setLoading(false);
  }, [storageKey, onUserUpdate]);

  return (
    <GoogleAuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOut, updateUser }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
}

/**
 * Default Google Auth Provider with convention-over-configuration
 * Uses sensible defaults: /api/auth/google/callback, storage key "user"
 */
export function DefaultGoogleAuthProvider({
  children,
  onUserUpdate,
}: {
  children: React.ReactNode;
  onUserUpdate?: (user: AuthUser | null) => void;
}) {
  return (
    <GoogleAuthProvider storageKey="user" onUserUpdate={onUserUpdate}>
      {children}
    </GoogleAuthProvider>
  );
}
