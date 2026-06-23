import { MOCK_CASES } from "@/mocks/cases";
import type {
  CaseFilters,
  DecisionInput,
  DecisionResult,
  RiskCase,
  RiskCaseDetail,
} from "@/services/risk-provider/types";

let caseStore: RiskCaseDetail[] = MOCK_CASES.map((c) => ({ ...c }));

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

export function listCasesFromStore(filters?: CaseFilters): RiskCase[] {
  return caseStore
    .filter((c) => matchesFilters(c, filters))
    .map(toRiskCaseSummary)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getCaseFromStore(caseId: string): RiskCaseDetail | undefined {
  return caseStore.find((c) => c.id === caseId);
}

export function submitDecisionToStore(input: DecisionInput): DecisionResult {
  const index = caseStore.findIndex((c) => c.id === input.caseId);
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

  const updated: RiskCaseDetail = {
    ...caseStore[index],
    status: statusMap[input.action],
    auditHistory: [
      ...caseStore[index].auditHistory,
      {
        id: auditEntryId,
        timestamp: recordedAt,
        action: actionLabel,
        actor: input.analystId,
        justification: input.justification,
      },
    ],
    timeline: [
      ...caseStore[index].timeline,
      {
        id: `${input.caseId}-tl-${Date.now()}`,
        timestamp: recordedAt,
        type: "decision",
        title: actionLabel,
        detail: input.justification,
        actor: input.analystId,
      },
    ],
  };

  caseStore[index] = updated;

  return {
    caseId: input.caseId,
    action: input.action,
    recordedAt,
    auditEntryId,
  };
}

export function resetCaseStore(): void {
  caseStore = MOCK_CASES.map((c) => ({ ...c }));
}

export function getDashboardMetricsFromStore() {
  const pending = caseStore.filter((c) => c.status === "pending" || c.status === "in_review");
  const highRisk = caseStore.filter(
    (c) => (c.riskLevel === "high" || c.riskLevel === "critical") && (c.status === "pending" || c.status === "in_review"),
  );
  const manualReview = caseStore.filter((c) => c.status === "pending" || c.status === "in_review" || c.status === "escalated");
  const total = caseStore.length;

  return {
    pendingCases: pending.length,
    highRiskCases: highRisk.length,
    avgReviewTimeMinutes: 47,
    manualReviewRate: Math.round((manualReview.length / total) * 1000) / 10,
  };
}
