"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSIGNEES } from "@/mocks/cases";
import {
  formatDate,
  formatRelativeSla,
  isSlaOverdue,
  riskLabel,
  riskTone,
  statusLabel,
  statusTone,
} from "@/lib/format";
import { paginate } from "@/lib/paginate";
import {
  cycleCaseTableSortParam,
  getColumnSortDirection,
  QUEUE_TABLE_COLUMNS,
  sortCases,
  type CaseSort,
  type CaseTableSortColumn,
} from "@/lib/sort-cases";
import { useCases } from "@/features/cases/hooks/use-cases";
import type { CaseFilters, CaseStatus, RiskCase, RiskLevel } from "@/services/risk-provider/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/state-messages";
import { Panel } from "@/components/ui/panel";
import { QueuePagination } from "@/components/decision-queue/queue-pagination";
import { SortColumnHeader } from "@/components/decision-queue/sort-column-header";
import { cn } from "@/lib/cn";

const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];
const STATUSES: CaseStatus[] = ["pending", "in_review", "approved", "rejected", "escalated"];

function SegmentedFilter<T extends string>({
  label,
  options,
  value,
  onChange,
  formatOption,
}: {
  label: string;
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  formatOption: (option: T) => string;
}) {
  const isAll = value.length === 0;

  return (
    <fieldset>
      <legend className="mb-1.5 text-xs font-medium text-slate-600">{label}</legend>
      <div className="inline-flex flex-wrap rounded-sm border border-slate-300 bg-white p-0.5">
        <button
          type="button"
          aria-pressed={isAll}
          onClick={() => onChange([])}
          className={cn(
            "rounded-sm px-2.5 py-1 text-xs font-medium",
            isAll ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-50",
          )}
        >
          All
        </button>
        {options.map((option) => {
          const active = value.length === 1 && value[0] === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange([option])}
              className={cn(
                "rounded-sm px-2.5 py-1 text-xs font-medium",
                active ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-50",
              )}
            >
              {formatOption(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function DecisionQueue() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel[]>([]);
  const [status, setStatus] = useState<CaseStatus[]>([]);
  const [assignee, setAssignee] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortParam, setSortParam] = useState<CaseSort | null>(null);

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

  const sortedData = useMemo(
    () => (data ? sortCases(data, sortParam) : []),
    [data, sortParam],
  );

  const total = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const pageItems = useMemo(
    () => paginate(sortedData, safePage, pageSize),
    [sortedData, safePage, pageSize],
  );

  const hasActiveFilters =
    search.trim().length > 0 || riskLevel.length > 0 || status.length > 0 || assignee.length > 0;

  function goToPage(next: number) {
    setPage(Math.min(Math.max(next, 1), totalPages));
  }

  function resetFilters() {
    setSearch("");
    setRiskLevel([]);
    setStatus([]);
    setAssignee("");
    setPage(1);
  }

  function updateFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  function handleSort(column: CaseTableSortColumn) {
    const next = cycleCaseTableSortParam(column, sortParam);
    setSortParam(next === "" ? null : next);
    setPage(1);
  }

  function openCase(caseId: string) {
    router.push(`/cases/${caseId}`);
  }

  function handleRowKeyDown(event: React.KeyboardEvent, caseId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCase(caseId);
    }
  }

  return (
    <Panel title="Decision queue">
      <div className="space-y-4">
        <div className="rounded-sm border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-end gap-x-5 gap-y-4">
            <label className="block w-full max-w-xs shrink-0 text-xs font-medium text-slate-600">
              Search
              <Input
                type="search"
                value={search}
                onChange={(e) => updateFilter(setSearch, e.target.value)}
                placeholder="Case ID, applicant, product"
                className="mt-1.5"
              />
            </label>

            <SegmentedFilter
              label="Risk level"
              options={RISK_LEVELS}
              value={riskLevel}
              onChange={(next) => updateFilter(setRiskLevel, next)}
              formatOption={riskLabel}
            />
            <SegmentedFilter
              label="Status"
              options={STATUSES}
              value={status}
              onChange={(next) => updateFilter(setStatus, next)}
              formatOption={statusLabel}
            />

            <fieldset className="m-0 shrink-0 border-0 p-0">
              <legend className="mb-1.5 text-xs font-medium text-slate-600">Assignee</legend>
              <DropdownSelect
                compact
                value={assignee}
                onChange={(next) => updateFilter(setAssignee, next)}
                aria-label="Assignee"
                options={[
                  { value: "", label: "All assignees" },
                  ...ASSIGNEES.map((name) => ({ value: name, label: name })),
                ]}
              />
            </fieldset>

            {hasActiveFilters ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-7 shrink-0"
                onClick={resetFilters}
              >
                Clear filters
              </Button>
            ) : null}
          </div>
        </div>

        {isLoading ? <LoadingState label="Loading queue" /> : null}
        {isError ? (
          <ErrorState title="Unable to load decision queue" onRetry={() => refetch()} />
        ) : null}
        {!isLoading && !isError && total === 0 ? (
          <EmptyState
            title="No cases match filters"
            description="Adjust search or filter criteria to see results."
          />
        ) : null}

        {!isLoading && !isError && total > 0 ? (
          <>
            <div className="overflow-x-auto border border-slate-200">
              <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                    {QUEUE_TABLE_COLUMNS.map((column) => (
                      <SortColumnHeader
                        key={column.column}
                        label={column.label}
                        column={column.column}
                        direction={getColumnSortDirection(column.column, sortParam)}
                        onSort={handleSort}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody
                  key={sortParam ?? "default"}
                  className="queue-table-sort-flash"
                >
                  {pageItems.map((caseItem: RiskCase) => (
                    <tr
                      key={caseItem.id}
                      tabIndex={0}
                      role="link"
                      aria-label={`Open case ${caseItem.id}`}
                      onClick={() => openCase(caseItem.id)}
                      onKeyDown={(e) => handleRowKeyDown(e, caseItem.id)}
                      className="group cursor-pointer border-b border-slate-100 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-600"
                    >
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-900">{caseItem.id}</span>
                        <span className="ml-2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                          Open case →
                        </span>
                      </td>
                      <td className="px-4 py-4">{caseItem.applicantName}</td>
                      <td className="px-4 py-4">{caseItem.productType}</td>
                      <td className="px-4 py-4">
                        <Badge className={riskTone(caseItem.riskLevel)}>
                          {riskLabel(caseItem.riskLevel)} ({caseItem.riskScore})
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={statusTone(caseItem.status)}>
                          {statusLabel(caseItem.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">{caseItem.assignee ?? "Unassigned"}</td>
                      <td
                        className={cn(
                          "px-4 py-4 tabular-nums",
                          isSlaOverdue(caseItem.slaDueAt) && "font-medium text-red-700",
                        )}
                      >
                        {formatRelativeSla(caseItem.slaDueAt)}
                      </td>
                      <td className="px-4 py-4 tabular-nums">{formatDate(caseItem.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <QueuePagination
              page={page}
              pageSize={pageSize}
              totalItems={total}
              onPageChange={goToPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        ) : null}
      </div>
    </Panel>
  );
}
