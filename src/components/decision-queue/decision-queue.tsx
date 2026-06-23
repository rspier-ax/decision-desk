"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ASSIGNEES } from "@/mocks/cases";
import {
  formatDate,
  formatRelativeSla,
  riskLabel,
  riskTone,
  statusLabel,
  statusTone,
} from "@/lib/format";
import { useCases } from "@/features/cases/hooks/use-cases";
import type { CaseFilters, CaseStatus, RiskCase, RiskLevel } from "@/services/risk-provider/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state-messages";
import { Panel } from "@/components/ui/panel";

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];
const STATUSES: CaseStatus[] = ["pending", "in_review", "approved", "rejected", "escalated"];

export function DecisionQueue() {
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel[]>([]);
  const [status, setStatus] = useState<CaseStatus[]>([]);
  const [assignee, setAssignee] = useState("");

  const filters: CaseFilters = useMemo(
    () => ({
      search: search.trim() || undefined,
      riskLevel: riskLevel.length ? riskLevel : undefined,
      status: status.length ? status : undefined,
      assignee: assignee || undefined,
    }),
    [search, riskLevel, status, assignee],
  );

  const { data, isLoading, isError, refetch } = useCases(filters);

  function toggleRisk(level: RiskLevel) {
    setRiskLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  }

  function toggleStatus(value: CaseStatus) {
    setStatus((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  }

  return (
    <Panel title="Decision queue">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-medium text-slate-700">
            Search
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Case ID, applicant, product"
              className="mt-1 w-full border border-slate-300 px-2 py-1.5 text-sm"
            />
          </label>
          <fieldset>
            <legend className="text-xs font-medium text-slate-700">Risk level</legend>
            <div className="mt-1 flex flex-wrap gap-1">
              {RISK_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  aria-pressed={riskLevel.includes(level)}
                  onClick={() => toggleRisk(level)}
                  className="rounded-sm border border-slate-300 px-2 py-0.5 text-xs data-[active=true]:border-slate-700 data-[active=true]:bg-slate-100"
                  data-active={riskLevel.includes(level)}
                >
                  {riskLabel(level)}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-xs font-medium text-slate-700">Status</legend>
            <div className="mt-1 flex flex-wrap gap-1">
              {STATUSES.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={status.includes(value)}
                  onClick={() => toggleStatus(value)}
                  className="rounded-sm border border-slate-300 px-2 py-0.5 text-xs data-[active=true]:border-slate-700 data-[active=true]:bg-slate-100"
                  data-active={status.includes(value)}
                >
                  {statusLabel(value)}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-xs font-medium text-slate-700">
            Assignee
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="mt-1 w-full border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {ASSIGNEES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? <LoadingState label="Loading queue" /> : null}
        {isError ? (
          <ErrorState title="Unable to load decision queue" onRetry={() => refetch()} />
        ) : null}
        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="No cases match filters"
            description="Adjust search or filter criteria to see results."
          />
        ) : null}

        {!isLoading && !isError && data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="px-2 py-2 font-medium">Case ID</th>
                  <th scope="col" className="px-2 py-2 font-medium">Applicant</th>
                  <th scope="col" className="px-2 py-2 font-medium">Product</th>
                  <th scope="col" className="px-2 py-2 font-medium">Risk</th>
                  <th scope="col" className="px-2 py-2 font-medium">Status</th>
                  <th scope="col" className="px-2 py-2 font-medium">Assignee</th>
                  <th scope="col" className="px-2 py-2 font-medium">SLA</th>
                  <th scope="col" className="px-2 py-2 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.map((caseItem: RiskCase) => (
                  <tr key={caseItem.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-2 py-2">
                      <Link
                        href={`/cases/${caseItem.id}`}
                        className="font-medium text-slate-900 underline-offset-2 hover:underline"
                      >
                        {caseItem.id}
                      </Link>
                    </td>
                    <td className="px-2 py-2">{caseItem.applicantName}</td>
                    <td className="px-2 py-2">{caseItem.productType}</td>
                    <td className="px-2 py-2">
                      <Badge className={riskTone(caseItem.riskLevel)}>
                        {riskLabel(caseItem.riskLevel)} ({caseItem.riskScore})
                      </Badge>
                    </td>
                    <td className="px-2 py-2">
                      <Badge className={statusTone(caseItem.status)}>
                        {statusLabel(caseItem.status)}
                      </Badge>
                    </td>
                    <td className="px-2 py-2">{caseItem.assignee ?? "Unassigned"}</td>
                    <td className="px-2 py-2 tabular-nums">{formatRelativeSla(caseItem.slaDueAt)}</td>
                    <td className="px-2 py-2 tabular-nums">{formatDate(caseItem.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
