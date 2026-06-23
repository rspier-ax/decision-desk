import { describe, expect, it } from "vitest";
import { listCasesFromStore } from "@/mocks/store";

describe("decision queue filters", () => {
  it("returns empty when search does not match", () => {
    const results = listCasesFromStore({ search: "ZZZ-NO-MATCH" });
    expect(results).toHaveLength(0);
  });

  it("filters by risk level", () => {
    const results = listCasesFromStore({ riskLevel: ["critical"] });
    expect(results.every((c) => c.riskLevel === "critical")).toBe(true);
  });
});
