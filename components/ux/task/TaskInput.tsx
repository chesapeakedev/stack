import { useRef } from "react";
import type { RefObject } from "react";
import { Button } from "../../ui/button.tsx";

export interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
  inputClassName?: string;
  addButtonLabel?: string;
  /** Optional attribute for consumer product tours / E2E hooks. */
  inputDataTour?: string;
}

export function TaskInput({
  value,
  onChange,
  onAdd,
  placeholder = "Add a task...",
  inputRef,
  className,
  inputClassName,
  addButtonLabel = "Add task",
  inputDataTour,
}: TaskInputProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? internalRef;

  return (
    <div
      className={`border-border bg-background border-b p-4 ${className ?? ""}`}
    >
      <div className="flex gap-2">
        <input
          ref={ref}
          data-tour={inputDataTour}
          className={`border-border bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded border px-2 py-1 ${inputClassName ?? ""}`}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") onAdd();
          }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Button
          type="button"
          variant="default"
          size="icon"
          onClick={onAdd}
          aria-label={addButtonLabel}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            +
          </span>
        </Button>
      </div>
    </div>
  );
}
