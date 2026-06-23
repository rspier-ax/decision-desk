"use client";

import Link from "next/link";
import { useCaseDetail } from "@/features/cases/hooks/use-case-detail";
import { DecisionForm } from "@/features/decisions/components/decision-form";
import { AuditTimeline } from "@/components/audit-timeline/audit-timeline";
import { EventTimeline } from "@/components/audit-timeline/event-timeline";
import { CaseSummaryPanel } from "@/components/case-summary/case-summary-panel";
import {
  ApplicantPanel,
  CaseHeader,
  RiskSignalsTable,
  SuggestedActionBar,
} from "@/components/risk-summary/case-sections";
import { ErrorState, LoadingState } from "@/components/ui/state-messages";

export function CaseReviewPage({ caseId }: { caseId: string }) {
  const { data, isLoading, isError, refetch } = useCaseDetail(caseId);

  if (isLoading) return <LoadingState label="Loading case" />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load case details"
        onRetry={() => refetch()}
      />
    );
  }

  const isClosed = data.status === "approved" || data.status === "rejected";

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to dashboard
        </Link>
      </nav>

      <CaseHeader caseDetail={data} />
      <SuggestedActionBar caseDetail={data} />
      <RiskSignalsTable caseDetail={data} />
      <ApplicantPanel caseDetail={data} />
      <EventTimeline events={data.timeline} />
      <CaseSummaryPanel caseId={data.id} />
      <DecisionForm caseId={data.id} disabled={isClosed} />
      <AuditTimeline entries={data.auditHistory} />
    </div>
  );
}
