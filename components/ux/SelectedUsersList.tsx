// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { Button } from "../ui/button.tsx";
import { X } from "lucide-react";

export interface SelectedUser {
  userId: string;
  displayName: string;
  email?: string;
  profilePicture?: string;
  status?: string;
}

export interface SelectedUsersListProps {
  users: SelectedUser[];
  onRemove: (userId: string) => void;
  showStatus?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
  title?: string;
}

export function SelectedUsersList({
  users,
  onRemove,
  showStatus,
  maxHeight,
  emptyMessage,
  title,
}: SelectedUsersListProps) {
  if (users.length === 0) {
    return (
      <div className="space-y-2">
        {title && <h3 className="font-medium">{title}</h3>}
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {title && <h3 className="font-medium">{title}</h3>}
      <div className="space-y-2 overflow-y-auto" style={{ maxHeight }}>
        {users.map((user) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{user.displayName}</div>
                {user.email && (
                  <div className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                )}
                {showStatus && user.status && (
                  <div className="text-xs text-muted-foreground capitalize mt-1">
                    {user.status}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onRemove(user.userId);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
