// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/**
 * Product-neutral GitHub issue helpers shared by browser apps (denoise-ui, void-ui).
 * Does not call GitHub or any product API — parse, validate, and normalize only.
 */

export interface ParsedGitHubIssueRef {
  owner: string;
  repo: string;
  number: number;
  /** Canonical https://github.com/{owner}/{repo}/issues/{number} URL. */
  url: string;
}

export interface GitHubIssueLabel {
  id?: number;
  name: string;
  color?: string;
  description?: string | null;
  default?: boolean;
}

/** Minimal issue snapshot suitable for local task persistence. */
export interface GitHubIssueSnapshot {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  labels: GitHubIssueLabel[];
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  owner: string;
  repo: string;
  repository: string;
}

const ISSUE_PATH =
  /^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/issues\/([1-9]\d*)\/?$/;

const PULL_PATH =
  /^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/pull\/([1-9]\d*)\/?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Parse a GitHub issue URL into owner/repo/number.
 * Rejects pull-request URLs (`/pull/N`) and non-github.com hosts.
 */
export function parseGitHubIssueUrl(
  value: string
): ParsedGitHubIssueRef | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "github.com") {
    return null;
  }

  if (PULL_PATH.test(url.pathname)) {
    return null;
  }

  const match = ISSUE_PATH.exec(url.pathname);
  if (!match) return null;

  const owner = match[1];
  const repo = match[2];
  const number = Number(match[3]);
  if (!Number.isSafeInteger(number) || number < 1) return null;

  return {
    owner,
    repo,
    number,
    url: canonicalGitHubIssueUrl(owner, repo, number),
  };
}

export function canonicalGitHubIssueUrl(
  owner: string,
  repo: string,
  number: number
): string {
  return `https://github.com/${owner}/${repo}/issues/${String(number)}`;
}

export function githubIssueImportKey(
  owner: string,
  repo: string,
  number: number
): string {
  return `${owner}/${repo}#${String(number)}`.toLowerCase();
}

/** True when a GitHub Issues API payload represents a pull request. */
export function isGitHubPullRequestPayload(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return value.pull_request != null;
}

export function isValidRepoName(value: string): boolean {
  return (
    /^[A-Za-z0-9_.-]+$/.test(value) && value.length > 0 && value.length <= 100
  );
}

export function isValidIssueNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1;
}

function parseLabels(value: unknown): GitHubIssueLabel[] {
  if (!Array.isArray(value)) return [];
  const labels: GitHubIssueLabel[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.name !== "string") continue;
    labels.push({
      ...(typeof item.id === "number" ? { id: item.id } : {}),
      name: item.name,
      ...(typeof item.color === "string" ? { color: item.color } : {}),
      ...(item.description === null || typeof item.description === "string"
        ? { description: item.description }
        : {}),
      ...(typeof item.default === "boolean" ? { default: item.default } : {}),
    });
  }
  return labels;
}

/**
 * Normalize a GitHub Issues API payload (or a Void API response) into a
 * snapshot. Returns null for pull requests or malformed payloads.
 */
export function normalizeGitHubIssue(
  value: unknown,
  owner: string,
  repo: string
): GitHubIssueSnapshot | null {
  if (!isRecord(value)) return null;
  if (isGitHubPullRequestPayload(value)) return null;

  if (
    typeof value.number !== "number" ||
    !isValidIssueNumber(value.number) ||
    typeof value.title !== "string" ||
    (value.state !== "open" && value.state !== "closed") ||
    typeof value.html_url !== "string" ||
    value.html_url.trim() === "" ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string"
  ) {
    return null;
  }

  const body =
    value.body === null || typeof value.body === "string" ? value.body : null;
  const closedAt =
    value.closed_at === null || typeof value.closed_at === "string"
      ? value.closed_at
      : null;

  return {
    number: value.number,
    title: value.title,
    body,
    state: value.state,
    html_url: value.html_url,
    labels: parseLabels(value.labels),
    created_at: value.created_at,
    updated_at: value.updated_at,
    closed_at: closedAt,
    owner,
    repo,
    repository: `${owner}/${repo}`,
  };
}
