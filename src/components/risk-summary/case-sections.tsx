import {
  formatDate,
  formatPercent,
  formatRelativeSla,
  riskLabel,
  riskTone,
  statusLabel,
  statusTone,
  suggestedActionLabel,
} from "@/lib/format";
import type { RiskCaseDetail } from "@/services/risk-provider/types";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

export function CaseHeader({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  return (
    <header className="border border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{caseDetail.id}</h1>
          <p className="mt-0.5 text-sm text-slate-600">{caseDetail.applicantName} — {caseDetail.productType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={statusTone(caseDetail.status)}>{statusLabel(caseDetail.status)}</Badge>
          <Badge className={riskTone(caseDetail.riskLevel)}>
            {riskLabel(caseDetail.riskLevel)} · {caseDetail.riskScore}
          </Badge>
        </div>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Assignee</dt>
          <dd>{caseDetail.assignee ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">SLA</dt>
          <dd>{formatRelativeSla(caseDetail.slaDueAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Submitted</dt>
          <dd>{formatDate(caseDetail.submittedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}

export function SuggestedActionBar({ caseDetail }: { caseDetail: RiskCaseDetail }) {
  return (
    <Panel title="Suggested action">
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">Suggested action</dt>
          <dd className="font-medium text-slate-900">
            {suggestedActionLabel(caseDetail.suggestedAction)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Model confidence</dt>
          <dd className="font-medium tabular-nums text-slate-900">
            {formatPercent(caseDetail.modelConfidence)}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-sm text-slate-600">{caseDetail.decisionRationale}</p>
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
                <th scope="col" className="px-2 py-2 text-left font-medium">Signal</th>
                <th scope="col" className="px-2 py-2 text-left font-medium">Severity</th>
                <th scope="col" className="px-2 py-2 text-left font-medium">Evidence</th>
                <th scope="col" className="px-2 py-2 text-left font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.signals.map((signal) => (
                <tr key={signal.id} className="border-b border-slate-100">
                  <td className="px-2 py-2">
                    <span className="font-medium">{signal.label}</span>
                    <span className="ml-2 text-xs text-slate-500">{signal.code}</span>
                  </td>
                  <td className="px-2 py-2">
                    <Badge className={riskTone(signal.severity)}>{riskLabel(signal.severity)}</Badge>
                  </td>
                  <td className="px-2 py-2 text-slate-700">{signal.evidence}</td>
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
    ["Date of birth", caseDetail.applicant.dateOfBirth],
    ["Address", caseDetail.applicant.address],
    ["Email", caseDetail.applicant.email],
    ["Phone", caseDetail.applicant.phone],
    ["Employment", caseDetail.applicant.employmentStatus],
  ] as const;

  return (
    <Panel title="Applicant information">
      <dl className="grid gap-3 sm:grid-cols-2">
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
