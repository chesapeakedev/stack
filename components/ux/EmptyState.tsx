// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

/**
 * EmptyState component for displaying empty state messages
 */
export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={`text-center py-12 px-4 text-muted-foreground ${className ?? ""}`}
    >
      <p className="mb-2">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}
