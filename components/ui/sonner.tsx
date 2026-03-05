// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */

import { Toaster as Sonner } from "sonner";

import type { ToasterProps } from "./sonner-api.ts";

/**
 * Toast notification component for displaying temporary messages.
 *
 * Built on top of Sonner for a polished toast experience.
 * Positioned in the top-right corner by default.
 *
 * @example
 * ```tsx
 * // Add Toaster to your app root
 * function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // Show toast anywhere in your app
 * import { toast } from "sonner";
 *
 * toast.success("Operation successful!");
 * toast.error("Something went wrong");
 * toast.info("New update available");
 * ```
 *
 * @example
 * ```tsx
 * // Custom toast with action
 * toast("Event has been created", {
 *   description: "Sunday, December 03, 2023 at 9:00 AM",
 *   action: {
 *     label: "Undo",
 *     onClick: () => console.log("Undo"),
 *   },
 * });
 * ```
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
