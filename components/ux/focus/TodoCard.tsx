// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import { useState } from "react";
import type { ReactNode } from "react";
import { Input } from "../../ui/input.tsx";
import { FocusCard } from "./FocusCard.tsx";

export interface TodoCardProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onTitleChange?: (title: string) => void;
  metadata?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TodoCard({
  title,
  completed,
  onToggle,
  onTitleChange,
  metadata,
  description,
  actions,
  className,
}: TodoCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);

  const save = () => {
    const next = draft.trim();
    if (next && next !== title) onTitleChange?.(next);
    setEditing(false);
  };

  return (
    <FocusCard
      completed={completed}
      className={className}
      leading={
        <input
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
          checked={completed}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded text-primary focus:ring-2 focus:ring-primary"
          onChange={onToggle}
          type="checkbox"
        />
      }
      actions={actions}
    >
      <div className="space-y-1">
        {editing ? (
          <Input
            aria-label="Edit todo title"
            autoFocus
            onBlur={save}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") save();
              if (event.key === "Escape") setEditing(false);
            }}
            value={draft}
          />
        ) : (
          <button
            className={`block w-full rounded-sm text-left font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              completed ? "text-muted-foreground line-through" : ""
            }`}
            onClick={() => {
              setDraft(title);
              if (onTitleChange) setEditing(true);
            }}
            type="button"
          >
            {title}
          </button>
        )}
        {metadata}
        {description}
      </div>
    </FocusCard>
  );
}
