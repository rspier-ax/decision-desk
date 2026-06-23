import type { CaseFilters } from "@/services/risk-provider/types";

export const queryKeys = {
  cases: (filters?: CaseFilters) => ["cases", filters ?? {}] as const,
  case: (id: string) => ["case", id] as const,
  metrics: () => ["metrics"] as const,
};
