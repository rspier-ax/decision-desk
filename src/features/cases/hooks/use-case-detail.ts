import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { riskProvider } from "@/services/risk-provider";

export function useCaseDetail(caseId: string) {
  return useQuery({
    queryKey: queryKeys.case(caseId),
    queryFn: () => riskProvider.getCase(caseId),
    enabled: Boolean(caseId),
  });
}
