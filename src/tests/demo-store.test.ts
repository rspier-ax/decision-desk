import { describe, expect, it, beforeEach } from "vitest";
import {
  addIncomingCasesToStore,
  exportSession,
  getDashboardMetricsFromStore,
  hydrateSession,
  listCasesFromStore,
  loadScenario,
  resetScenario,
  saveGeneratedSummary,
  submitDecisionToStore,
} from "@/mocks/store";
import { createScenarioSession } from "@/mocks/demo/scenarios";
import { buildCaseSummary } from "@/mocks/summary-templates";

describe("demo store session", () => {
  beforeEach(() => {
    hydrateSession(createScenarioSession("standard"));
  });

  it("resets active scenario to baseline", () => {
    const before = exportSession().cases.length;
    submitDecisionToStore({
      caseId: "DD-2026-01482",
      action: "approve",
      justification: "Verified identity and employment documentation.",
      analystId: "analyst.jdoe",
    });
    resetScenario();
    expect(exportSession().cases.find((c) => c.id === "DD-2026-01482")?.status).toBe("pending");
    expect(exportSession().cases.length).toBe(before);
  });

  it("loadScenario updates listCasesFromStore", () => {
    hydrateSession(createScenarioSession("standard"));
    expect(listCasesFromStore().length).toBe(14);

    loadScenario("sla-backlog");
    const cases = listCasesFromStore();
    expect(cases.length).toBe(10);
    expect(exportSession().scenario).toBe("sla-backlog");
  });

  it("adds incoming cases deterministically", () => {
    const beforeCount = exportSession().cases.length;
    const { addedCount } = addIncomingCasesToStore();
    expect(addedCount).toBeGreaterThan(0);
    expect(exportSession().cases.length).toBe(beforeCount + addedCount);
  });

  it("updates metrics after approval", () => {
    const pendingBefore = getDashboardMetricsFromStore().pendingCases;
    submitDecisionToStore({
      caseId: "DD-2026-01482",
      action: "approve",
      justification: "Verified identity and employment documentation.",
      analystId: "analyst.jdoe",
    });
    expect(getDashboardMetricsFromStore().pendingCases).toBeLessThan(pendingBefore);
  });

  it("escalates assignee to supervisor", () => {
    submitDecisionToStore({
      caseId: "DD-2026-01482",
      action: "escalate",
      justification: "Requires supervisor review for device signals.",
      analystId: "analyst.jdoe",
    });
    const updated = exportSession().cases.find((c) => c.id === "DD-2026-01482");
    expect(updated?.status).toBe("escalated");
    expect(updated?.assignee).toBe("supervisor.rkim");
  });

  it("persists generated summaries in session", () => {
    const summary = buildCaseSummary("DD-2026-01482", "M. Chen", ["Signal"], ["Gap"], "Review");
    saveGeneratedSummary("DD-2026-01482", summary);
    expect(exportSession().generatedSummaries["DD-2026-01482"]?.executiveSummary).toBeTruthy();
  });
});
