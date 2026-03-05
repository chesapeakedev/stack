// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { Button } from "../ui/button.tsx";
import { X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip.tsx";
import type { BaseUser } from "../../types/user.ts";

export interface Friend extends BaseUser {
  status: "pending" | "accepted";
  presence?: number;
}

export interface FriendListProps {
  friends: Friend[];
  onRemove: (friendId: string) => void;
  showPresence?: boolean;
  emptyMessage?: string;
  title?: string;
}

export function FriendList({
  friends,
  onRemove,
  showPresence,
  emptyMessage,
  title,
}: FriendListProps) {
  if (friends.length === 0) {
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
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {friend.profilePicture && (
                <div className="relative flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={friend.profilePicture}
                        alt={friend.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{friend.displayName}</p>
                      {friend.email && (
                        <p className="text-xs text-muted-foreground">
                          {friend.email}
                        </p>
                      )}
                      {friend.status === "pending" && (
                        <p className="text-xs text-yellow-600">Pending</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                  {showPresence && friend.presence !== undefined && (
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        friend.presence > 0 ? "bg-green-500" : "bg-gray-400"
                      }`}
                      title={friend.presence > 0 ? "Online" : "Offline"}
                    />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{friend.displayName}</div>
                {friend.email && (
                  <div className="text-sm text-muted-foreground truncate">
                    {friend.email}
                  </div>
                )}
                {friend.status === "pending" && (
                  <div className="text-xs text-yellow-600 mt-1">Pending</div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onRemove(friend.id);
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
