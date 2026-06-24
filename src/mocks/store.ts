import { cloneSession } from "@/mocks/demo/builders";
import { getIncomingBatch, incomingBatchCount } from "@/mocks/demo/incoming-cases";
import { createScenarioSession, getScenarioCases } from "@/mocks/demo/scenarios";
import type { DemoScenario, DemoSessionState, DemoSimSettings } from "@/mocks/demo/types";
import { DEFAULT_DEMO_SIM, ESCALATION_SUPERVISOR } from "@/mocks/demo/types";
import type {
  CaseFilters,
  CaseSummary,
  DecisionInput,
  DecisionResult,
  RiskCase,
  RiskCaseDetail,
} from "@/services/risk-provider/types";

const GLOBAL_SESSION_KEY = Symbol.for("decision-desk.demo.session");

type GlobalWithDemoSession = typeof globalThis & {
  [GLOBAL_SESSION_KEY]?: DemoSessionState;
};

function getSession(): DemoSessionState {
  const globalStore = globalThis as GlobalWithDemoSession;
  if (!globalStore[GLOBAL_SESSION_KEY]) {
    globalStore[GLOBAL_SESSION_KEY] = createScenarioSession("standard");
  }
  return globalStore[GLOBAL_SESSION_KEY]!;
}

function setSession(next: DemoSessionState): void {
  (globalThis as GlobalWithDemoSession)[GLOBAL_SESSION_KEY] = next;
}

function getCases(): RiskCaseDetail[] {
  return getSession().cases;
}

