import { describe, expect, it } from "vitest";
import { decisionInputSchema, riskCaseSchema } from "@/schemas/case.schema";

describe("schemas", () => {
  it("rejects short justification", () => {
    const result = decisionInputSchema.safeParse({
      caseId: "DD-2026-01482",
      action: "approve",
      justification: "too short",
      analystId: "analyst.jdoe",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid case payload", () => {
    const result = riskCaseSchema.safeParse({
      id: "DD-2026-01482",
      applicantName: "M. Chen",
      productType: "Personal loan",
      submittedAt: "2026-06-20T09:14:22Z",
      riskLevel: "high",
      riskScore: 78,
      status: "pending",
      assignee: "analyst.jdoe",
      slaDueAt: "2026-06-20T17:00:00Z",
      suggestedAction: "review",
      modelConfidence: 0.71,
      signalCount: 4,
    });
    expect(result.success).toBe(true);
  });
});
