// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Label } from "../ui/label.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.tsx";
import type { BaseUser } from "../../types/user.ts";

/**
 * Props for the UserSearch component
 */
export interface UserSearchProps {
  /** Callback when a user is selected from search results */
  onUserSelect: (user: BaseUser) => void;
  /** Array of user IDs to exclude from search results */
  excludeUserIds?: string[];
  /** Current user's ID (excluded from results) */
  currentUserId?: string;
  /** API endpoint for searching users. Should accept a 'q' query parameter */
  searchEndpoint?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Minimum characters required before searching. @default 2 */
  minQueryLength?: number;
  /** Debounce delay in milliseconds. @default 300 */
  debounceMs?: number;
  /** Label displayed above the search input */
  label?: string;
  /** Whether to show an "Add" button next to results */
  showAddButton?: boolean;
  /** Function to check if a user is already selected */
  isSelected?: (userId: string) => boolean;
  /** Label displayed for selected users. @default "Selected" */
  selectedLabel?: string;
}

/**
 * A searchable input component for finding and selecting users.
 *
 * This component provides a search interface with debounced API calls,
 * displaying results in a dropdown. Supports excluding users, marking
 * selected users, and customizable appearance.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <UserSearch
 *   onUserSelect={(user) => console.log("Selected:", user)}
 *   searchEndpoint="/api/users/search"
 *   placeholder="Search users..."
 * />
 *
 * // With exclusions and selected state
 * <UserSearch
 *   onUserSelect={handleSelect}
 *   searchEndpoint="/api/users/search"
 *   currentUserId="123"
 *   excludeUserIds={["456", "789"]}
 *   isSelected={(id) => selectedIds.includes(id)}
 *   showAddButton
 * />
 *
 * // In a form with label
 * <UserSearch
 *   label="Add Team Member"
 *   onUserSelect={addMember}
 *   searchEndpoint="/api/users/search"
 *   minQueryLength={3}
 *   debounceMs={500}
 * />
 * ```
 *
 * @sideeffect
 * - Makes fetch requests to searchEndpoint
 * - Adds/removes document event listeners for click-outside handling
 * - Uses setTimeout for debouncing
 */
export function UserSearch({
  onUserSelect,
  excludeUserIds,
  currentUserId,
  searchEndpoint,
  placeholder,
  minQueryLength,
  debounceMs,
  label,
  showAddButton,
  isSelected,
  selectedLabel,
}: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BaseUser[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const performSearch = useCallback(
    async (query: string) => {
      const minLen = minQueryLength ?? 2;
      if (query.length < minLen) {
        setSearchResults([]);
        return;
      }

      const endpoint = searchEndpoint;
      if (!endpoint) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const url = new URL(endpoint, globalThis.location.origin);
        url.searchParams.set("q", query);

        const headers: HeadersInit = {};
        if (currentUserId) {
          headers["X-User-ID"] = currentUserId;
        }

        const response = await fetch(url.toString(), {
          headers,
          credentials: "include", // Include cookies for authentication
        });
        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = (await response.json()) as { value?: BaseUser[] };
        const users = data.value ?? [];

        // Filter out excluded users
        const excludeIds = excludeUserIds ?? [];
        const filtered = users.filter(
          (u) => u.id !== currentUserId && !excludeIds.includes(u.id)
        );

        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchEndpoint, currentUserId, excludeUserIds, minQueryLength]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setIsSearchOpen(true);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for debounced search
      debounceTimeoutRef.current = setTimeout(() => {
        void performSearch(query);
      }, debounceMs);
    },
    [performSearch, debounceMs]
  );

  const handleUserClick = useCallback(
    (user: BaseUser) => {
      onUserSelect(user);
      setSearchQuery("");
      setSearchResults([]);
      setIsSearchOpen(false);
    },
    [onUserSelect]
  );

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          setSearchQuery("");
          setSearchResults([]);
          setIsSearchOpen(false);
        }, 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const userIsSelected = (userId: string) => {
    return isSelected ? isSelected(userId) : false;
  };

  return (
    <div className="relative" ref={searchRef}>
      {label && <Label htmlFor="user-search">{label}</Label>}
      <div className="relative">
        <Input
          id="user-search"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSearch(e.currentTarget.value);
          }}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => {
            setIsSearchOpen(true);
            const minLen = minQueryLength ?? 2;
            if (searchQuery.length >= minLen) {
              void performSearch(searchQuery);
            }
          }}
        />
        {isSearchOpen && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setIsSearchOpen(false);
            }}
          >
            ✕
          </Button>
        )}
      </div>

      {isSearchOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  handleUserClick(user);
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user.profilePicture && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <img
                          src={user.profilePicture}
                          alt={user.displayName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.displayName}</p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {user.displayName}
                    </div>
                    {user.email && (
                      <div className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
                {userIsSelected(user.id) ? (
                  <div className="px-3 py-1 text-sm text-primary bg-primary/10 rounded-full flex-shrink-0">
                    {selectedLabel}
                  </div>
                ) : showAddButton ? (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(user);
                    }}
                    className="flex-shrink-0"
                  >
                    Add
                  </Button>
                ) : null}
              </div>
            ))
          ) : searchQuery.length >= (minQueryLength ?? 2) ? (
            <div className="p-4 text-center text-muted-foreground">
              No users found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
