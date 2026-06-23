import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { riskProvider } from "@/services/risk-provider";
import type { DecisionInput } from "@/services/risk-provider/types";

export function useSubmitDecision(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<DecisionInput, "caseId">) =>
      riskProvider.submitDecision({ ...input, caseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() });
    },
  });
}
