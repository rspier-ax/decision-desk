import type { RiskCaseDetail } from "@/services/risk-provider/types";
import type { DemoSessionState } from "@/mocks/demo/types";
import { DEFAULT_DEMO_SIM } from "@/mocks/demo/types";

function timelineTimestamp(submittedAt: string, offsetMs: number): string {
  return new Date(new Date(submittedAt).getTime() + offsetMs).toISOString();
}

export function baseTimeline(caseId: string, submittedAt: string): RiskCaseDetail["timeline"] {
  return [
    {
      id: `${caseId}-tl-1`,
      timestamp: submittedAt,
      type: "system",
      title: "Application submitted",
      detail: "Online channel — personal loan request",
      actor: "system",
    },
    {
      id: `${caseId}-tl-2`,
      timestamp: timelineTimestamp(submittedAt, 23_000),
      type: "system",
      title: "Automated risk scoring completed",
      detail: "Ruleset fraud-rules-v3.2.1",
      actor: "decision_engine",
    },
    {
      id: `${caseId}-tl-3`,
      timestamp: timelineTimestamp(submittedAt, 40_000),
      type: "system",
      title: "Queued for manual review",
      detail: "Threshold exceeded for identity signals",
      actor: "decision_engine",
    },
  ];
}

export function baseAudit(caseId: string, submittedAt: string): RiskCaseDetail["auditHistory"] {
  return [
    {
      id: `${caseId}-audit-1`,
      timestamp: timelineTimestamp(submittedAt, 40_000),
      action: "Case created",
      actor: "system",
      metadata: { source: "decision_engine" },
    },
  ];
}

export function buildCaseDetail(
  base: Omit<
    RiskCaseDetail,
    "signals" | "timeline" | "auditHistory" | "decisionRationale" | "rulesetVersion"
  >,
  signals: RiskCaseDetail["signals"],
  rationale: string,
  extraTimeline: RiskCaseDetail["timeline"] = [],
  extraAudit: RiskCaseDetail["auditHistory"] = [],
): RiskCaseDetail {
  return {
    ...base,
    signals,
    decisionRationale: rationale,
    timeline: [...baseTimeline(base.id, base.submittedAt), ...extraTimeline],
    auditHistory: [...baseAudit(base.id, base.submittedAt), ...extraAudit],
    rulesetVersion: "fraud-rules-v3.2.1",
  };
}

export function cloneCaseDetail(caseDetail: RiskCaseDetail): RiskCaseDetail {
  return structuredClone(caseDetail);
}

export function cloneCases(cases: RiskCaseDetail[]): RiskCaseDetail[] {
  return cases.map(cloneCaseDetail);
}

export function cloneSession(session: DemoSessionState): DemoSessionState {
  return {
    version: session.version,
    scenario: session.scenario,
    cases: cloneCases(session.cases),
    generatedSummaries: structuredClone(session.generatedSummaries),
    incomingBatchIndex: session.incomingBatchIndex,
    sim: { ...session.sim },
  };
}

export function createEmptySession(
  scenario: DemoSessionState["scenario"],
  cases: RiskCaseDetail[],
): DemoSessionState {
  return {
    version: 1,
    scenario,
    cases: cloneCases(cases),
    generatedSummaries: {},
    incomingBatchIndex: 0,
    sim: { ...DEFAULT_DEMO_SIM },
  };
}
