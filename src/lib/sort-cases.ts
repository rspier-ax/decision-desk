import type { CaseStatus, RiskCase, RiskLevel } from "@/services/risk-provider/types";

export const CASE_SORT_VALUES = [
  "sla_asc",
  "sla_desc",
  "id_asc",
  "id_desc",
  "applicant_asc",
  "applicant_desc",
  "product_asc",
  "product_desc",
  "risk_asc",
  "risk_desc",
  "status_asc",
  "status_desc",
  "assignee_asc",
  "assignee_desc",
  "submitted_asc",
  "submitted_desc",
] as const;

export type CaseSort = (typeof CASE_SORT_VALUES)[number];

export type CaseTableSortColumn =
  | "id"
  | "applicant"
  | "product"
  | "risk"
  | "status"
  | "assignee"
  | "sla"
  | "submitted";

export type CaseSortKey =
  | "id"
  | "applicantName"
  | "productType"
  | "riskScore"
  | "status"
  | "assignee"
  | "slaDueAt"
  | "submittedAt";

export type SortDirection = "asc" | "desc";

export const DEFAULT_CASE_SORT: CaseSort = "sla_asc";

const COLUMN_TO_KEY: Record<CaseTableSortColumn, CaseSortKey> = {
  id: "id",
  applicant: "applicantName",
  product: "productType",
  risk: "riskScore",
  status: "status",
  assignee: "assignee",
  sla: "slaDueAt",
  submitted: "submittedAt",
};

const RISK_LEVEL_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const STATUS_ORDER: Record<CaseStatus, number> = {
  pending: 1,
  in_review: 2,
  approved: 3,
  rejected: 4,
  escalated: 5,
};

const SORT_TRIPLETS: Record<CaseTableSortColumn, readonly [CaseSort, CaseSort, ""]> = {
  id: ["id_asc", "id_desc", ""],
  applicant: ["applicant_asc", "applicant_desc", ""],
  product: ["product_asc", "product_desc", ""],
  risk: ["risk_asc", "risk_desc", ""],
  status: ["status_asc", "status_desc", ""],
  assignee: ["assignee_asc", "assignee_desc", ""],
  sla: ["sla_asc", "sla_desc", ""],
  submitted: ["submitted_asc", "submitted_desc", ""],
};

export function isCaseSort(value: string | null | undefined): value is CaseSort {
  if (value == null || value.trim() === "") return false;
  return (CASE_SORT_VALUES as readonly string[]).includes(value);
}

export function parseCaseSortParam(raw: CaseSort | null | undefined): CaseSort {
  if (raw == null || raw.trim() === "") return DEFAULT_CASE_SORT;
  return isCaseSort(raw) ? raw : DEFAULT_CASE_SORT;
}

/**
 * Next sort after clicking a column header.
 * Cycles asc → desc → clear (default order).
 */
export function cycleCaseTableSortParam(
  column: CaseTableSortColumn,
  sortParam: CaseSort | null,
): CaseSort | "" {
  const active = sortParam && isCaseSort(sortParam) ? sortParam : null;
  const [ascValue, descValue, cleared] = SORT_TRIPLETS[column];
  if (active !== ascValue && active !== descValue) return ascValue;
  if (active === ascValue) return descValue;
  return cleared;
}

export function getColumnSortDirection(
  column: CaseTableSortColumn,
  sortParam: CaseSort | null,
): SortDirection | null {
  const [ascValue, descValue] = SORT_TRIPLETS[column];
  if (sortParam === ascValue) return "asc";
  if (sortParam === descValue) return "desc";
  return null;
}

export function resolveCaseSort(sortParam: CaseSort | null): {
  key: CaseSortKey;
  direction: SortDirection;
} {
  const effective = parseCaseSortParam(sortParam);
  const suffix = effective.endsWith("_asc") ? "asc" : "desc";
  const prefix = effective.replace(/_(asc|desc)$/, "");

  const keyByPrefix: Record<string, CaseSortKey> = {
    sla: "slaDueAt",
    id: "id",
    applicant: "applicantName",
    product: "productType",
    risk: "riskScore",
    status: "status",
    assignee: "assignee",
    submitted: "submittedAt",
  };

  const key = keyByPrefix[prefix];
  if (!key) {
    return { key: COLUMN_TO_KEY.sla, direction: "asc" };
  }

  return { key, direction: suffix as SortDirection };
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function compareAssignee(a: string | null, b: string | null): number {
  const left = a ?? "";
  const right = b ?? "";
  if (!left && !right) return 0;
  if (!left) return 1;
  if (!right) return -1;
  return compareStrings(left, right);
}

function compareCase(a: RiskCase, b: RiskCase, key: CaseSortKey): number {
  switch (key) {
    case "id":
      return compareStrings(a.id, b.id);
    case "applicantName":
      return compareStrings(a.applicantName, b.applicantName);
    case "productType":
      return compareStrings(a.productType, b.productType);
    case "riskScore": {
      const levelDiff = RISK_LEVEL_ORDER[a.riskLevel] - RISK_LEVEL_ORDER[b.riskLevel];
      return levelDiff !== 0 ? levelDiff : a.riskScore - b.riskScore;
    }
    case "status":
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    case "assignee":
      return compareAssignee(a.assignee, b.assignee);
    case "slaDueAt":
      return new Date(a.slaDueAt).getTime() - new Date(b.slaDueAt).getTime();
    case "submittedAt":
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    default:
      return 0;
  }
}

export function sortCases(cases: RiskCase[], sortParam: CaseSort | null): RiskCase[] {
  const { key, direction } = resolveCaseSort(sortParam);
  const multiplier = direction === "asc" ? 1 : -1;
  return [...cases].sort((a, b) => compareCase(a, b, key) * multiplier);
}

export const QUEUE_TABLE_COLUMNS: { label: string; column: CaseTableSortColumn }[] = [
  { label: "Case ID", column: "id" },
  { label: "Applicant", column: "applicant" },
  { label: "Product", column: "product" },
  { label: "Risk", column: "risk" },
  { label: "Status", column: "status" },
  { label: "Assignee", column: "assignee" },
  { label: "SLA", column: "sla" },
  { label: "Submitted", column: "submitted" },
];
