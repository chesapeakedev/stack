// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

// User Search and Selection Components
export { UserSearch } from "./UserSearch.tsx";
export type { UserSearchProps } from "./UserSearch.tsx";

export { SelectedUsersList } from "./SelectedUsersList.tsx";
export type {
  SelectedUser,
  SelectedUsersListProps,
} from "./SelectedUsersList.tsx";

export { UserSelector } from "./UserSelector.tsx";
export type { UserSelectorProps } from "./UserSelector.tsx";

// Friend Management Components
export { FriendList } from "./FriendList.tsx";
export type { Friend, FriendListProps } from "./FriendList.tsx";

export { FriendRequestList } from "./FriendRequestList.tsx";
export type {
  FriendRequest,
  FriendRequestListProps,
} from "./FriendRequestList.tsx";

// StandardLayout Components (backward compatibility for PageLayout)
export {
  PageContainer,
  PageContent,
  PageHeader,
  PageLayout,
} from "./StandardLayout/index.ts";
export type {
  PageContainerProps,
  PageContentProps,
  PageHeaderProps,
  PageLayoutProps,
} from "./StandardLayout/index.ts";

// StandardLayout exports
export { ProfilePage, StandardLayout } from "./StandardLayout/index.ts";
export type {
  ProfilePageProps,
  StandardLayoutProps,
} from "./StandardLayout/index.ts";
