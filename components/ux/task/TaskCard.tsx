import { useState } from "react";
import type { ReactNode } from "react";
import { Card } from "../../ui/card.tsx";
import { Input } from "../../ui/input.tsx";

export interface TaskCardProps {
  title: string;
  completed: boolean;
  onToggle: () => void;
  onTitleChange?: (title: string) => void;
  leading?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
  className?: string;
  newlyAdded?: boolean;
}

export function TaskCard({
  title,
  completed,
  onToggle,
  onTitleChange,
  leading,
  content,
  actions,
  className,
  newlyAdded = false,
}: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const save = () => {
    const next = draft.trim();
    if (next && next !== title) onTitleChange?.(next);
    setEditing(false);
  };

  return (
    <Card
      role="listitem"
      className={`bg-background min-w-0 p-4 transition-all hover:shadow-md ${
        completed ? "bg-muted/50 opacity-75" : ""
      } ${newlyAdded ? "animate-in slide-in-from-top-2" : ""} ${className ?? ""}`}
    >
      <div className="flex min-w-0 items-start gap-2 md:gap-3">
        {leading}
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded text-primary focus:ring-2 focus:ring-primary"
          aria-label={completed ? "Mark incomplete" : "Mark complete"}
        />
        <div className="min-w-0 flex-1 space-y-2">
          {editing ? (
            <Input
              autoFocus
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
              }}
              onBlur={save}
              onKeyDown={(event) => {
                if (event.key === "Enter") save();
                if (event.key === "Escape") setEditing(false);
              }}
              aria-label="Edit task title"
            />
          ) : (
            <h3
              className={`cursor-text transition-colors hover:text-primary ${completed ? "text-muted-foreground line-through" : ""}`}
              onClick={() => {
                setDraft(title);
                if (onTitleChange) setEditing(true);
              }}
            >
              {title}
            </h3>
          )}
          {content}
        </div>
        {actions}
      </div>
    </Card>
  );
}
