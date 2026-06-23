"use client";

import { formatMinutes, formatRate } from "@/lib/format";
import { useDashboardMetrics } from "@/features/cases/hooks/use-cases";
import { ErrorState, LoadingState } from "@/components/ui/state-messages";

export function DashboardMetrics() {
  const { data, isLoading, isError, refetch } = useDashboardMetrics();

  if (isLoading) return <LoadingState label="Loading metrics" />;
  if (isError || !data) {
    return <ErrorState title="Unable to load dashboard metrics" onRetry={() => refetch()} />;
  }

  const metrics = [
    { label: "Pending cases", value: String(data.pendingCases) },
    { label: "High risk", value: String(data.highRiskCases) },
    { label: "Avg review time", value: formatMinutes(data.avgReviewTimeMinutes) },
    { label: "Manual review rate", value: formatRate(data.manualReviewRate) },
  ];

  return (
    <section
      aria-label="Dashboard metrics"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {metric.label}
          </p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900">
            {metric.value}
          </p>
        </div>
      ))}
    </section>
  );
}
