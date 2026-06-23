import {
  formatDate,
  formatPercent,
  formatRelativeSla,
  isSlaOverdue,
  riskLabel,
  riskTone,
  statusLabel,
  statusTone,
  suggestedActionLabel,
} from "@/lib/format";
import { cn } from "@/lib/cn";
import type { RiskCaseDetail } from "@/services/risk-provider/types";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

export function CaseHeader({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  return (
    <header className="border border-slate-200 bg-white px-4 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold text-slate-900">{caseDetail.id}</h1>
        <Badge className={statusTone(caseDetail.status)}>{statusLabel(caseDetail.status)}</Badge>
        <Badge className={riskTone(caseDetail.riskLevel)}>
          {riskLabel(caseDetail.riskLevel)} · {caseDetail.riskScore}
        </Badge>
      </div>
      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3 lg:grid-cols-5">
        <div>
          <dt className="text-xs text-slate-500">Applicant</dt>
          <dd className="text-slate-900">{caseDetail.applicantName}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Product</dt>
          <dd className="text-slate-900">{caseDetail.productType}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Assignee</dt>
          <dd className="text-slate-900">{caseDetail.assignee ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">SLA</dt>
          <dd
            className={cn(
              "text-slate-900",
              isSlaOverdue(caseDetail.slaDueAt) && "font-medium text-red-700",
            )}
          >
            {formatRelativeSla(caseDetail.slaDueAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Submitted</dt>
          <dd className="text-slate-900">{formatDate(caseDetail.submittedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}

export function SuggestedActionBar({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  return (
    <Panel title="Suggested action">
      <div className="border-l-2 border-slate-300 pl-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Suggested action
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {suggestedActionLabel(caseDetail.suggestedAction)}
            </p>
            <p className="mt-2 text-sm text-slate-600">{caseDetail.decisionRationale}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Model confidence</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-slate-900">
              {formatPercent(caseDetail.modelConfidence)}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function RiskSignalsTable({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  return (
    <Panel title="Risk signals">
      {caseDetail.signals.length === 0 ? (
        <p className="text-sm text-slate-500">No risk signals recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="w-40 px-2 py-2 text-left font-medium">Signal</th>
                <th scope="col" className="w-28 px-2 py-2 text-left font-medium">Severity</th>
                <th scope="col" className="min-w-0 px-2 py-2 text-left font-medium">Evidence</th>
                <th scope="col" className="w-36 px-2 py-2 text-left font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.signals.map((signal) => (
                <tr key={signal.id} className="border-b border-slate-100">
                  <td className="px-2 py-2">
                    <span className="font-medium text-slate-900">{signal.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{signal.code}</span>
                  </td>
                  <td className="px-2 py-2">
                    <Badge className={riskTone(signal.severity)}>{riskLabel(signal.severity)}</Badge>
                  </td>
                  <td className="min-w-0 px-2 py-2 break-words text-slate-700">{signal.evidence}</td>
                  <td className="px-2 py-2 text-slate-500">{signal.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

export function ApplicantPanel({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  const fields = [
    ["Account ID", caseDetail.applicant.accountId],
    ["Address", caseDetail.applicant.address],
    ["Phone", caseDetail.applicant.phone],
    ["Date of birth", caseDetail.applicant.dateOfBirth],
    ["Email", caseDetail.applicant.email],
    ["Employment", caseDetail.applicant.employmentStatus],
  ] as const;

  return (
    <Panel title="Applicant information">
      <dl className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="text-sm text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
