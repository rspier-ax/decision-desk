import type { CaseSummary, RiskCaseDetail } from "@/services/risk-provider/types";

export type DemoScenario =
  | "standard"
  | "high-risk-surge"
  | "sla-backlog"
  | "low-risk"
  | "integration-instability";

export type DemoSimSettings = {
  apiLatency: "normal" | "slow";
  summaryService: "available" | "unavailable";
  partialDataFailure: boolean;
};

export type DemoSessionState = {
  version: 1;
  scenario: DemoScenario;
  cases: RiskCaseDetail[];
  generatedSummaries: Record<string, CaseSummary>;
  incomingBatchIndex: number;
  sim: DemoSimSettings;
};

/** Relative time offsets — materialized to ISO once on scenario load/reset. */
export type DemoCaseSeed = {
  caseId: string;
  submittedHoursAgo: number;
  /** Negative = already overdue relative to materialization time. */
  slaDueInHours: number;
  patch?: Partial<
    Pick<
      RiskCaseDetail,
      | "riskLevel"
      | "riskScore"
      | "suggestedAction"
      | "status"
      | "assignee"
      | "signals"
      | "signalCount"
    >
  >;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  "standard",
  "high-risk-surge",
  "sla-backlog",
  "low-risk",
  "integration-instability",
];

export const DEMO_SCENARIO_LABELS: Record<DemoScenario, string> = {
  standard: "Standard review queue",
  "high-risk-surge": "High-risk surge",
  "sla-backlog": "SLA backlog",
  "low-risk": "Low-risk operations",
  "integration-instability": "Integration instability",
};

export const DEFAULT_DEMO_SIM: DemoSimSettings = {
  apiLatency: "normal",
  summaryService: "available",
  partialDataFailure: false,
};

export const DEMO_STORAGE_KEY = "decision-desk-demo:v2";

export const ESCALATION_SUPERVISOR = "supervisor.rkim";
