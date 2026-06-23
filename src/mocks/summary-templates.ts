import type { CaseSummary } from "@/services/risk-provider/types";

export function buildCaseSummary(
  caseId: string,
  applicantName: string,
  signals: string[],
  gaps: string[],
  suggestedAction: string,
): CaseSummary {
  return {
    caseId,
    executiveSummary: `Application for ${applicantName} (${caseId}) was flagged for manual review based on ${signals.length} contributing signal(s). Primary concerns relate to identity verification and affordability checks.`,
    contributingSignals: signals,
    gapsOrConflicts: gaps,
    suggestedNextAction: suggestedAction,
    generatedAt: new Date().toISOString(),
    modelVersion: "summary-model-1.4.0",
  };
}

export const SUMMARY_STREAM_SECTIONS = [
  "executiveSummary",
  "contributingSignals",
  "gapsOrConflicts",
  "suggestedNextAction",
] as const;
