import type { DemoCaseSeed, DemoScenario } from "@/mocks/demo/types";

const STANDARD_SEEDS: DemoCaseSeed[] = [
  { caseId: "DD-2026-01482", submittedHoursAgo: 2, slaDueInHours: 6 },
  { caseId: "DD-2026-01471", submittedHoursAgo: 4, slaDueInHours: 3 },
  { caseId: "DD-2026-01465", submittedHoursAgo: 6, slaDueInHours: -1 },
  { caseId: "DD-2026-01458", submittedHoursAgo: 8, slaDueInHours: -2 },
  { caseId: "DD-2026-01452", submittedHoursAgo: 1, slaDueInHours: 8 },
  { caseId: "DD-2026-01444", submittedHoursAgo: 12, slaDueInHours: 1 },
  { caseId: "DD-2026-01438", submittedHoursAgo: 3, slaDueInHours: 5 },
  { caseId: "DD-2026-01431", submittedHoursAgo: 18, slaDueInHours: -4 },
  { caseId: "DD-2026-01425", submittedHoursAgo: 5, slaDueInHours: 2 },
  { caseId: "DD-2026-01419", submittedHoursAgo: 10, slaDueInHours: -3 },
  { caseId: "DD-2026-01412", submittedHoursAgo: 2.5, slaDueInHours: 7 },
  { caseId: "DD-2026-01406", submittedHoursAgo: 24, slaDueInHours: 1 },
  { caseId: "DD-2026-01398", submittedHoursAgo: 7, slaDueInHours: 4 },
  { caseId: "DD-2026-01391", submittedHoursAgo: 15, slaDueInHours: -5 },
];

const HIGH_RISK_SURGE_SEEDS: DemoCaseSeed[] = [
  {
    caseId: "DD-2026-01482",
    submittedHoursAgo: 3,
    slaDueInHours: 4,
    patch: { riskLevel: "critical", riskScore: 91, status: "pending", suggestedAction: "review" },
  },
  {
    caseId: "DD-2026-01465",
    submittedHoursAgo: 6,
    slaDueInHours: 2,
    patch: { riskLevel: "high", riskScore: 82, status: "pending", suggestedAction: "review" },
  },
  {
    caseId: "DD-2026-01458",
    submittedHoursAgo: 10,
    slaDueInHours: -1,
    patch: { riskLevel: "high", riskScore: 78, status: "pending", suggestedAction: "review" },
  },
  {
    caseId: "DD-2026-01444",
    submittedHoursAgo: 14,
    slaDueInHours: 6,
    patch: { riskLevel: "high", riskScore: 76, status: "pending", suggestedAction: "review" },
  },
  {
    caseId: "DD-2026-01431",
    submittedHoursAgo: 20,
    slaDueInHours: -3,
    patch: { riskLevel: "critical", riskScore: 88, status: "pending", suggestedAction: "review" },
  },
];

const SLA_BACKLOG_SEEDS: DemoCaseSeed[] = [
  { caseId: "DD-2026-01482", submittedHoursAgo: 72, slaDueInHours: -48 },
  { caseId: "DD-2026-01471", submittedHoursAgo: 80, slaDueInHours: -52 },
  { caseId: "DD-2026-01465", submittedHoursAgo: 88, slaDueInHours: -56 },
  { caseId: "DD-2026-01458", submittedHoursAgo: 96, slaDueInHours: -72 },
  { caseId: "DD-2026-01452", submittedHoursAgo: 68, slaDueInHours: -40 },
  { caseId: "DD-2026-01444", submittedHoursAgo: 76, slaDueInHours: -44 },
  { caseId: "DD-2026-01438", submittedHoursAgo: 84, slaDueInHours: -60 },
  { caseId: "DD-2026-01431", submittedHoursAgo: 92, slaDueInHours: -68 },
  { caseId: "DD-2026-01425", submittedHoursAgo: 100, slaDueInHours: -80 },
  { caseId: "DD-2026-01419", submittedHoursAgo: 108, slaDueInHours: -96 },
];

const LOW_RISK_SEEDS: DemoCaseSeed[] = [
  {
    caseId: "DD-2026-01438",
    submittedHoursAgo: 1,
    slaDueInHours: 10,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01425",
    submittedHoursAgo: 2,
    slaDueInHours: 12,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01419",
    submittedHoursAgo: 1.5,
    slaDueInHours: 11,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01412",
    submittedHoursAgo: 3,
    slaDueInHours: 9,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01406",
    submittedHoursAgo: 2,
    slaDueInHours: 8,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01398",
    submittedHoursAgo: 4,
    slaDueInHours: 10,
    patch: { suggestedAction: "approve" },
  },
  {
    caseId: "DD-2026-01391",
    submittedHoursAgo: 5,
    slaDueInHours: 12,
    patch: { suggestedAction: "approve", status: "pending" },
  },
  {
    caseId: "DD-2026-01471",
    submittedHoursAgo: 2.5,
    slaDueInHours: 8,
    patch: { suggestedAction: "approve", status: "pending" },
  },
  {
    caseId: "DD-2026-01452",
    submittedHoursAgo: 3.5,
    slaDueInHours: 9,
    patch: { suggestedAction: "approve", status: "pending" },
  },
];

function integrationInstabilitySeeds(): DemoCaseSeed[] {
  const baseIds = [
    "DD-2026-01482",
    "DD-2026-01471",
    "DD-2026-01465",
    "DD-2026-01458",
    "DD-2026-01452",
    "DD-2026-01444",
    "DD-2026-01438",
    "DD-2026-01431",
    "DD-2026-01425",
    "DD-2026-01419",
  ];

  const slaOffsets = [6, 4, 5, 3, 7, 2, 6, 4, 5, 3];

  return baseIds.map((caseId, index) => ({
    caseId,
    submittedHoursAgo: 2 + index * 0.5,
    slaDueInHours: slaOffsets[index] ?? 4,
    patch:
      index % 2 === 0
        ? { signals: [], signalCount: 0 }
        : undefined,
  }));
}

export const SCENARIO_SEEDS: Record<DemoScenario, DemoCaseSeed[]> = {
  standard: STANDARD_SEEDS,
  "high-risk-surge": HIGH_RISK_SURGE_SEEDS,
  "sla-backlog": SLA_BACKLOG_SEEDS,
  "low-risk": LOW_RISK_SEEDS,
  "integration-instability": integrationInstabilitySeeds(),
};

export function getScenarioSeeds(scenario: DemoScenario): DemoCaseSeed[] {
  return SCENARIO_SEEDS[scenario];
}
