import type { ReactNode } from "react";

export interface TaskListProps {
  children: ReactNode;
  loading?: boolean;
  empty?: ReactNode;
  className?: string;
}

export function TaskList({
  children,
  loading = false,
  empty,
  className,
}: TaskListProps) {
  const content = loading ? (
    <div className="text-muted-foreground p-8 text-center" role="status">
      Loading tasks...
    </div>
  ) : (
    (empty ?? children)
  );

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4 ${className ?? ""}`}
      role="list"
    >
      {content}
    </div>
  );
}
