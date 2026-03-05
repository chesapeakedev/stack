// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { Button } from "../ui/button.tsx";
import { Check, X } from "lucide-react";
import type { BaseUser } from "../../types/user.ts";

export interface FriendRequest {
  id: string;
  requester: BaseUser | null;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface FriendRequestListProps {
  requests: FriendRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  emptyMessage?: string;
  title?: string;
}

export function FriendRequestList({
  requests,
  onAccept,
  onReject,
  emptyMessage,
  title,
}: FriendRequestListProps) {
  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (pendingRequests.length === 0) {
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
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {request.requester?.profilePicture && (
                <img
                  src={request.requester.profilePicture}
                  alt={request.requester.displayName}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {request.requester?.displayName ?? "Unknown User"}
                </div>
                {request.requester?.email && (
                  <div className="text-sm text-muted-foreground truncate">
                    {request.requester.email}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="ml-4 flex gap-2 flex-shrink-0">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  onAccept(request.id);
                }}
                className="h-8"
              >
                <Check className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  onReject(request.id);
                }}
                className="h-8"
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
