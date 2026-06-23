"use client";

import { formatDate } from "@/lib/format";
import { useCaseSummaryStream } from "@/features/cases/hooks/use-case-summary-stream";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ErrorState, LoadingState } from "@/components/ui/state-messages";

export function CaseSummaryPanel({ caseId }: { caseId: string }) {
  const { status, summary, error, generate, reset } = useCaseSummaryStream(caseId);
  const isStreaming = status === "streaming";

  return (
    <Panel
      title="Case summary"
      action={
        <div className="flex gap-2">
          {status === "complete" ? (
            <Button size="sm" variant="ghost" onClick={reset}>
              Clear
            </Button>
          ) : null}
          <Button
            size="sm"
            onClick={() => generate()}
            disabled={isStreaming}
            aria-busy={isStreaming}
          >
            {status === "idle" ? "Generate summary" : isStreaming ? "Generating…" : "Refresh summary"}
          </Button>
        </div>
      }
    >
      {status === "idle" ? (
        <p className="text-sm text-slate-500">
          Generate a structured summary of contributing signals and recommended next steps.
        </p>
      ) : null}

      {status === "error" ? (
        <ErrorState title={error ?? "Summary unavailable"} onRetry={() => generate()} />
      ) : null}

      {isStreaming && !summary.executiveSummary ? (
        <LoadingState label="Loading summary sections" />
      ) : null}

      {(summary.executiveSummary || status === "complete") && status !== "error" ? (
        <div className="space-y-4" aria-live="polite" aria-busy={isStreaming}>
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Executive summary
            </h3>
            <p className="mt-1 text-sm text-slate-800">
              {summary.executiveSummary ?? (isStreaming ? "…" : "—")}
            </p>
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Main contributing signals
            </h3>
            {summary.contributingSignals?.length ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {summary.contributingSignals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">{isStreaming ? "…" : "—"}</p>
            )}
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Missing or conflicting information
            </h3>
            {summary.gapsOrConflicts?.length ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-800">
                {summary.gapsOrConflicts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-500">{isStreaming ? "…" : "—"}</p>
            )}
          </section>

          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Suggested next action
            </h3>
            <p className="mt-1 text-sm text-slate-800">
              {summary.suggestedNextAction ?? (isStreaming ? "…" : "—")}
            </p>
          </section>

          {summary.generatedAt ? (
            <dl className="grid gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <dt>Generated</dt>
                <dd className="text-slate-700">{formatDate(summary.generatedAt)}</dd>
              </div>
              <div>
                <dt>Model version</dt>
                <dd className="text-slate-700">{summary.modelVersion}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}
