export type RiskLevel = "low" | "medium" | "high" | "critical";
export type CaseStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "escalated";
export type SuggestedAction = "approve" | "reject" | "escalate" | "review";
export type DecisionAction = "approve" | "reject" | "escalate";

export interface CaseFilters {
  search?: string;
  riskLevel?: RiskLevel[];
  status?: CaseStatus[];
  assignee?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface RiskSignal {
  id: string;
  code: string;
  label: string;
  severity: RiskLevel;
  evidence: string;
  source: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "system" | "transaction" | "decision" | "assignment";
  title: string;
  detail?: string;
  actor?: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  justification?: string;
  metadata?: Record<string, string>;
}

export interface RiskCase {
  id: string;
  applicantName: string;
  productType: string;
  submittedAt: string;
  riskLevel: RiskLevel;
  riskScore: number;
  status: CaseStatus;
  assignee: string | null;
  slaDueAt: string;
  suggestedAction: SuggestedAction;
  modelConfidence: number;
  signalCount: number;
}

export interface RiskCaseDetail extends RiskCase {
  applicant: {
    accountId: string;
    dateOfBirth: string;
    address: string;
    email: string;
    phone: string;
    employmentStatus: string;
  };
  signals: RiskSignal[];
  decisionRationale: string;
  timeline: TimelineEvent[];
  auditHistory: AuditEntry[];
  rulesetVersion: string;
}

export interface DecisionInput {
  caseId: string;
  action: DecisionAction;
  justification: string;
  analystId: string;
}

export interface DecisionResult {
  caseId: string;
  action: DecisionAction;
  recordedAt: string;
  auditEntryId: string;
}

export interface CaseSummary {
  caseId: string;
  executiveSummary: string;
  contributingSignals: string[];
  gapsOrConflicts: string[];
  suggestedNextAction: string;
  generatedAt: string;
  modelVersion: string;
}

export interface DashboardMetrics {
  pendingCases: number;
  highRiskCases: number;
  avgReviewTimeMinutes: number;
  manualReviewRate: number;
}
