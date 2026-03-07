/**
 * User search, selection, and friend list for social features.
 *
 * Demonstrates: UserSelector, FriendList, Card, BaseUser / Friend types
 *
 * These components expect API endpoints. Provide your own backend URLs via
 * the endpoint props or use the defaults shown here.
 */

import { useState } from "react";
import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { UserSelector } from "@chesapeake/stack/components/ux/UserSelector";
import { FriendList } from "@chesapeake/stack/components/ux/FriendList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import { Separator } from "@chesapeake/stack/components/ui/separator";
import type { BaseUser, Friend } from "@chesapeake/stack/types/user";

const currentUserId = "user-1";

const sampleFriends: Friend[] = [
  {
    id: "friend-1",
    displayName: "Alice Chen",
    email: "alice@example.com",
    status: "accepted",
  },
  {
    id: "friend-2",
    displayName: "Bob Martinez",
    status: "accepted",
    presence: 1,
  },
  {
    id: "friend-3",
    displayName: "Carol Kim",
    email: "carol@example.com",
    status: "pending",
  },
];

export function UserManagementExample() {
  const [selectedUsers, setSelectedUsers] = useState<BaseUser[]>([]);
  const [friends, setFriends] = useState<Friend[]>(sampleFriends);

  return (
    <ThemeProvider>
      <div className="max-w-lg mx-auto space-y-6 p-8">
        {/* User search + multi-select */}
        <Card>
          <CardHeader>
            <CardTitle>Invite People</CardTitle>
            <CardDescription>
              Search for users and add them to your group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSelector
              selectedUsers={selectedUsers}
              onUsersChange={setSelectedUsers}
              currentUserId={currentUserId}
              searchEndpoint="/api/users/search"
              placeholder="Search by name or email..."
              searchLabel="Find users"
              listTitle="Selected"
              emptyMessage="No users selected yet."
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Friend list with remove */}
        <Card>
          <CardHeader>
            <CardTitle>Friends</CardTitle>
            <CardDescription>
              {friends.filter((f) => f.status === "accepted").length} accepted,{" "}
              {friends.filter((f) => f.status === "pending").length} pending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FriendList
              friends={friends}
              showPresence
              emptyMessage="No friends yet. Search for users above."
              onRemove={(friendId) => {
                setFriends((prev) => prev.filter((f) => f.id !== friendId));
              }}
            />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
