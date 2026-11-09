import type { ReactNode } from "react";
import { Card } from "../../ui/card.tsx";

/** Per-checkout readiness reported by the paired runner. */
export interface RepositoryReadinessEntry {
  repository: string;
  ready: boolean;
  reason?: string;
}

export interface RunnerStatusCardProps {
  name: string;
  state: string;
  details?: string;
  repositories?: string[];
  /** Slug highlighted as the kickstart target for this page. */
  targetRepository?: string;
  /** Optional readiness per registered slug. */
  repositoryReadiness?: RepositoryReadinessEntry[];
  children?: ReactNode;
  jobs?: ReactNode;
}

function readinessForSlug(
  slug: string,
  entries: RepositoryReadinessEntry[] | undefined
): RepositoryReadinessEntry | undefined {
  if (!entries?.length) return undefined;
  const lower = slug.toLowerCase();
  return entries.find((entry) => entry.repository.toLowerCase() === lower);
}

export function RunnerStatusCard({
  name,
  state,
  details,
  repositories = [],
  targetRepository,
  repositoryReadiness,
  children,
  jobs,
}: RunnerStatusCardProps) {
  const targetLower = targetRepository?.trim().toLowerCase();
  const slugs = repositories.length
    ? repositories
    : targetRepository
      ? [targetRepository]
      : [];

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
        {slugs.length ? (
          <ul className="text-muted-foreground mt-1 list-inside list-disc text-sm">
            {slugs.map((repository) => {
              const readiness = readinessForSlug(
                repository,
                repositoryReadiness
              );
              const isTarget =
                targetLower != null && repository.toLowerCase() === targetLower;
              return (
                <li
                  key={repository}
                  className={
                    isTarget ? "text-foreground font-medium" : undefined
                  }
                  title={readiness?.reason}
                >
                  {repository}
                  {isTarget ? " · kickstart target" : ""}
                  {readiness != null
                    ? readiness.ready
                      ? " · ready"
                      : ` · not ready${
                          readiness.reason ? `: ${readiness.reason}` : ""
                        }`
                    : ""}
                </li>
              );
            })}
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
