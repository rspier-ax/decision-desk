import { DashboardMetrics } from "@/components/risk-summary/dashboard-metrics";
import { DecisionQueue } from "@/components/decision-queue/decision-queue";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Review dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Pending applications flagged for manual review.
        </p>
      </header>
      <DashboardMetrics />
      <DecisionQueue />
    </div>
  );
}
