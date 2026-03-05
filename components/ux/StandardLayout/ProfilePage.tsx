// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { AuthSelector, type AuthUser, useAuth } from "../auth";
import { FriendList, FriendRequestList, UserSearch } from "../index";
import type { BaseUser } from "../../../types/user";
import type { Friend } from "../FriendList";
import type { FriendRequest } from "../FriendRequestList";

export interface ProfilePageProps {
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Enable Google OAuth login */
  enableGoogle?: boolean;
  /** Enable GitHub OAuth login */
  enableGithub?: boolean;
  /** Callback when authentication is successful */
  onAuthSuccess?: (user: AuthUser, provider: "google" | "github") => void;
  /** Full URL or path for fetching friends list */
  friendsEndpoint?: string;
  /** Full URL or path for fetching friend requests */
  friendRequestsEndpoint?: string;
  /** Full URL or path for user search endpoint */
  userSearchEndpoint?: string;
  /**
   * Base URL for API endpoints.
   * Auth endpoints will be prefixed with this URL.
   * @default ""
   * @example "https://api.example.com" or "/api"
   */
  apiBaseUrl?: string;
  /**
   * Endpoint for checking authentication status.
   * @default "/auth/me"
   */
  authMeEndpoint?: string;
  /**
   * Endpoint for logout.
   * @default "/auth/logout"
   */
  logoutEndpoint?: string;
  /** Additional CSS classes */
  className?: string;
  /** App-specific settings/content to render at the bottom */
  children?: React.ReactNode;
  /** Hide the header (for use in StandardLayout) */
  hideHeader?: boolean;
}

/**
 * ProfilePage component for authentication and user profile display
 * Matches the todo app's ProfilePage styling and structure
 */
