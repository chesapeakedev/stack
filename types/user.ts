// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * Base User interface with common fields for consuming apps.
 * Extend this interface to add app-specific fields.
 */
export interface BaseUser {
  id: string;
  displayName: string;
  email?: string;
  profilePicture?: string;
}

/**
 * Friend relationship status
 */
export type FriendStatus = "pending" | "accepted";

/**
 * Friend relationship between two users
 */
export interface FriendRelationship {
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Friend request
 */
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

/**
 * Friend with optional presence information
 */
export interface Friend extends BaseUser {
  status: FriendStatus;
  presence?: number; // For todo app - presence indicator
}

/**
 * Type utility to convert app-specific User types to BaseUser
 */
export function toBaseUser(user: {
  id: string | number;
  displayName?: string;
  name?: string;
  login?: string;
  email?: string;
  profilePicture?: string;
  avatar_url?: string;
}): BaseUser {
  return {
    id: String(user.id),
    displayName: user.displayName ?? user.name ?? user.login ?? "Unknown",
    email: user.email,
    profilePicture: user.profilePicture ?? user.avatar_url,
  };
}
