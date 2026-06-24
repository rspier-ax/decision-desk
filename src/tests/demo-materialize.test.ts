import { describe, expect, it } from "vitest";
import { materializeCase, materializeCaseDetail } from "@/mocks/demo/materialize";
import { getCaseTemplate } from "@/mocks/demo/templates";

const ANCHOR = new Date("2026-06-20T12:00:00.000Z");

describe("materializeCase", () => {
  it("shifts timeline and audit timestamps with submittedAt", () => {
    const template = getCaseTemplate("DD-2026-01482");
    const materialized = materializeCaseDetail(template, 4, 8, ANCHOR);

    expect(materialized.submittedAt).toBe(new Date(ANCHOR.getTime() - 4 * 60 * 60 * 1000).toISOString());
    expect(materialized.timeline[0].timestamp).toBe(materialized.submittedAt);
    expect(materialized.auditHistory[0].timestamp).toBe(materialized.timeline[2].timestamp);
  });

  it("applies seed patches after materializing dates", () => {
    const materialized = materializeCase(
      {
        caseId: "DD-2026-01431",
        submittedHoursAgo: 2,
        slaDueInHours: 5,
        patch: { riskLevel: "critical", riskScore: 95 },
      },
      ANCHOR,
    );

    expect(materialized.riskLevel).toBe("critical");
    expect(materialized.riskScore).toBe(95);
  });
});
