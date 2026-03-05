// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

// Multi-Provider Auth
export { MultiAuthProvider } from "./MultiAuthProvider.tsx";
export { useAuth } from "./useAuth.ts";
export type {
  AuthProviderConfig,
  AuthUser,
  MultiAuthContextType,
  MultiAuthProviderProps,
} from "./context.ts";

// Auth Selector Component
export { AuthSelector } from "./AuthSelector.tsx";
export type { AuthSelectorProps } from "./AuthSelector.tsx";

// Google Auth (re-export for convenience)
export {
  createGoogleAuthConfig,
  DEFAULT_SCOPE as GOOGLE_DEFAULT_SCOPE,
  DefaultGoogleAuth,
  DefaultGoogleAuthCallback,
  DefaultGoogleAuthProvider,
  defaultInitiateGoogleLogin,
  GoogleAuthCallback,
  GoogleAuthClient,
  GoogleAuthProvider,
  handleGoogleCallback,
  initiateGoogleLogin,
  toUserProfile as toGoogleUserProfile,
  useGoogleAuth,
} from "./google/index.ts";
export type {
  AuthUser as GoogleAuthUser,
  DefaultGoogleAuthCallbackProps,
  GoogleAuthCallbackProps,
  GoogleAuthCallbackResponse,
  GoogleAuthConfig,
  GoogleAuthContextType,
  GoogleAuthProviderProps,
  GoogleOAuthProfile,
  GoogleUserProfile,
} from "./google/index.ts";

// GitHub Auth (re-export for convenience)
export {
  createGitHubAuthConfig,
  DEFAULT_SCOPE as GITHUB_DEFAULT_SCOPE,
  DefaultGitHubAuth,
  DefaultGitHubAuthCallback,
  DefaultGitHubAuthProvider,
  defaultInitiateGitHubLogin,
  GitHubAuthCallback,
  GitHubAuthClient,
  GitHubAuthProvider,
  handleGitHubCallback,
  initiateGitHubLogin,
  toUserProfile as toGitHubUserProfile,
  useGitHubAuth,
} from "./github/index.ts";
export type {
  AuthUser as GitHubAuthUser,
  DefaultGitHubAuthCallbackProps,
  GitHubAuthCallbackProps,
  GitHubAuthCallbackResponse,
  GitHubAuthConfig,
  GitHubAuthContextType,
  GitHubAuthProviderProps,
  GitHubOAuthProfile,
  GitHubUserProfile,
} from "./github/index.ts";
