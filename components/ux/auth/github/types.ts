// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * GitHub OAuth user profile returned from GitHub's user API endpoint
 */
export interface GitHubOAuthProfile {
  id: number; // GitHub user ID
  login: string; // GitHub username
  name?: string; // User's display name
  email?: string; // User's email
  avatar_url: string; // User's avatar URL
}

/**
 * User profile structure that can be used by applications
 * This is the format returned from the backend after OAuth callback
 */
export interface GitHubUserProfile {
  id: string;
  displayName: string;
  email?: string;
  profilePicture?: string;
  githubOAuthId: number;
  githubUsername: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Converts GitHub OAuth profile to application user profile format
 */
export function toUserProfile(profile: GitHubOAuthProfile): GitHubUserProfile {
  return {
    id: profile.id.toString(),
    displayName: profile.name ?? profile.login,
    email: profile.email,
    profilePicture: profile.avatar_url,
    githubOAuthId: profile.id,
    githubUsername: profile.login,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
