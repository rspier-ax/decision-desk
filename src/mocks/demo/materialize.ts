import { cloneCaseDetail } from "@/mocks/demo/builders";
import { getCaseTemplate } from "@/mocks/demo/templates";
import type { DemoCaseSeed } from "@/mocks/demo/types";
import type { RiskCaseDetail } from "@/services/risk-provider/types";

const HOUR_MS = 60 * 60 * 1000;

function shiftIso(iso: string, deltaMs: number): string {
  return new Date(new Date(iso).getTime() + deltaMs).toISOString();
}

function shiftCaseTimestamps(
  caseDetail: RiskCaseDetail,
  submittedAt: string,
  slaDueAt: string,
): RiskCaseDetail {
  const deltaMs = new Date(submittedAt).getTime() - new Date(caseDetail.submittedAt).getTime();

  return {
    ...caseDetail,
    submittedAt,
    slaDueAt,
    timeline: caseDetail.timeline.map((entry) => ({
      ...entry,
      timestamp: shiftIso(entry.timestamp, deltaMs),
    })),
    auditHistory: caseDetail.auditHistory.map((entry) => ({
      ...entry,
      timestamp: shiftIso(entry.timestamp, deltaMs),
    })),
  };
}

export function materializeCaseDetail(
  template: RiskCaseDetail,
  submittedHoursAgo: number,
  slaDueInHours: number,
  now: Date,
): RiskCaseDetail {
  const submittedAt = new Date(now.getTime() - submittedHoursAgo * HOUR_MS).toISOString();
  const slaDueAt = new Date(now.getTime() + slaDueInHours * HOUR_MS).toISOString();
  return shiftCaseTimestamps(cloneCaseDetail(template), submittedAt, slaDueAt);
}

export function materializeCase(
  seed: DemoCaseSeed,
  now: Date,
  template = getCaseTemplate(seed.caseId),
): RiskCaseDetail {
  let caseDetail = materializeCaseDetail(
    template,
    seed.submittedHoursAgo,
    seed.slaDueInHours,
    now,
  );

  if (seed.patch) {
    caseDetail = { ...caseDetail, ...seed.patch };
    if (seed.patch.signals) {
      caseDetail.signalCount = seed.patch.signalCount ?? seed.patch.signals.length;
    }
  }

  return caseDetail;
}

export function materializeSeeds(seeds: DemoCaseSeed[], now: Date = new Date()): RiskCaseDetail[] {
  return seeds.map((seed) => materializeCase(seed, now));
}
