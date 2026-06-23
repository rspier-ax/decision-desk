import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { riskProvider } from "@/services/risk-provider";
import type { CaseFilters, DashboardMetrics } from "@/services/risk-provider/types";

export function useCases(filters: CaseFilters) {
  return useQuery({
    queryKey: queryKeys.cases(filters),
    queryFn: () => riskProvider.listCases(filters),
  });
}

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: queryKeys.metrics(),
    queryFn: async () => {
      const res = await fetch("/api/cases?metrics=true");
      if (!res.ok) throw new Error("Failed to load metrics");
      return res.json();
    },
  });
}
