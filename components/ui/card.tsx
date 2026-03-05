// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React from "react";

import { cn } from "../../lib/utils";

/**
 * The main Card container component.
 * Provides consistent card styling with background, border, and shadow.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description goes here</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Main content of the card</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

/**
 * Header section of the Card.
 * Contains the title and description with proper spacing.
 */
function CardHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

/**
 * Title element for the Card header.
 */
function CardTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "leading-tight font-semibold text-base sm:text-lg",
        className
      )}
      {...props}
    />
  );
}

/**
 * Description text for the Card header.
 * Typically rendered below the title with muted styling.
 */
function CardDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/**
 * Action element positioned in the top-right of the Card header.
 * Useful for dropdown menus, buttons, or other actions.
 */
function CardAction({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

/**
 * Main content area of the Card.
 * Contains the primary content with consistent padding.
 */
function CardContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6 pb-4 sm:pb-6", className)}
      {...props}
    />
  );
}

/**
 * Footer section of the Card.
 * Typically contains actions or additional information.
 */
function CardFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-4 sm:px-6 py-4 sm:py-6 [.border-t]:pt-6",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
