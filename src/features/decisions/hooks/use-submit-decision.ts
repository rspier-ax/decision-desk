import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDemoOptional } from "@/features/demo/demo-provider";
import { queryKeys } from "@/lib/query-keys";
import { riskProvider } from "@/services/risk-provider";
import type { DecisionInput } from "@/services/risk-provider/types";

export function useSubmitDecision(caseId: string) {
  const queryClient = useQueryClient();
  const demo = useDemoOptional();

  return useMutation({
    mutationFn: (input: Omit<DecisionInput, "caseId">) =>
      riskProvider.submitDecision({ ...input, caseId }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.metrics() });
      await demo?.persistSession();
    },
  });
}
