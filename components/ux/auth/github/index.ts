// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

// Types
export type { GitHubOAuthProfile, GitHubUserProfile } from "./types.ts";
export { toUserProfile } from "./types.ts";

// Configuration
export type { GitHubAuthCallbackResponse, GitHubAuthConfig } from "./config.ts";
export { createGitHubAuthConfig, DEFAULT_SCOPE } from "./config.ts";

// Configurable client (config-over-convention)
export { GitHubAuthClient, initiateGitHubLogin } from "./client.ts";

// Default client (convention-over-configuration)
export {
  DefaultGitHubAuth,
  handleGitHubCallback,
  initiateGitHubLogin as defaultInitiateGitHubLogin,
} from "./default-client.ts";

// Auth Provider
export {
  DefaultGitHubAuthProvider,
  GitHubAuthProvider,
} from "./AuthProvider.tsx";
// Hook
export { useGitHubAuth } from "./useGitHubAuth.ts";
export type {
  AuthUser,
  GitHubAuthContextType,
  GitHubAuthProviderProps,
} from "./context.ts";

// Auth Callback
export {
  DefaultGitHubAuthCallback,
  GitHubAuthCallback,
} from "./AuthCallback.tsx";
export type {
  DefaultGitHubAuthCallbackProps,
  GitHubAuthCallbackProps,
} from "./AuthCallback.tsx";
