import { NextResponse } from "next/server";
import type { CaseFilters } from "@/services/risk-provider/types";
import type { RiskLevel, CaseStatus } from "@/services/risk-provider/types";
import {
  applySimulatedLatency,
  getDashboardMetricsFromStore,
  listCasesFromStore,
} from "@/mocks/store";

function parseFilters(searchParams: URLSearchParams): CaseFilters {
  const filters: CaseFilters = {};
  const search = searchParams.get("search");
  if (search) filters.search = search;

  const riskLevel = searchParams.get("riskLevel");
  if (riskLevel) filters.riskLevel = riskLevel.split(",") as RiskLevel[];

  const status = searchParams.get("status");
  if (status) filters.status = status.split(",") as CaseStatus[];

  const assignee = searchParams.get("assignee");
  if (assignee) filters.assignee = assignee;

  const dateFrom = searchParams.get("dateFrom");
  if (dateFrom) filters.dateFrom = dateFrom;

  const dateTo = searchParams.get("dateTo");
  if (dateTo) filters.dateTo = dateTo;

  return filters;
}

export async function GET(request: Request) {
  await applySimulatedLatency();
  const { searchParams } = new URL(request.url);

  if (searchParams.get("metrics") === "true") {
    return NextResponse.json(getDashboardMetricsFromStore());
  }

  const filters = parseFilters(searchParams);
  const cases = listCasesFromStore(filters);
  return NextResponse.json(cases);
}
