import { describe, expect, it } from "vitest";
import { createScenarioSession, materializeScenario } from "@/mocks/demo/scenarios";
import { DEMO_SCENARIOS } from "@/mocks/demo/types";
import { cloneSession } from "@/mocks/demo/builders";
import { isSlaOverdue } from "@/lib/format";

const ANCHOR = new Date("2026-06-20T12:00:00.000Z");
const anchorMs = ANCHOR.getTime();

describe("demo scenarios", () => {
  it("loads each scenario with cases", () => {
    for (const scenario of DEMO_SCENARIOS) {
      const cases = materializeScenario(scenario, ANCHOR);
      expect(cases.length).toBeGreaterThan(0);
      expect(cases.every((c) => c.id.startsWith("DD-"))).toBe(true);
    }
  });

  it("materializes relative offsets against a fixed anchor", () => {
    const cases = materializeScenario("standard", ANCHOR);
    const first = cases.find((c) => c.id === "DD-2026-01482");
    expect(first?.submittedAt).toBe(new Date(anchorMs - 2 * 60 * 60 * 1000).toISOString());
    expect(first?.slaDueAt).toBe(new Date(anchorMs + 6 * 60 * 60 * 1000).toISOString());
  });

  it("standard scenario mixes on-time, near-due, and overdue SLAs", () => {
    const cases = materializeScenario("standard", ANCHOR);
    const overdue = cases.filter((c) => isSlaOverdue(c.slaDueAt, anchorMs));
    const onTime = cases.filter((c) => !isSlaOverdue(c.slaDueAt, anchorMs));
    expect(overdue.length).toBeGreaterThan(0);
    expect(onTime.length).toBeGreaterThan(0);
  });

  it("sla-backlog scenario is predominantly overdue", () => {
    const cases = materializeScenario("sla-backlog", ANCHOR);
    const overdue = cases.filter((c) => isSlaOverdue(c.slaDueAt, anchorMs));
    expect(overdue.length / cases.length).toBeGreaterThanOrEqual(0.8);
  });

  it("low-risk scenario keeps cases within SLA at anchor", () => {
    const cases = materializeScenario("low-risk", ANCHOR);
    const onTime = cases.filter((c) => !isSlaOverdue(c.slaDueAt, anchorMs));
    expect(onTime.length / cases.length).toBeGreaterThanOrEqual(0.8);
  });

  it("creates isolated session clones", () => {
    const session = createScenarioSession("standard", ANCHOR);
    const copy = cloneSession(session);
    copy.cases[0].applicantName = "Changed";
    expect(session.cases[0].applicantName).not.toBe("Changed");
  });

  it("does not shift dates when re-reading a materialized session", () => {
    const session = createScenarioSession("standard", ANCHOR);
    const submittedAt = session.cases[0].submittedAt;
    const copy = cloneSession(session);
    expect(copy.cases[0].submittedAt).toBe(submittedAt);
  });
});
