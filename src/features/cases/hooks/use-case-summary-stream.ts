"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDemoOptional } from "@/features/demo/demo-provider";
import { queryKeys } from "@/lib/query-keys";
import type { CaseSummary } from "@/services/risk-provider/types";

type StreamState = {
  status: "idle" | "streaming" | "complete" | "error";
  summary: Partial<CaseSummary>;
  error?: string;
};

export function useCaseSummaryStream(caseId: string, initialSummary?: CaseSummary | null) {
  const demo = useDemoOptional();
  const queryClient = useQueryClient();
  const clearedRef = useRef(false);
  const [state, setState] = useState<StreamState>(() =>
    initialSummary
      ? { status: "complete", summary: initialSummary }
      : { status: "idle", summary: {} },
  );

  useEffect(() => {
    clearedRef.current = false;
    setState(
      initialSummary
        ? { status: "complete", summary: initialSummary }
        : { status: "idle", summary: {} },
    );
  }, [caseId]);

  useEffect(() => {
    if (clearedRef.current) {
      if (!initialSummary) {
        clearedRef.current = false;
      }
      return;
    }

    if (initialSummary) {
      setState((current) =>
        current.status === "streaming" ? current : { status: "complete", summary: initialSummary },
      );
    }
  }, [initialSummary]);

  useEffect(() => {
    if (initialSummary || clearedRef.current) return;

    let cancelled = false;

    async function loadPersisted() {
      try {
        const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}/summary`);
        if (!res.ok) return;
        const summary = (await res.json()) as CaseSummary;
        if (!cancelled) {
          setState({ status: "complete", summary });
        }
      } catch {
        // ignore — no persisted summary
      }
    }

    void loadPersisted();
    return () => {
      cancelled = true;
    };
  }, [caseId, initialSummary]);

  const generate = useCallback(
    async (simulateError = false) => {
      const forceRegenerate = state.status === "complete" || state.status === "error";
      clearedRef.current = false;
      setState({ status: "streaming", summary: {} });

      try {
        const params = new URLSearchParams();
        if (simulateError) params.set("simulate", "summary_error");
        if (forceRegenerate) params.set("force", "true");
        const query = params.toString();
        const url = `/api/cases/${encodeURIComponent(caseId)}/summary${query ? `?${query}` : ""}`;
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
        await demo?.persistSession();
        await queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
      } catch (error) {
        setState({
          status: "error",
          summary: {},
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [caseId, demo, queryClient, state.status],
  );

  const reset = useCallback(async () => {
    clearedRef.current = true;
    setState({ status: "idle", summary: {} });

    try {
      await fetch(`/api/cases/${encodeURIComponent(caseId)}/summary`, { method: "DELETE" });
      await demo?.persistSession();
      await queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
    } catch {
      // local state already cleared
    }
  }, [caseId, demo, queryClient]);

  return {
    status: state.status,
    summary: state.summary,
    error: state.error,
    generate,
    reset,
  };
}