function matchesFilters(caseItem: RiskCase, filters?: CaseFilters): boolean {
  if (!filters) return true;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    const haystack = `${caseItem.id} ${caseItem.applicantName} ${caseItem.productType}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }

  if (filters.riskLevel?.length && !filters.riskLevel.includes(caseItem.riskLevel)) {
    return false;
  }

  if (filters.status?.length && !filters.status.includes(caseItem.status)) {
    return false;
  }

  if (filters.assignee) {
    if (filters.assignee === "unassigned" && caseItem.assignee !== null) return false;
    if (filters.assignee !== "unassigned" && caseItem.assignee !== filters.assignee) {
      return false;
    }
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    if (new Date(caseItem.submittedAt).getTime() < from) return false;
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    if (new Date(caseItem.submittedAt).getTime() > to) return false;
  }

  return true;
}

function toRiskCaseSummary(caseDetail: RiskCaseDetail): RiskCase {
  return {
    id: caseDetail.id,
    applicantName: caseDetail.applicantName,
    productType: caseDetail.productType,
    submittedAt: caseDetail.submittedAt,
    riskLevel: caseDetail.riskLevel,
    riskScore: caseDetail.riskScore,
    status: caseDetail.status,
    assignee: caseDetail.assignee,
    slaDueAt: caseDetail.slaDueAt,
    suggestedAction: caseDetail.suggestedAction,
    modelConfidence: caseDetail.modelConfidence,
    signalCount: caseDetail.signalCount,
  };
}

function applyPartialDataFailure(caseDetail: RiskCaseDetail): RiskCaseDetail {
  const session = getSession();
  if (!session.sim.partialDataFailure) return caseDetail;
  return {
    ...caseDetail,
    signals: caseDetail.signals.slice(0, Math.max(0, Math.floor(caseDetail.signals.length / 2))),
    signalCount: Math.max(0, Math.floor(caseDetail.signals.length / 2)),
  };
}

export function exportSession(): DemoSessionState {
  return cloneSession(getSession());
}

export function hydrateSession(next: DemoSessionState): DemoSessionState {
  setSession(cloneSession(next));
  return exportSession();
}

export function loadScenario(scenario: DemoScenario): DemoSessionState {
  setSession(createScenarioSession(scenario));
  return exportSession();
}

export function resetScenario(): DemoSessionState {
  setSession(createScenarioSession(getSession().scenario));
  return exportSession();
}

export function updateSimSettings(sim: Partial<DemoSimSettings>): DemoSessionState {
  const session = getSession();
  setSession({
    ...session,
    sim: { ...session.sim, ...sim },
  });
  return exportSession();
}

export function addIncomingCasesToStore(): { session: DemoSessionState; addedCount: number } {
  const session = getSession();
  const batch = getIncomingBatch(session.incomingBatchIndex, new Date());
  const existingIds = new Set(session.cases.map((c) => c.id));
  const toAdd = batch.filter((c) => !existingIds.has(c.id));

  setSession({
    ...session,
    cases: [...toAdd, ...session.cases],
    incomingBatchIndex: (session.incomingBatchIndex + 1) % incomingBatchCount(),
  });

  return { session: exportSession(), addedCount: toAdd.length };
}

export function saveGeneratedSummary(caseId: string, summary: CaseSummary): DemoSessionState {
  const session = getSession();
  setSession({
    ...session,
    generatedSummaries: {
      ...session.generatedSummaries,
      [caseId]: summary,
    },
  });
  return exportSession();
}

export function deleteGeneratedSummary(caseId: string): DemoSessionState {
  const session = getSession();
  const { [caseId]: _removed, ...generatedSummaries } = session.generatedSummaries;
  setSession({ ...session, generatedSummaries });
  return exportSession();
}

export function getGeneratedSummary(caseId: string): CaseSummary | undefined {
  return getSession().generatedSummaries[caseId];
}

export function getSimSettings(): DemoSimSettings {
  return getSession().sim;
}

export async function applySimulatedLatency(): Promise<void> {
  if (getSession().sim.apiLatency === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
}

export function listCasesFromStore(filters?: CaseFilters): RiskCase[] {
  return getCases()
    .filter((c) => matchesFilters(c, filters))
    .map(toRiskCaseSummary)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getCaseFromStore(caseId: string): RiskCaseDetail | undefined {
  const found = getCases().find((c) => c.id === caseId);
  if (!found) return undefined;
  return applyPartialDataFailure(found);
}

export function submitDecisionToStore(input: DecisionInput): DecisionResult {
  const session = getSession();
  const index = session.cases.findIndex((c) => c.id === input.caseId);
  if (index === -1) {
    throw new Error("Case not found");
  }

  const recordedAt = new Date().toISOString();
  const auditEntryId = `${input.caseId}-audit-${Date.now()}`;
  const statusMap = {
    approve: "approved" as const,
    reject: "rejected" as const,
    escalate: "escalated" as const,
  };

  const actionLabel = {
    approve: "Approved",
    reject: "Rejected",
    escalate: "Escalated",
  }[input.action];

  const current = session.cases[index];
  const timelineEntry = {
    id: `${input.caseId}-tl-${Date.now()}`,
    timestamp: recordedAt,
    type: "decision" as const,
    title: actionLabel,
    detail: input.justification,
    actor: input.analystId,
  };

  const updated: RiskCaseDetail = {
    ...current,
    status: statusMap[input.action],
    assignee: input.action === "escalate" ? ESCALATION_SUPERVISOR : current.assignee,
    auditHistory: [
      ...current.auditHistory,
      {
        id: auditEntryId,
        timestamp: recordedAt,
        action: actionLabel,
        actor: input.analystId,
        justification: input.justification,
      },
    ],
    timeline:
      input.action === "escalate"
        ? [
            ...current.timeline,
            timelineEntry,
            {
              id: `${input.caseId}-tl-esc-${Date.now()}`,
              timestamp: recordedAt,
              type: "assignment" as const,
              title: "Escalated to supervisor queue",
              detail: `Reassigned to ${ESCALATION_SUPERVISOR}`,
              actor: input.analystId,
            },
          ]
        : [...current.timeline, timelineEntry],
  };

  const cases = [...session.cases];
  cases[index] = updated;
  setSession({ ...session, cases });

  return {
    caseId: input.caseId,
    action: input.action,
    recordedAt,
    auditEntryId,
  };
}

export function resetCaseStore(): void {
  setSession(createScenarioSession("standard"));
}

export function getDashboardMetricsFromStore() {
  const cases = getCases();
  const pending = cases.filter((c) => c.status === "pending" || c.status === "in_review");
  const highRisk = cases.filter(
    (c) =>
      (c.riskLevel === "high" || c.riskLevel === "critical") &&
      (c.status === "pending" || c.status === "in_review"),
  );
  const manualReview = cases.filter(
    (c) => c.status === "pending" || c.status === "in_review" || c.status === "escalated",
  );
  const total = cases.length;

  return {
    pendingCases: pending.length,
    highRiskCases: highRisk.length,
    avgReviewTimeMinutes: 47,
    manualReviewRate: total === 0 ? 0 : Math.round((manualReview.length / total) * 1000) / 10,
  };
}

export { getScenarioCases, createScenarioSession, DEFAULT_DEMO_SIM };
