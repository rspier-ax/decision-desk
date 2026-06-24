import { MOCK_CASES } from "@/mocks/cases";
import { cloneCaseDetail } from "@/mocks/demo/builders";
import type { RiskCaseDetail } from "@/services/risk-provider/types";

const templateById = new Map<string, RiskCaseDetail>(
  MOCK_CASES.map((caseDetail) => [caseDetail.id, caseDetail]),
);

export function getCaseTemplate(caseId: string): RiskCaseDetail {
  const template = templateById.get(caseId);
  if (!template) {
    throw new Error(`Unknown demo case template: ${caseId}`);
  }
  return cloneCaseDetail(template);
}

export function listCaseTemplateIds(): string[] {
  return [...templateById.keys()];
}
