import { createEmptySession } from "@/mocks/demo/builders";
import { materializeSeeds } from "@/mocks/demo/materialize";
import { getScenarioSeeds } from "@/mocks/demo/scenarios/scenario-seeds";
import type { DemoScenario, DemoSessionState } from "@/mocks/demo/types";
import type { RiskCaseDetail } from "@/services/risk-provider/types";

const INTEGRATION_FAILURE_EVIDENCE = "Signal unavailable — upstream integration timeout";

function applyIntegrationSignalFailures(cases: RiskCaseDetail[]): RiskCaseDetail[] {
  return cases.map((caseDetail, index) => {
    if (index % 2 === 0 || caseDetail.signals.length === 0) {
      return caseDetail;
    }

    return {
      ...caseDetail,
      signals: caseDetail.signals.map((signal) => ({
        ...signal,
        evidence: INTEGRATION_FAILURE_EVIDENCE,
        source: "integration_gateway",
      })),
    };
  });
}

/** Materialize scenario seeds into absolute ISO dates — call once on load/reset only. */
export function materializeScenario(
  scenario: DemoScenario,
  now: Date = new Date(),
): RiskCaseDetail[] {
  const seeds = getScenarioSeeds(scenario);
  const cases = materializeSeeds(seeds, now);

  if (scenario === "integration-instability") {
    return applyIntegrationSignalFailures(cases);
  }

  return cases;
}

export function getScenarioCases(
  scenario: DemoScenario,
  now: Date = new Date(),
): RiskCaseDetail[] {
  return materializeScenario(scenario, now);
}

export function createScenarioSession(
  scenario: DemoScenario,
  now: Date = new Date(),
): DemoSessionState {
  return createEmptySession(scenario, materializeScenario(scenario, now));
}

export { getScenarioSeeds, SCENARIO_SEEDS } from "@/mocks/demo/scenarios/scenario-seeds";