export function ProfilePage({
  onBack,
  enableGoogle,
  enableGithub,
  onAuthSuccess,
  friendsEndpoint,
  friendRequestsEndpoint,
  userSearchEndpoint,
  apiBaseUrl = "",
  authMeEndpoint = "/auth/me",
  logoutEndpoint = "/auth/logout",
  className,
  children,
  hideHeader,
}: ProfilePageProps) {
  const { signOut: authSignOut } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{
    userId: string;
    userName: string;
    avatarUrl: string;
  } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const checkAuthStatus = async () => {
    try {
      const endpoint = `${apiBaseUrl}${authMeEndpoint}`;
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (response.ok) {
        const user = (await response.json()) as {
          userId: string | number;
          userName: string;
          avatarUrl?: string;
        };
        // Validate user data before treating as logged in
        if (user.userId && user.userName) {
          setUserData({
            userId: String(user.userId),
            userName: user.userName,
            avatarUrl: user.avatarUrl ?? "",
          });
          setIsLoggedIn(true);
        } else {
          // Invalid user data, clear auth state
          setUserData(null);
          setIsLoggedIn(false);
        }
      } else {
        // Not authenticated, clear auth state
        setUserData(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      // On error, clear auth state
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const endpoint = `${apiBaseUrl}${logoutEndpoint}`;
      await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });
      authSignOut();
      setUserData(null);
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout error:", err);
      // Still clear local state even if server request fails
      authSignOut();
      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  interface FriendResponse {
    friendId: string;
    friend?: {
      displayName?: string;
      email?: string;
      profilePicture?: string;
    };
    status?: string;
    presence?: string | number;
  }

  const loadFriends = async () => {
    try {
      const response = await fetch(friendsEndpoint ?? "", {
        credentials: "include",
      });
      if (response.ok) {
        const data = (await response.json()) as {
          value?: FriendResponse[];
        };
        const friendsList: Friend[] = (data.value ?? []).map(
          (f: FriendResponse) => ({
            id: f.friendId,
            displayName: f.friend?.displayName ?? "Unknown",
            email: f.friend?.email,
            profilePicture: f.friend?.profilePicture,
            status:
              f.status === "pending" || f.status === "accepted"
                ? f.status
                : "accepted",
            presence: (() => {
              if (f.presence === undefined) return undefined;
              if (typeof f.presence === "number") return f.presence;
              const parsed = Number.parseFloat(f.presence);
              return Number.isNaN(parsed) ? undefined : parsed;
            })(),
          })
        );
        setFriends(friendsList);
      }
    } catch (error) {
      console.error("Error loading friends:", error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch(friendRequestsEndpoint ?? "", {
        credentials: "include",
      });
      if (response.ok) {
        const data = (await response.json()) as {
          value?: FriendRequest[];
        };
        setFriendRequests(data.value ?? []);
      }
    } catch (error) {
      console.error("Error loading friend requests:", error);
    }
  };

  // Load friends and friend requests when logged in
  useEffect(() => {
    if (isLoggedIn && userData?.userId) {
      void loadFriends();
      void loadFriendRequests();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isLoggedIn, userData]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleUserSelect = async (user: BaseUser) => {
    try {
      const response = await fetch(`${friendsEndpoint ?? ""}/${user.id}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Reload friend requests to show the sent request
        void loadFriendRequests();
      } else {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        alert(errorData.error ?? "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await fetch(`${friendsEndpoint ?? ""}/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        void loadFriends();
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `${friendRequestsEndpoint ?? ""}/${requestId}/accept`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (response.ok) {
        void loadFriends();
        void loadFriendRequests();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(
        `${friendRequestsEndpoint ?? ""}/${requestId}/reject`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (response.ok) {
        void loadFriendRequests();
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleAuthSuccess = (user: AuthUser, provider: "google" | "github") => {
    // Sync with backend after successful auth
    void checkAuthStatus();
    if (onAuthSuccess) {
      onAuthSuccess(user, provider);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-4 ${className ?? ""}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
          )}
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      )}

      {/* Authentication Section */}
      {isLoggedIn && userData?.userId && userData.userName ? (
        <Card className="p-6 flex flex-col items-center justify-center">
          <div className="text-center w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={userData.avatarUrl}
                  alt={userData.userName}
                  className="w-20 h-20 rounded-full mx-auto mb-4 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{userData.userName}</p>
                {userData.userId && (
                  <p className="text-xs text-muted-foreground">
                    User ID: {userData.userId}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            <h2 className="text-xl font-semibold mb-2">@{userData.userName}</h2>
            <Button
              onClick={() => {
                void handleLogout();
              }}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* GitHub Login Section */}
          {enableGithub && (
            <Card className="p-6">
              <div className="text-center w-full">
                <h2 className="text-xl font-semibold mb-2">GitHub Login</h2>
                <p className="text-muted-foreground font-medium mb-4">
                  Connect your GitHub account to sync your data and collaborate.
                </p>
                <AuthSelector
                  enableGithub
                  enableGoogle={false}
                  onAuthSuccess={(
                    user: AuthUser,
                    provider: "google" | "github"
                  ) => {
                    handleAuthSuccess(user, provider);
                  }}
                />
              </div>
            </Card>
          )}

          {/* Google Login Section */}
          {enableGoogle && (
            <Card className={`p-6 ${(enableGithub ?? "") ? "mt-4" : ""}`}>
              <div className="text-center w-full">
                <h2 className="text-xl font-semibold mb-2">Google Login</h2>
                <p className="text-muted-foreground font-medium mb-4">
                  Connect your Google account to sync your data and collaborate.
                </p>
                <AuthSelector
                  enableGithub={false}
                  enableGoogle
                  onAuthSuccess={(
                    user: AuthUser,
                    provider: "google" | "github"
                  ) => {
                    handleAuthSuccess(user, provider);
                  }}
                />
              </div>
            </Card>
          )}
        </>
      )}

      {/* Friends Management Section - Only for logged-in users */}
      {isLoggedIn && userData?.userId && (
        <Card className="p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4">Friends</h3>

          {/* Friend Requests */}
          <div className="mb-6">
            <FriendRequestList
              requests={friendRequests}
              onAccept={(id) => {
                void handleAcceptRequest(id);
              }}
              onReject={(id) => {
                void handleRejectRequest(id);
              }}
              title="Friend Requests"
            />
          </div>

          {/* Add Friend Search */}
          <div className="mb-6">
            <UserSearch
              onUserSelect={(user) => {
                void handleUserSelect(user);
              }}
              currentUserId={userData.userId}
              searchEndpoint={userSearchEndpoint}
              placeholder="Search for friends..."
              label="Add Friend"
            />
          </div>

          {/* Friends List */}
          <div>
            <FriendList
              friends={friends}
              onRemove={(id) => {
                void handleRemoveFriend(id);
              }}
              showPresence
              title="My Friends"
            />
          </div>
        </Card>
      )}

      {/* App-Specific Settings Section */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
