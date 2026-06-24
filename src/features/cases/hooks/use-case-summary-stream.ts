"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDemoOptional } from "@/features/demo/demo-provider";
import { queryKeys } from "@/lib/query-keys";
import type { CaseSummary } from "@/services/risk-provider/types";

type StreamState = {
  status: "idle" | "streaming" | "complete" | "error";
  summary: Partial<CaseSummary>;
  error?: string;
};

function emptyIdle(): StreamState {
  return { status: "idle", summary: {} };
}

function completeState(summary: Partial<CaseSummary>): StreamState {
  return { status: "complete", summary };
}

function resolveDisplayState(
  interaction: StreamState,
  initialSummary: CaseSummary | null | undefined,
  persistedSummary: CaseSummary | null,
  dismissedPersisted: boolean,
): StreamState {
  if (interaction.status === "streaming" || interaction.status === "error") {
    return interaction;
  }

  if (dismissedPersisted) {
    if (interaction.status === "complete" && interaction.summary.executiveSummary) {
      return interaction;
    }
    return emptyIdle();
  }

  if (initialSummary) {
    return completeState(initialSummary);
  }

  if (persistedSummary) {
    return completeState(persistedSummary);
  }

  if (interaction.status === "complete") {
    return interaction;
  }

  return emptyIdle();
}

export function useCaseSummaryStream(caseId: string, initialSummary?: CaseSummary | null) {
  const demo = useDemoOptional();
  const queryClient = useQueryClient();

  const [trackedCaseId, setTrackedCaseId] = useState(caseId);
  const [interaction, setInteraction] = useState<StreamState>(() =>
    initialSummary ? completeState(initialSummary) : emptyIdle(),
  );
  const [persistedSummary, setPersistedSummary] = useState<CaseSummary | null>(null);
  const [dismissedPersisted, setDismissedPersisted] = useState(false);

  if (trackedCaseId !== caseId) {
    setTrackedCaseId(caseId);
    setInteraction(initialSummary ? completeState(initialSummary) : emptyIdle());
    setPersistedSummary(null);
    setDismissedPersisted(false);
  }

  useEffect(() => {
    if (initialSummary || dismissedPersisted) return;

    let cancelled = false;

    async function loadPersisted() {
      try {
        const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}/summary`);
        if (!res.ok) return;
        const summary = (await res.json()) as CaseSummary;
        if (!cancelled && summary.executiveSummary) {
          setPersistedSummary(summary);
        }
      } catch {
        // ignore — no persisted summary
      }
    }

    void loadPersisted();
    return () => {
      cancelled = true;
    };
  }, [caseId, initialSummary, dismissedPersisted]);

  const displayState = useMemo(
    () => resolveDisplayState(interaction, initialSummary, persistedSummary, dismissedPersisted),
    [interaction, initialSummary, persistedSummary, dismissedPersisted],
  );

  const generate = useCallback(
    async (simulateError = false) => {
      const forceRegenerate =
        displayState.status === "complete" || displayState.status === "error";

      setDismissedPersisted(false);
      setInteraction({ status: "streaming", summary: {} });

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

            setInteraction({ status: "streaming", summary: { ...summary } });
          }
        }

        setInteraction({ status: "complete", summary: summary as CaseSummary });
        await demo?.persistSession();
        await queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
      } catch (error) {
        setInteraction({
          status: "error",
          summary: {},
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [caseId, demo, displayState.status, queryClient],
  );

  const reset = useCallback(async () => {
    setDismissedPersisted(true);
    setPersistedSummary(null);
    setInteraction(emptyIdle());

    try {
      await fetch(`/api/cases/${encodeURIComponent(caseId)}/summary`, { method: "DELETE" });
      await demo?.persistSession();
      await queryClient.invalidateQueries({ queryKey: queryKeys.case(caseId) });
    } catch {
      // local state already cleared
    }
  }, [caseId, demo, queryClient]);

  return {
    status: displayState.status,
    summary: displayState.summary,
    error: interaction.error,
    generate,
    reset,
  };
}
