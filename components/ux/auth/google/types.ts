// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * Google OAuth user profile returned from Google's userinfo endpoint
 */
export interface GoogleOAuthProfile {
  sub: string; // Google user ID
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

/**
 * User profile structure that can be used by applications
 * This is the format returned from the backend after OAuth callback
 */
export interface GoogleUserProfile {
  id: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  googleOAuthId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Converts Google OAuth profile to application user profile format
 */
export function toUserProfile(profile: GoogleOAuthProfile): GoogleUserProfile {
  return {
    id: profile.sub,
    displayName: profile.name,
    email: profile.email,
    profilePicture: profile.picture,
    googleOAuthId: profile.sub,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
