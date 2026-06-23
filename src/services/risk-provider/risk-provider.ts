import type {
  CaseFilters,
  DecisionInput,
  DecisionResult,
  RiskCase,
  RiskCaseDetail,
} from "./types";

export interface RiskProvider {
  listCases(filters?: CaseFilters): Promise<RiskCase[]>;
  getCase(caseId: string): Promise<RiskCaseDetail>;
  submitDecision(input: DecisionInput): Promise<DecisionResult>;
}
