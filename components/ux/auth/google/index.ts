// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

// Types
export type { GoogleOAuthProfile, GoogleUserProfile } from "./types.ts";
export { toUserProfile } from "./types.ts";

// Configuration
export type { GoogleAuthCallbackResponse, GoogleAuthConfig } from "./config.ts";
export { createGoogleAuthConfig, DEFAULT_SCOPE } from "./config.ts";

// Configurable client (config-over-convention)
export { GoogleAuthClient, initiateGoogleLogin } from "./client.ts";

// Default client (convention-over-configuration)
export {
  DefaultGoogleAuth,
  handleGoogleCallback,
  initiateGoogleLogin as defaultInitiateGoogleLogin,
} from "./default-client.ts";

// Auth Provider
export {
  DefaultGoogleAuthProvider,
  GoogleAuthProvider,
} from "./AuthProvider.tsx";
// Hook
export { useGoogleAuth } from "./useGoogleAuth.ts";
export type {
  AuthUser,
  GoogleAuthContextType,
  GoogleAuthProviderProps,
} from "./context.ts";

// Auth Callback
export {
  DefaultGoogleAuthCallback,
  GoogleAuthCallback,
} from "./AuthCallback.tsx";
export type {
  DefaultGoogleAuthCallbackProps,
  GoogleAuthCallbackProps,
} from "./AuthCallback.tsx";
