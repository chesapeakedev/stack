import type { ReactNode } from "react";
import { Card } from "../../ui/card.tsx";

export interface RunnerStatusCardProps {
  name: string;
  state: string;
  details?: string;
  repositories?: string[];
  children?: ReactNode;
  jobs?: ReactNode;
}

export function RunnerStatusCard({
  name,
  state,
  details,
  repositories = [],
  children,
  jobs,
}: RunnerStatusCardProps) {
  return (
    <Card
      className="space-y-3 rounded-md border p-4"
      aria-label={`${name} runner`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium">{name}</h4>
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
              {state}
            </span>
          </div>
          {details && (
            <p className="text-muted-foreground mt-1 text-xs">{details}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">{children}</div>
      </div>
      <div>
        <p className="text-sm font-medium">Repository access</p>
        {repositories.length ? (
          <ul className="text-muted-foreground mt-1 list-inside list-disc text-sm">
            {repositories.map((repository) => (
              <li key={repository}>{repository}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-1 text-sm">
            No repositories registered.
          </p>
        )}
      </div>
      {jobs}
    </Card>
  );
}
