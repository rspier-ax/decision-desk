import { describe, expect, it } from "vitest";
import type { RiskCase } from "@/services/risk-provider/types";
import {
  cycleCaseTableSortParam,
  getColumnSortDirection,
  sortCases,
} from "@/lib/sort-cases";

const sample: RiskCase[] = [
  {
    id: "DD-B",
    applicantName: "Beta",
    productType: "Loan",
    submittedAt: "2026-01-02T10:00:00Z",
    riskLevel: "high",
    riskScore: 80,
    status: "pending",
    assignee: null,
    slaDueAt: "2026-01-10T10:00:00Z",
    suggestedAction: "review",
    modelConfidence: 0.5,
    signalCount: 2,
  },
  {
    id: "DD-A",
    applicantName: "Alpha",
    productType: "Card",
    submittedAt: "2026-01-03T10:00:00Z",
    riskLevel: "critical",
    riskScore: 95,
    status: "in_review",
    assignee: "Jordan Lee",
    slaDueAt: "2026-01-05T10:00:00Z",
    suggestedAction: "reject",
    modelConfidence: 0.8,
    signalCount: 4,
  },
];

describe("sortCases", () => {
  it("uses sla ascending as default order", () => {
    expect(sortCases(sample, null).map((item) => item.id)).toEqual(["DD-A", "DD-B"]);
  });

  it("sorts by case id ascending", () => {
    expect(sortCases(sample, "id_asc").map((item) => item.id)).toEqual(["DD-A", "DD-B"]);
  });

  it("sorts by risk score descending", () => {
    expect(sortCases(sample, "risk_desc").map((item) => item.id)).toEqual(["DD-A", "DD-B"]);
  });
});

describe("cycleCaseTableSortParam", () => {
  it("cycles asc, desc, then clear", () => {
    expect(cycleCaseTableSortParam("sla", null)).toBe("sla_asc");
    expect(cycleCaseTableSortParam("sla", "sla_asc")).toBe("sla_desc");
    expect(cycleCaseTableSortParam("sla", "sla_desc")).toBe("");
  });
});

describe("getColumnSortDirection", () => {
  it("returns null when column is not actively sorted", () => {
    expect(getColumnSortDirection("sla", null)).toBeNull();
    expect(getColumnSortDirection("id", "sla_asc")).toBeNull();
  });

  it("returns direction for active column", () => {
    expect(getColumnSortDirection("risk", "risk_desc")).toBe("desc");
  });
});
