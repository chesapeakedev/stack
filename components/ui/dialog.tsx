// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib/utils";

/**
 * Dialog component root. Provides the context for dialog components.
 * Built on top of Radix UI Dialog primitives for accessibility.
 *
 * @example
 * ```tsx
 * import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@shared/components/ui/dialog"
 * import { Button } from "@shared/components/ui/button"
 *
 * function MyDialog() {
 *   return (
 *     <Dialog>
 *       <DialogTrigger asChild>
 *         <Button>Open Dialog</Button>
 *       </DialogTrigger>
 *       <DialogContent>
 *         <DialogHeader>
 *           <DialogTitle>Dialog Title</DialogTitle>
 *         </DialogHeader>
 *         <p>Dialog content here</p>
 *       </DialogContent>
 *     </Dialog>
 *   )
 * }
 * ```
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * DialogTrigger component. Wraps the element that opens the dialog.
 * When clicked, the dialog will open.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open</Button>
 *   </DialogTrigger>
 *   <DialogContent>...</DialogContent>
 * </Dialog>
 * ```
 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * DialogPortal component. Portals the dialog content outside the DOM hierarchy.
 * Usually used internally by DialogContent.
 */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * DialogClose component. Closes the dialog when clicked.
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <DialogHeader>
 *     <DialogTitle>Title</DialogTitle>
 *   </DialogHeader>
 *   <p>Content</p>
 *   <DialogFooter>
 *     <DialogClose asChild>
 *       <Button variant="outline">Close</Button>
 *     </DialogClose>
 *   </DialogFooter>
 * </DialogContent>
 * ```
 */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * DialogOverlay component. The backdrop behind the dialog content.
 * Usually used internally by DialogContent.
 */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogContent component. The main content container for the dialog.
 * Includes the overlay and portal by default.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogContent className="max-w-md">
 *     <DialogHeader>
 *       <DialogTitle>Confirm Action</DialogTitle>
 *       <DialogDescription>
 *         Are you sure you want to proceed?
 *       </DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <Button>Confirm</Button>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/**
 * DialogHeader component. Container for the dialog title and description.
 * Provides consistent spacing and layout.
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <DialogHeader>
 *     <DialogTitle>Dialog Title</DialogTitle>
 *     <DialogDescription>Optional description text</DialogDescription>
 *   </DialogHeader>
 * </DialogContent>
 * ```
 */
function DialogHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogFooter component. Container for dialog action buttons.
 * Provides consistent spacing and responsive layout.
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <DialogHeader>...</DialogHeader>
 *   <DialogFooter>
 *     <Button>Save</Button>
 *     <DialogClose asChild>
 *       <Button variant="outline">Cancel</Button>
 *     </DialogClose>
 *   </DialogFooter>
 * </DialogContent>
 * ```
 */
function DialogFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogTitle component. The accessible title for the dialog.
 * Required for screen readers and accessibility.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Delete Item</DialogTitle>
 * </DialogHeader>
 * ```
 */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

/**
 * DialogDescription component. Optional descriptive text for the dialog.
 * Helps provide context to users.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Confirm Deletion</DialogTitle>
 *   <DialogDescription>
 *     This action cannot be undone. This will permanently delete the item.
 *   </DialogDescription>
 * </DialogHeader>
 * ```
 */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
