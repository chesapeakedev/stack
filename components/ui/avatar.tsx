// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../lib/utils";

/**
 * Container component for displaying user avatars.
 * Provides consistent circular styling and overflow handling.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

/**
 * Image component for displaying the avatar image.
 * Renders the actual avatar image within the Avatar container.
 * Falls back to AvatarFallback if image fails to load.
 *
 * @example
 * ```tsx
 * <AvatarImage src="https://example.com/avatar.jpg" alt="User Name" />
 * ```
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

/**
 * Fallback component displayed when the avatar image fails to load.
 * Typically shows initials or a placeholder icon.
 *
 * @example
 * ```tsx
 * <AvatarFallback>JD</AvatarFallback>
 * // or with icon
 * <AvatarFallback><UserIcon /></AvatarFallback>
 * ```
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
