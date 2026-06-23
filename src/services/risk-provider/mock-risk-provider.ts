import type { CaseFilters, DecisionInput } from "@/services/risk-provider/types";
import type { RiskProvider } from "./risk-provider";

function buildQuery(filters?: CaseFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.riskLevel?.length) params.set("riskLevel", filters.riskLevel.join(","));
  if (filters.status?.length) params.set("status", filters.status.join(","));
  if (filters.assignee) params.set("assignee", filters.assignee);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export class MockRiskProvider implements RiskProvider {
  async listCases(filters?: CaseFilters) {
    const res = await fetch(`/api/cases${buildQuery(filters)}`);
    if (!res.ok) throw new Error("Failed to load cases");
    return res.json();
  }

  async getCase(caseId: string) {
    const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}`);
    if (!res.ok) throw new Error("Failed to load case");
    return res.json();
  }

  async submitDecision(input: DecisionInput) {
    const res = await fetch(`/api/cases/${encodeURIComponent(input.caseId)}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to submit decision");
    }
    return res.json();
  }
}

export const riskProvider = new MockRiskProvider();
