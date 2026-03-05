// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useCallback, useState } from "react";
import { UserSearch } from "./UserSearch.tsx";
import { type SelectedUser, SelectedUsersList } from "./SelectedUsersList.tsx";
import type { BaseUser } from "../../types/user.ts";

export interface UserSelectorProps {
  selectedUsers: BaseUser[];
  onUsersChange: (users: BaseUser[]) => void;
  excludeUserIds?: string[];
  currentUserId?: string;
  searchEndpoint?: string;
  placeholder?: string;
  minQueryLength?: number;
  debounceMs?: number;
  showStatus?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  searchLabel?: string;
  listTitle?: string;
  selectedLabel?: string;
}

export function UserSelector({
  selectedUsers,
  onUsersChange,
  excludeUserIds,
  currentUserId,
  searchEndpoint,
  placeholder,
  minQueryLength,
  debounceMs,
  showStatus,
  maxHeight,
  emptyMessage,
  searchLabel,
  listTitle,
  selectedLabel,
}: UserSelectorProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(selectedUsers.map((u) => u.id))
  );

  const handleUserSelect = useCallback(
    (user: BaseUser) => {
      if (selectedUserIds.has(user.id)) {
        return; // Already selected
      }

      const newUsers = [...selectedUsers, user];
      const newIds = new Set(selectedUserIds);
      newIds.add(user.id);
      setSelectedUserIds(newIds);
      onUsersChange(newUsers);
    },
    [selectedUsers, selectedUserIds, onUsersChange]
  );

  const handleRemove = useCallback(
    (userId: string) => {
      const newUsers = selectedUsers.filter((u) => u.id !== userId);
      const newIds = new Set(selectedUserIds);
      newIds.delete(userId);
      setSelectedUserIds(newIds);
      onUsersChange(newUsers);
    },
    [selectedUsers, selectedUserIds, onUsersChange]
  );

  const isSelected = useCallback(
    (userId: string) => selectedUserIds.has(userId),
    [selectedUserIds]
  );

  // Convert BaseUser to SelectedUser format
  const selectedUsersList: SelectedUser[] = selectedUsers.map((u) => ({
    userId: u.id,
    displayName: u.displayName,
    email: u.email,
    profilePicture: u.profilePicture,
  }));

  // Combine excludeUserIds with selected user IDs
  const allExcludedIds = [
    ...(excludeUserIds ?? []),
    ...Array.from(selectedUserIds),
  ];

  return (
    <div className="space-y-4">
      <UserSearch
        onUserSelect={handleUserSelect}
        excludeUserIds={allExcludedIds}
        currentUserId={currentUserId}
        searchEndpoint={searchEndpoint}
        placeholder={placeholder}
        minQueryLength={minQueryLength}
        debounceMs={debounceMs}
        label={searchLabel}
        isSelected={isSelected}
        selectedLabel={selectedLabel}
      />
      <SelectedUsersList
        users={selectedUsersList}
        onRemove={handleRemove}
        showStatus={showStatus}
        maxHeight={maxHeight}
        emptyMessage={emptyMessage}
        title={listTitle}
      />
    </div>
  );
}
