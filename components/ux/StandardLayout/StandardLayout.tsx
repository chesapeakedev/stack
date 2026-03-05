// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../auth";
import { ProfilePage } from "./ProfilePage";
import type { AuthUser } from "../auth/context";

export type MaxWidthPreset = "narrow" | "medium" | "wide";

export interface StandardLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode; // Custom header content (title, buttons, etc.)
  showProfileButton?: boolean; // Default: true
  profilePageChildren?: React.ReactNode; // App-specific settings for ProfilePage
  // ProfilePage props
  enableGoogle?: boolean;
  enableGithub?: boolean;
  onAuthSuccess?: (user: AuthUser, provider: "google" | "github") => void;
  friendsEndpoint?: string;
  friendRequestsEndpoint?: string;
  userSearchEndpoint?: string;
  className?: string;
  maxWidth?: MaxWidthPreset; // Default: "wide" (100%)
}

/**
 * StandardLayout provides a complete single-page application layout
 * with header, main content area, and integrated profile page.
 * Matches the todo app's layout structure.
 */
export function StandardLayout({
  children,
  headerContent,
  showProfileButton,
  profilePageChildren,
  enableGoogle,
  enableGithub,
  onAuthSuccess,
  friendsEndpoint,
  friendRequestsEndpoint,
  userSearchEndpoint,
  className,
  maxWidth,
}: StandardLayoutProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { user: authUser } = useAuth();

  // Determine if user is logged in based on authUser
  const isLoggedIn = !!(
    authUser &&
    typeof authUser === "object" &&
    Object.keys(authUser).length > 0
  );

  // Get user avatar from authUser if available
  const userAvatar =
    authUser && typeof authUser === "object" && "avatarUrl" in authUser
      ? (authUser.avatarUrl as string)
      : authUser && typeof authUser === "object" && "photoURL" in authUser
        ? (authUser.photoURL as string)
        : undefined;

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleBackToMain = () => {
    setShowProfile(false);
  };

  // Get responsive max-width class
  // 100% width at 1080p and below (1920px), 50% width above 1080p
  const getMaxWidthClass = (preset: MaxWidthPreset | undefined): string => {
    const p = preset ?? "wide";
    switch (p) {
      case "narrow":
        // Responsive: 100% below 1920px (1080p), 50% at 1920px and above
        return "max-w-full [1920px]:max-w-[50%]";
      case "medium":
        // Responsive: 100% below 1920px, 75% at 1920px and above
        return "max-w-full [1920px]:max-w-[75%]";
      case "wide":
        return "max-w-full";
      default:
        return "max-w-full";
    }
  };

  // Show profile page if profile is open
  if (showProfile) {
    return (
      <div
        className={`h-screen flex flex-col overflow-hidden ${className ?? ""}`}
      >
        {/* Toolbar/Header */}
        <div className="border-b bg-background flex-shrink-0">
          <div className="flex justify-center">
            <div className={`w-full ${getMaxWidthClass(maxWidth)} p-4`}>
              <div className="flex justify-between items-center">
                {headerContent ? (
                  <div className="flex items-center gap-2 w-full">
                    {headerContent}
                    {showProfileButton && (
                      <div className="ml-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          className={isLoggedIn ? "ring-2 ring-green-500" : ""}
                          onClick={handleProfileClick}
                          title={isLoggedIn ? "View Profile" : "Login"}
                        >
                          {isLoggedIn && userAvatar ? (
                            <img
                              src={userAvatar}
                              alt="Profile"
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">App</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      {showProfileButton && (
                        <Button
                          variant="outline"
                          size="icon"
                          className={isLoggedIn ? "ring-2 ring-green-500" : ""}
                          onClick={handleProfileClick}
                          title={isLoggedIn ? "View Profile" : "Login"}
                        >
                          {isLoggedIn && userAvatar ? (
                            <img
                              src={userAvatar}
                              alt="Profile"
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area - Profile Page */}
        <div className="flex-1 overflow-hidden flex justify-center min-h-0">
          <div
            className={`w-full ${getMaxWidthClass(maxWidth)} flex flex-col h-full min-h-0`}
          >
            {/* Fixed Profile Header */}
            <div className="flex-shrink-0 border-b bg-background p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBackToMain}
                  className="p-2"
                >
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
                <h1 className="text-2xl font-bold">Profile</h1>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>
            </div>

            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <ProfilePage
                onBack={undefined}
                enableGoogle={enableGoogle}
                enableGithub={enableGithub}
                onAuthSuccess={onAuthSuccess}
                friendsEndpoint={friendsEndpoint}
                friendRequestsEndpoint={friendRequestsEndpoint}
                userSearchEndpoint={userSearchEndpoint}
                className={className}
                hideHeader
              >
                {profilePageChildren}
              </ProfilePage>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main layout
  return (
    <div
      className={`h-screen flex flex-col overflow-hidden ${className ?? ""}`}
    >
      {/* Toolbar/Header */}
      <div className="border-b bg-background flex-shrink-0">
        <div className="flex justify-center">
          <div className={`w-full ${getMaxWidthClass(maxWidth)} p-4`}>
            <div className="flex justify-between items-center">
              {headerContent ? (
                <div className="flex items-center gap-2 w-full">
                  {headerContent}
                  {showProfileButton && (
                    <div className="ml-auto">
                      <Button
                        variant="outline"
                        size="icon"
                        className={isLoggedIn ? "ring-2 ring-green-500" : ""}
                        onClick={handleProfileClick}
                        title={isLoggedIn ? "View Profile" : "Login"}
                      >
                        {isLoggedIn && userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">App</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    {showProfileButton && (
                      <Button
                        variant="outline"
                        size="icon"
                        className={isLoggedIn ? "ring-2 ring-green-500" : ""}
                        onClick={handleProfileClick}
                        title={isLoggedIn ? "View Profile" : "Login"}
                      >
                        {isLoggedIn && userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="Profile"
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden flex justify-center min-h-0">
        <div
          className={`w-full ${getMaxWidthClass(maxWidth)} flex flex-col h-full min-h-0`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
