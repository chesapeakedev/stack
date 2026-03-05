// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import { cn } from "../../../lib/utils";

export interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageLayout provides a consistent structure for full-page layouts
 * with proper container, padding, and spacing.
 */
export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div
      className={cn("min-h-screen bg-background text-foreground", className)}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageHeader provides consistent header styling with border and background.
 * Responsive padding and wrapping for mobile devices.
 */
export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b bg-card", className)}>
      <div className="container mx-auto px-4 sm:px-6 py-4">{children}</div>
    </header>
  );
}

export interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * PageContent provides consistent main content area with container and padding.
 * Responsive padding for mobile and desktop.
 */
export function PageContent({
  children,
  className,
  containerClassName,
}: PageContentProps) {
  return (
    <main
      className={cn(
        "container mx-auto px-4 sm:px-6 py-6 sm:py-8",
        containerClassName
      )}
    >
      <div className={className}>{children}</div>
    </main>
  );
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
}

/**
 * PageContainer provides consistent content container with max-width constraints.
 * Useful for centering content with appropriate max-widths.
 * Responsive spacing for mobile and desktop.
 */
export function PageContainer({
  children,
  className,
  maxWidth,
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto space-y-4 sm:space-y-6",
        maxWidth ? maxWidthClasses[maxWidth] : undefined,
        className
      )}
    >
      {children}
    </div>
  );
}
