"use client";

import { useCallback, useState } from "react";
import type { CaseSummary } from "@/services/risk-provider/types";

type StreamState = {
  status: "idle" | "streaming" | "complete" | "error";
  summary: Partial<CaseSummary>;
  error?: string;
};

export function useCaseSummaryStream(caseId: string) {
  const [state, setState] = useState<StreamState>({
    status: "idle",
    summary: {},
  });

  const generate = useCallback(
    async (simulateError = false) => {
      setState({ status: "streaming", summary: {} });

      try {
        const url = `/api/cases/${encodeURIComponent(caseId)}/summary${simulateError ? "?simulate=summary_error" : ""}`;
        const res = await fetch(url, { method: "POST" });

        if (!res.ok) {
          throw new Error("Summary service unavailable");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        const summary: Partial<CaseSummary> = { caseId };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = JSON.parse(line.slice(6)) as {
              key: string;
              value: unknown;
            };

            if (payload.key === "meta") {
              const meta = payload.value as { generatedAt: string; modelVersion: string };
              summary.generatedAt = meta.generatedAt;
              summary.modelVersion = meta.modelVersion;
            } else {
              (summary as Record<string, unknown>)[payload.key] = payload.value;
            }

            setState({ status: "streaming", summary: { ...summary } });
          }
        }

        setState({ status: "complete", summary: summary as CaseSummary });
      } catch (error) {
        setState({
          status: "error",
          summary: {},
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [caseId],
  );

  const reset = useCallback(() => {
    setState({ status: "idle", summary: {} });
  }, []);

  return { ...state, generate, reset };
}
